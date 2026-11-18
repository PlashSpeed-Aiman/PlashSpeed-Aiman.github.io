<script setup>
import { shallowRef, triggerRef, ref, computed, watch, onBeforeUnmount, nextTick } from 'vue'
import {
  createGame, startHand, applyAction, legalActions, decideBotAction,
  potTotal, STREETS,
} from '../poker/engine.js'
import { evaluateHand, rankLabel } from '../poker/evaluator.js'
import PlayerSeat from './poker/PlayerSeat.vue'
import { playChipClick, playChipBet, playChipAllIn, playPotCollect, playCheckKnock } from '../composables/useChipSounds.js'

// Card sprites: Kenney "Playing Cards Pack" (CC0) — public/poker/cards
const SPRITE_BASE = `${import.meta.env.BASE_URL}poker/cards/`
const cardSrc = (card) => {
  if (!card) return `${SPRITE_BASE}card_back.png`
  const r = card.rank <= 10 ? String(card.rank).padStart(2, '0') : rankLabel(card.rank)
  return `${SPRITE_BASE}card_${card.suit}_${r}.png`
}
const cardAlt = (card) => card ? `${rankLabel(card.rank)} of ${card.suit}` : 'Face-down card'

const STARTING_CHIPS = 1000

// ---------- bot "thinking" pacing ----------
// Every bot action is preceded by a randomized pause so the table feels human.
// BOT_THINK_MIN_MS / BOT_THINK_MAX_MS bound that pause; easy spots land near the
// min, genuinely hard spots climb to the max. Tune these two numbers to taste.
const BOT_THINK_MIN_MS = 800
const BOT_THINK_MAX_MS = 2500
// How much random jitter (fraction of the window) may nudge a computed think time.
const BOT_THINK_JITTER = 0.15

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
// Bumped whenever we cancel, so an already-queued callback can tell it's stale.
let botTicket = 0

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

// ---------- chip audio ----------
// Roughly one clack per 60 chips committed, so bigger bets sound like taller stacks.
const chipCountFor = (amount) => Math.max(1, Math.min(6, Math.round(amount / 60)))

/** Apply an action and play the chip sound it deserves. */
function resolveAction(state, action) {
  const actor = state.toAct >= 0 ? state.players[state.toAct] : null
  const prevTotal = actor ? actor.totalBet : 0
  const wasAllIn = actor ? actor.allIn : false
  const wasOver = state.street === 'showdown'

  applyAction(state, action)

  let chipsMoved = false
  if (actor) {
    const added = actor.totalBet - prevTotal
    if (added > 0) {
      chipsMoved = true
      // All-in gets its own dense shove; everything else scales with the amount.
      // Bot actions are a touch quieter so the human's own chips stay up front.
      if (actor.allIn && !wasAllIn) playChipAllIn({ gain: actor.isHuman ? 1 : 0.75 })
      else playChipBet({ count: chipCountFor(added), gain: actor.isHuman ? 1 : 0.8 })
    }
  }

  // Check — knock on the table (fold stays silent).
  if (action && action.type === 'check') {
    playCheckKnock({ gain: actor && actor.isHuman ? 1 : 0.8 })
  }

  if (!wasOver && state.street === 'showdown') {
    // Let the final bet land before the pot is raked in.
    playPotCollect({ big: potTotal(state) >= 400, delay: chipsMoved ? 0.45 : 0.02 })
  }
  refresh()
}

// ---------- bot thinking time ----------
const clamp01 = (x) => Math.min(1, Math.max(0, x))

/**
 * Pick a human-ish pause for a bot action, in ms.
 * The result is a 0..1 "difficulty" score mapped onto the MIN..MAX window:
 * snap checks and trash folds land low, calls/raises, big pots, late streets and
 * all-in decisions climb toward the top. Call after decideBotAction() so we can
 * look at the action it actually picked.
 */
