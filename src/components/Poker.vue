<script setup>
import { shallowRef, triggerRef, ref, computed, watch, onBeforeUnmount, nextTick } from 'vue'
import {
  createGame, startHand, applyAction, legalActions, decideBotAction,
  potTotal,
} from '../poker/engine.js'
import { evaluateHand, rankLabel } from '../poker/evaluator.js'
import PlayerSeat from './poker/PlayerSeat.vue'

// Card sprites: Kenney "Playing Cards Pack" (CC0) — public/poker/cards
const SPRITE_BASE = `${import.meta.env.BASE_URL}poker/cards/`
const cardSrc = (card) => {
  if (!card) return `${SPRITE_BASE}card_back.png`
  const r = card.rank <= 10 ? String(card.rank).padStart(2, '0') : rankLabel(card.rank)
  return `${SPRITE_BASE}card_${card.suit}_${r}.png`
}
const cardAlt = (card) => card ? `${rankLabel(card.rank)} of ${card.suit}` : 'Face-down card'

const STARTING_CHIPS = 1000
const BOT_DELAY = 750

const PLAYER_SETUP = [
  { name: 'You', isHuman: true },
  { name: 'Ali', style: 'tight' },
  { name: 'Mei', style: 'balanced' },
  { name: 'Raju', style: 'loose' },
]

const game = shallowRef(newGame())
const raiseTo = ref(0)
const thinking = ref(false)
const logEl = ref(null)
let botTimer = null

function newGame() {
  return createGame({ players: PLAYER_SETUP, startingChips: STARTING_CHIPS, smallBlind: 10, bigBlind: 20 })
}

const refresh = () => triggerRef(game)

// ---------- derived state ----------
// NOTE: read `game` directly (not via a computed wrapper). The engine mutates the same
// object in place and we call triggerRef(); a computed returning the same object reference
// would swallow that trigger (Vue 3.4+ only propagates computeds whose value changed).
const g = game
// Shallow copy so dependents see a new value on every refresh.
const human = computed(() => ({ ...g.value.players[0] }))
const bots = computed(() => g.value.players.slice(1))
const pot = computed(() => potTotal(g.value))
const isIdle = computed(() => g.value.street === 'idle')
const handOver = computed(() => g.value.street === 'showdown')
const humanBusted = computed(() => human.value.chips <= 0 && (handOver.value || isIdle.value))
const humanWonGame = computed(() =>
  (handOver.value || isIdle.value) && g.value.players.slice(1).every(p => p.chips <= 0))
const gameOver = computed(() => humanBusted.value || humanWonGame.value)

const legal = computed(() => {
  const s = g.value
  if (s.toAct !== 0 || handOver.value || isIdle.value) return null
  return legalActions(s)
})
const isHumanTurn = computed(() => !!legal.value)

const humanHandName = computed(() => {
  const h = human.value
  if (!h.hand.length || h.out) return ''
  if (g.value.board.length < 3) {
    const [a, b] = h.hand
    if (a.rank === b.rank) return `Pocket ${rankLabel(a.rank)}s`
    const suited = a.suit === b.suit ? ' suited' : ''
    const hi = Math.max(a.rank, b.rank), lo = Math.min(a.rank, b.rank)
    return `${rankLabel(hi)}-${rankLabel(lo)}${suited}`
  }
  return evaluateHand([...h.hand, ...g.value.board]).name
})

const winnerIds = computed(() => {
  const r = g.value.results
  if (!r) return new Set()
  return new Set(r.pots.filter(p => !p.refund).flatMap(p => p.winners))
})

const resultBanner = computed(() => {
  const r = g.value.results
  if (!r) return ''
  return r.pots
    .filter(p => !p.refund)
    .map((p, i, arr) => {
      const names = p.winners.map(id => g.value.players[id].name).join(' & ')
      const label = arr.length > 1 ? (i === 0 ? 'Main pot' : `Side pot ${i}`) : 'Pot'
      const verb = p.winners.length > 1 ? 'split' : (p.winners[0] === 0 ? 'win' : 'wins')
      const how = p.handName ? ` with ${p.handName}` : ''
      return `${label}: ${names} ${verb} ${p.amount}${how}`
    })
    .join(' · ')
})