function botThinkTime(state, action) {
  const legal = legalActions(state)
  const p = state.players[state.toAct]
  const bb = state.bigBlind || 20
  const pot = potTotal(state)

  // Base: somewhere in the lower-middle of the window
  let t = 0.3 + Math.random() * 0.25

  // --- easy spots ---
  if (action.type === 'check') t -= 0.2                              // nothing to think about
  // Folding to an expensive bet with trash is snappy; a close/cheap fold takes a beat.
  if (action.type === 'fold') t = legal && legal.toCall > p.chips * 0.4 ? 0.1 : -0.25

  // --- harder spots ---
  if (action.type === 'call') t += 0.1
  if (action.type === 'raise') t += 0.15
  if (legal && legal.toCall > 0) t += 0.15                           // facing a bet
  if (state.currentBet > bb * 3) t += 0.1                            // a real raise to consider
  if (pot >= bb * 25) t += 0.2                                       // big pot
  else if (pot >= bb * 10) t += 0.1
  if (STREETS.indexOf(state.street) >= 2) t += 0.1                   // turn/river decisions
  if (legal && action.type === 'raise' && action.amount >= legal.maxRaiseTo) t += 0.25 // shoving
  if (legal && legal.toCall >= p.chips) t += 0.15                    // calling off the stack

  // A little randomness so it never feels metronomic
  t += (Math.random() - 0.5) * BOT_THINK_JITTER

  const span = BOT_THINK_MAX_MS - BOT_THINK_MIN_MS
  return Math.round(BOT_THINK_MIN_MS + clamp01(t) * span)
}

// ---------- flow ----------
/**
 * The only way a bot action gets scheduled. Cancels any pending timer first, so
 * at most one bot timer is ever live and turns stay strictly sequential.
 * `botTicket` invalidates callbacks that were already queued when we cancelled.
 */
function cancelBotTimer() {
  botTicket++
  if (botTimer !== null) clearTimeout(botTimer)
  botTimer = null
  thinking.value = false
}

function scheduleBots() {
  cancelBotTimer()

  const s = game.value
  if (s.street === 'showdown' || s.street === 'idle' || s.toAct < 0) return
  const actor = s.players[s.toAct]
  if (!actor || actor.isHuman) return
  const legalNow = legalActions(s)
  if (!legalNow) return

  // Decide now so the pause can match how hard the spot is, then wait it out.
  const action = decideBotAction(s)
  const delay = botThinkTime(s, action)

  thinking.value = true
  const ticket = botTicket
  const { handNumber, street } = s
  const actorId = actor.id

  botTimer = setTimeout(() => {
    botTimer = null
    const st = game.value
    // Stale? Cancelled, new hand, hand ended, or someone else to act → drop it.
    // (If nothing else is queued, make sure the "thinking" cue doesn't stick.)
    const stale = ticket !== botTicket
      || st.handNumber !== handNumber
      || st.street !== street
      || st.street === 'showdown' || st.street === 'idle'
      || st.toAct !== actorId
      || !st.players[actorId] || st.players[actorId].isHuman
    if (stale) {
      if (botTimer === null) thinking.value = false
      return
    }

    resolveAction(st, action)   // sounds fire here, after the pause
    scheduleBots()
  }, delay)
}

function dealHand() {
  if (gameOver.value) return
  cancelBotTimer()
  startHand(game.value)
  playChipBet({ count: 2, gain: 0.7 }) // blinds going in
  refresh()
  scheduleBots()
}

function restart() {
  cancelBotTimer()
  game.value = newGame()
}

function act(type, amount) {
  if (!isHumanTurn.value) return
  resolveAction(game.value, { type, amount })
  scheduleBots()
}

// ---------- raise controls ----------
watch(legal, (l) => {
  if (l?.canRaise) raiseTo.value = l.minRaiseTo
})

function setRaiseFraction(fraction) {
  const l = legal.value
  if (!l) return
  playChipClick()
  const target = g.value.currentBet + Math.round((pot.value + l.toCall) * fraction)
  raiseTo.value = Math.min(l.maxRaiseTo, Math.max(l.minRaiseTo, target))
}

/** Quick-bet chips (Min / ½ Pot / Pot / All-in) each give a small chip tap. */
function setRaiseTo(value) {
  playChipClick()
  raiseTo.value = value
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

onBeforeUnmount(() => cancelBotTimer())
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
                <button class="chip-btn" @click="setRaiseTo(legal.minRaiseTo)">Min</button>
                <button class="chip-btn" @click="setRaiseFraction(0.5)">½ Pot</button>
                <button class="chip-btn" @click="setRaiseFraction(1)">Pot</button>
                <button class="chip-btn" @click="setRaiseTo(legal.maxRaiseTo)">All-in</button>
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