const showCards = (p) => {
  if (p.isHuman) return true
  const r = g.value.results
  return handOver.value && r && !r.uncontested && !p.folded && !p.out
}

const seatStatus = (p) => {
  if (p.out) return 'Busted'
  if (p.folded) return 'Folded'
  if (p.allIn && !handOver.value) return 'All-in'
  return p.lastAction
}

const isDealer = (p) => !isIdle.value && g.value.dealer === p.id
const isBlind = (p) => {
  if (isIdle.value) return ''
  if (g.value.sbIdx === p.id) return 'SB'
  if (g.value.bbIdx === p.id) return 'BB'
  return ''
}

const seatProps = (p) => {
  const s = g.value
  return {
    // Copy so the child sees a changed prop (players are mutated in place by the engine)
    p: { ...p, hand: [...p.hand] },
    handNumber: s.handNumber,
    isTurn: s.toAct === p.id && !handOver.value && !isIdle.value,
    isWinner: winnerIds.value.has(p.id),
    isDealer: isDealer(p),
    blind: isBlind(p),
    status: seatStatus(p) || '',
    showBet: p.bet > 0 && !handOver.value,
    faceUp: !!showCards(p),
    cardSrc,
    cardAlt,
  }
}

// ---------- flow ----------
function scheduleBots() {
  clearTimeout(botTimer)
  const s = game.value
  if (s.street === 'showdown' || s.street === 'idle' || s.toAct < 0) {
    thinking.value = false
    return
  }
  if (s.players[s.toAct].isHuman) {
    thinking.value = false
    return
  }
  thinking.value = true
  botTimer = setTimeout(() => {
    const st = game.value
    if (st.toAct < 0 || st.players[st.toAct].isHuman || st.street === 'showdown') {
      thinking.value = false
      return
    }
    applyAction(st, decideBotAction(st))
    refresh()
    scheduleBots()
  }, BOT_DELAY)
}

function dealHand() {
  if (gameOver.value) return
  startHand(game.value)
  refresh()
  scheduleBots()
}

function restart() {
  clearTimeout(botTimer)
  game.value = newGame()
  thinking.value = false
}

function act(type, amount) {
  if (!isHumanTurn.value) return
  applyAction(game.value, { type, amount })
  refresh()
  scheduleBots()
}

// ---------- raise controls ----------
watch(legal, (l) => {
  if (l?.canRaise) raiseTo.value = l.minRaiseTo
})

function setRaiseFraction(fraction) {
  const l = legal.value
  if (!l) return
  const target = g.value.currentBet + Math.round((pot.value + l.toCall) * fraction)
  raiseTo.value = Math.min(l.maxRaiseTo, Math.max(l.minRaiseTo, target))
}

const raiseLabel = computed(() => {
  const l = legal.value
  if (!l) return 'Raise'
  if (raiseTo.value >= l.maxRaiseTo) return `All-in ${l.maxRaiseTo}`
  return g.value.currentBet === 0 ? `Bet ${raiseTo.value}` : `Raise to ${raiseTo.value}`
})

// Auto-scroll log
watch(() => g.value.log.length, async () => {
  await nextTick()
  if (logEl.value) logEl.value.scrollTop = logEl.value.scrollHeight
})

onBeforeUnmount(() => clearTimeout(botTimer))
</script>

<template>
  <section class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
    <!-- Header -->
    <div class="text-center space-y-3 mb-8">
      <h1 class="text-4xl sm:text-5xl font-bold text-stone-950 tracking-tight">
        Texas <span class="text-gradient-warm">Hold'em</span>
      </h1>
      <p class="text-stone-600">
        No-limit, blinds 10/20. You vs three bots, each starting with {{ STARTING_CHIPS }} chips.
      </p>
    </div>

    <div class="grid lg:grid-cols-[1fr_280px] gap-6">
      <!-- Table -->
      <div class="poker-felt rounded-3xl p-4 sm:p-6 shadow-xl border-8 border-amber-900/80">
        <!-- Top bot -->
        <div class="flex justify-center mb-4">
          <PlayerSeat v-bind="seatProps(bots[1])" />
        </div>

        <div class="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-6">
          <PlayerSeat v-bind="seatProps(bots[0])" />

          <!-- Board -->
          <div class="flex flex-col items-center gap-3 min-w-0">
            <div class="text-amber-100 font-semibold tracking-wide text-sm sm:text-base">
              Pot: <span class="text-white">{{ pot }}</span>
            </div>
            <div class="flex gap-1 sm:gap-2 justify-center">
              <div v-for="i in 5" :key="i" class="card-slot">
                <img
                  v-if="g.board[i - 1]"
                  :key="`${g.handNumber}-${i}`"
                  :src="cardSrc(g.board[i - 1])"
                  :alt="cardAlt(g.board[i - 1])"
                  class="card-img deal-in"
                />
              </div>
            </div>
            <div class="h-6 text-xs sm:text-sm text-amber-100/90 text-center">
              <span v-if="isIdle">Press “Deal” to start</span>
              <span v-else-if="!handOver" class="capitalize">{{ g.street }}</span>
            </div>
          </div>

          <PlayerSeat v-bind="seatProps(bots[2])" />
        </div>

        <!-- Human -->
        <div class="flex justify-center mt-4">
          <PlayerSeat v-bind="seatProps(human)" large />
        </div>

        <!-- Result banner -->
        <div
          v-if="handOver && resultBanner"
          class="mt-4 mx-auto max-w-xl text-center rounded-lg bg-stone-950/60 text-amber-100 px-4 py-2 text-sm animate-fade-in"
        >
          {{ resultBanner }}
        </div>
      </div>

      <!-- Side panel: controls + log -->
      <div class="flex flex-col gap-4">
        <div class="glass rounded-xl p-4 space-y-3">
          <div class="flex items-baseline justify-between">
            <span class="text-sm text-stone-500">Your stack</span>
            <span class="text-2xl font-bold text-stone-950">{{ human.chips }}</span>
          </div>
          <div v-if="humanHandName" class="text-sm text-stone-700">
            Hand: <span class="font-semibold text-amber-700">{{ humanHandName }}</span>
          </div>

          <!-- Game over -->
          <template v-if="gameOver">
            <p class="text-center font-semibold" :class="humanWonGame ? 'text-amber-700' : 'text-stone-700'">
              {{ humanWonGame ? 'You won all the chips! 🏆' : 'You are out of chips.' }}
            </p>
            <button class="btn-primary w-full" @click="restart">New Game</button>
          </template>

          <!-- Between hands -->
          <button
            v-else-if="isIdle || handOver"
            class="btn-primary w-full"
            @click="dealHand"
          >
            {{ isIdle ? 'Deal' : 'Next Hand' }}
          </button>

          <!-- Your turn -->
          <template v-else-if="isHumanTurn">
            <div class="grid grid-cols-2 gap-2">
              <button class="btn-secondary" @click="act('fold')">Fold</button>
              <button v-if="legal.canCheck" class="btn-secondary" @click="act('check')">Check</button>
              <button v-else class="btn-secondary" @click="act('call')">
                Call {{ legal.toCall }}
              </button>
            </div>

            <div v-if="legal.canRaise" class="space-y-2 pt-1">
              <input
                v-model.number="raiseTo"
                type="range"
                :min="legal.minRaiseTo"
                :max="legal.maxRaiseTo"
                :step="10"
                class="w-full accent-amber-600"
                aria-label="Raise amount"
              />
              <div class="grid grid-cols-4 gap-1 text-xs">
                <button class="chip-btn" @click="raiseTo = legal.minRaiseTo">Min</button>
                <button class="chip-btn" @click="setRaiseFraction(0.5)">½ Pot</button>
                <button class="chip-btn" @click="setRaiseFraction(1)">Pot</button>
                <button class="chip-btn" @click="raiseTo = legal.maxRaiseTo">All-in</button>
              </div>
              <button class="btn-primary w-full" @click="act('raise', raiseTo)">{{ raiseLabel }}</button>
            </div>
          </template>

          <!-- Waiting on bots -->
          <p v-else class="text-center text-sm text-stone-500 py-2">
            <span v-if="thinking">{{ g.players[g.toAct]?.name }} is thinking…</span>
            <span v-else-if="human.folded">You folded — watching the hand…</span>
            <span v-else>Waiting…</span>
          </p>
        </div>

        <div class="glass rounded-xl p-4 flex-1 min-h-[180px] flex flex-col">
          <h2 class="text-sm font-semibold text-stone-700 mb-2">Hand log</h2>
          <div ref="logEl" class="text-xs text-stone-600 space-y-1 overflow-y-auto max-h-72 lg:max-h-[420px] pr-1">
            <p v-if="!g.log.length" class="text-stone-400">No hands played yet.</p>
            <p
              v-for="(line, i) in g.log"
              :key="i"
              :class="line.startsWith('—') ? 'font-semibold text-stone-800 pt-2' : ''"
            >{{ line }}</p>
          </div>
        </div>

        <p class="text-[11px] text-stone-400 text-center">
          Card art: <a href="https://kenney.nl/assets/playing-cards-pack" target="_blank" rel="noopener" class="underline hover:text-amber-600">Kenney Playing Cards Pack</a> (CC0)
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.poker-felt {
  background:
    radial-gradient(ellipse at center, rgba(255, 255, 255, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse at center, #1f7a4a 0%, #135c36 60%, #0d4127 100%);
}

/* Kenney sprites are 64x64 pixel art; scale crisply */
:deep(.card-img),
:deep(.card-slot) {
  width: 56px;
  height: 56px;
  image-rendering: pixelated;
}
:deep(.card-lg) {
  width: 80px;
  height: 80px;
}
@media (min-width: 640px) {
  :deep(.card-img),
  :deep(.card-slot) {
    width: 72px;
    height: 72px;
  }
  :deep(.card-lg) {
    width: 96px;
    height: 96px;
  }
}
:deep(.card-slot) {
  border-radius: 6px;
  outline: 2px dashed rgba(255, 255, 255, 0.15);
  outline-offset: -10px;
}
.card-slot .card-img {
  outline: none;
}

:deep(.deal-in) {
  animation: deal-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@keyframes deal-in {
  from { opacity: 0; transform: translateY(-16px) rotate(-6deg) scale(0.9); }
  to   { opacity: 1; transform: none; }
}

:deep(.seat) {
  min-width: 96px;
  border: 2px solid transparent;
}
:deep(.seat-active) {
  border-color: rgba(251, 191, 36, 0.9);
  background: rgba(0, 0, 0, 0.18);
  box-shadow: 0 0 18px rgba(251, 191, 36, 0.35);
}
:deep(.seat-winner) {
  border-color: rgba(253, 230, 138, 1);
  background: rgba(217, 119, 6, 0.25);
}
:deep(.dealer-btn) {
  display: inline-grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  background: #fff;
  color: #1c1917;
  font-size: 10px;
  font-weight: 800;
}
:deep(.bet-chip) {
  font-size: 11px;
  font-weight: 700;
  color: #1c1917;
  background: #fbbf24;
  border: 2px dashed #fff;
  border-radius: 9999px;
  padding: 0 8px;
  line-height: 18px;
}

.btn-primary {
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  background: #d97706;
  color: #fff;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-primary:hover { background: #f59e0b; transform: translateY(-1px); }
.btn-secondary {
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  background: #fff;
  color: #1c1917;
  font-weight: 600;
  border: 2px solid #d6d3d1;
  transition: all 0.2s;
}
.btn-secondary:hover { border-color: #d97706; color: #b45309; }
.chip-btn {
  padding: 0.25rem 0;
  border-radius: 0.375rem;
  background: #f5f5f4;
  color: #44403c;
  border: 1px solid #e7e5e4;
}
.chip-btn:hover { background: #fef3c7; border-color: #f59e0b; }
</style>
