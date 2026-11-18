// Texas Hold'em No-Limit game engine (framework agnostic, mutates a plain state object).
import { createDeck, shuffle, evaluateHand, compareHands, cardLabel } from './evaluator.js'

export const STREETS = ['preflop', 'flop', 'turn', 'river']

export function createGame({ players, startingChips = 1000, smallBlind = 10, bigBlind = 20 }) {
  return {
    players: players.map((p, i) => ({
      id: i,
      name: p.name,
      isHuman: !!p.isHuman,
      style: p.style ?? 'balanced',
      chips: startingChips,
      hand: [],
      bet: 0,        // chips put in on the current street
      totalBet: 0,   // chips put in this hand
      folded: false,
      allIn: false,
      acted: false,
      out: false,    // busted (no chips at start of hand)
      lastAction: '',
    })),
    smallBlind,
    bigBlind,
    dealer: -1,
    deck: [],
    board: [],
    street: 'idle',   // idle | preflop | flop | turn | river | showdown
    currentBet: 0,
    minRaise: bigBlind,
    toAct: -1,
    handNumber: 0,
    log: [],
    results: null,    // filled at end of hand
  }
}

// ---------- helpers ----------

const inHand = p => !p.out && !p.folded
const canAct = p => inHand(p) && !p.allIn

function nextIndex(state, from, pred) {
  const n = state.players.length
  for (let k = 1; k <= n; k++) {
    const i = (from + k) % n
    if (pred(state.players[i])) return i
  }
  return -1
}

function log(state, msg) {
  state.log.push(msg)
  if (state.log.length > 80) state.log.shift()
}

function putChips(state, p, amount) {
  const amt = Math.min(amount, p.chips)
  p.chips -= amt
  p.bet += amt
  p.totalBet += amt
  if (p.chips === 0) p.allIn = true
  return amt
}

export function potTotal(state) {
  return state.players.reduce((s, p) => s + p.totalBet, 0)
}

// ---------- hand lifecycle ----------

export function activePlayerCount(state) {
  return state.players.filter(p => p.chips > 0).length
}

export function startHand(state, rng = Math.random) {
  for (const p of state.players) {
    p.out = p.chips <= 0
    p.hand = []
    p.bet = 0
    p.totalBet = 0
    p.folded = false
    p.allIn = false
    p.acted = false
    p.lastAction = ''
  }
  if (activePlayerCount(state) < 2) throw new Error('Not enough players with chips')

  state.handNumber++
  state.results = null
  state.board = []
  state.deck = shuffle(createDeck(), rng)
  state.dealer = nextIndex(state, state.dealer, p => !p.out)

  const seated = state.players.filter(p => !p.out).length
  // Heads-up: dealer posts the small blind and acts first preflop.
  const sbIdx = seated === 2 ? state.dealer : nextIndex(state, state.dealer, p => !p.out)
  const bbIdx = nextIndex(state, sbIdx, p => !p.out)

  log(state, `— Hand #${state.handNumber} — ${state.players[state.dealer].name} has the button`)

  const sb = state.players[sbIdx]
  const bb = state.players[bbIdx]
  putChips(state, sb, state.smallBlind)
  sb.lastAction = `SB ${sb.bet}`
  putChips(state, bb, state.bigBlind)
  bb.lastAction = `BB ${bb.bet}`
  log(state, `${sb.name} posts small blind ${sb.bet}, ${bb.name} posts big blind ${bb.bet}`)

  // Deal two cards each, one at a time starting left of the dealer
  for (let r = 0; r < 2; r++) {
    let i = state.dealer
    for (let k = 0; k < seated; k++) {
      i = nextIndex(state, i, p => !p.out)
      state.players[i].hand.push(state.deck.pop())
    }
  }

  state.street = 'preflop'
  state.currentBet = state.bigBlind
  state.minRaise = state.bigBlind
  state.toAct = nextIndex(state, bbIdx, canAct)
  state.sbIdx = sbIdx
  state.bbIdx = bbIdx

  // Blinds may have put everyone all-in
  advanceIfNeeded(state)
}

/** Which actions the player to act may take. */
export function legalActions(state) {
  const p = state.players[state.toAct]
  if (!p || !isBettingStreet(state)) return null
  const toCall = Math.min(state.currentBet - p.bet, p.chips)
  const maxRaiseTo = p.bet + p.chips
  const minRaiseTo = Math.min(state.currentBet + state.minRaise, maxRaiseTo)
  const othersCanAct = state.players.some(o => o !== p && canAct(o))
  return {
    player: p,
    toCall,
    canCheck: toCall === 0,
    canCall: toCall > 0,
    canRaise: p.chips > toCall && othersCanAct,
    minRaiseTo,
    maxRaiseTo,
  }
}

function isBettingStreet(state) {
  return STREETS.includes(state.street)
}

/**
 * Apply an action for the player whose turn it is.
 * action: { type: 'fold' | 'check' | 'call' | 'raise', amount?: raise-to total for this street }
 */
export function applyAction(state, action) {
  const legal = legalActions(state)
  if (!legal) throw new Error('No action expected')
  const p = legal.player

  switch (action.type) {
    case 'fold':
      p.folded = true
      p.lastAction = 'Fold'
      log(state, `${p.name} folds`)
      break
    case 'check':
      if (!legal.canCheck) throw new Error('Cannot check')
      p.lastAction = 'Check'
      log(state, `${p.name} checks`)
      break
    case 'call': {
      const amt = putChips(state, p, legal.toCall)
      p.lastAction = p.allIn ? `All-in ${p.bet}` : `Call ${amt}`
      log(state, `${p.name} ${p.allIn ? 'calls all-in' : 'calls'} ${amt}`)
      break
    }
    case 'raise': {
      if (!legal.canRaise) throw new Error('Cannot raise')
      const target = Math.max(legal.minRaiseTo, Math.min(Math.floor(action.amount), legal.maxRaiseTo))
      const raiseSize = target - state.currentBet
      putChips(state, p, target - p.bet)
      const isFullRaise = raiseSize >= state.minRaise
      if (isFullRaise) state.minRaise = raiseSize
      const wasBet = state.currentBet === 0
      state.currentBet = Math.max(state.currentBet, p.bet)
      // A raise re-opens the action for everyone else
      if (raiseSize > 0) {
        for (const o of state.players) if (o !== p && canAct(o)) o.acted = false
      }
      const verb = p.allIn ? 'goes all-in for' : wasBet ? 'bets' : 'raises to'
      p.lastAction = p.allIn ? `All-in ${p.bet}` : `${wasBet ? 'Bet' : 'Raise'} ${p.bet}`
      log(state, `${p.name} ${verb} ${p.bet}`)
      break
    }
    default:
      throw new Error(`Unknown action ${action.type}`)
  }

  p.acted = true
  advanceIfNeeded(state)
}

function bettingRoundComplete(state) {
  return state.players
    .filter(canAct)
    .every(p => p.acted && p.bet === state.currentBet)
}

function advanceIfNeeded(state) {
  // Everyone else folded → award pot immediately
  const remaining = state.players.filter(inHand)
  if (remaining.length === 1) {
    finishUncontested(state, remaining[0])
    return
  }

  if (!bettingRoundComplete(state)) {
    // Special case: only one player can still act and they've matched the bet
    const actors = state.players.filter(canAct)
    if (!(actors.length <= 1 && actors.every(p => p.bet >= state.currentBet))) {
      const cur = state.players[state.toAct]
      state.toAct = cur && canAct(cur) && !(cur.acted && cur.bet === state.currentBet)
        ? state.toAct
        : nextIndex(state, state.toAct, p => canAct(p) && !(p.acted && p.bet === state.currentBet))
      if (state.toAct !== -1) return
    }
  }

  // Betting round over: move to next street (or run it out if no more betting possible)
  while (true) {
    for (const p of state.players) {
      p.bet = 0
      p.acted = false
    }
    state.currentBet = 0
    state.minRaise = state.bigBlind

    if (state.street === 'river') {
      showdown(state)
      return
    }
    dealNextStreet(state)

    const actors = state.players.filter(canAct)
    if (actors.length >= 2) {
      state.toAct = nextIndex(state, state.dealer, canAct)
      return
    }
    // 0 or 1 players can act → no more betting; keep dealing
  }
}

function dealNextStreet(state) {
  const idx = STREETS.indexOf(state.street)
  state.street = STREETS[idx + 1]
  state.deck.pop() // burn
  const n = state.street === 'flop' ? 3 : 1
  for (let i = 0; i < n; i++) state.board.push(state.deck.pop())
  const label = state.street[0].toUpperCase() + state.street.slice(1)
  log(state, `${label}: ${state.board.map(cardLabel).join(' ')}`)
  for (const p of state.players) if (canAct(p)) p.lastAction = ''
}

function finishUncontested(state, winner) {
  const pot = potTotal(state)
  winner.chips += pot
  state.street = 'showdown'
  state.toAct = -1
  state.results = {
    uncontested: true,
    pots: [{ amount: pot, winners: [winner.id], handName: null }],
    hands: {},
  }
  winner.lastAction = `Wins ${pot}`
  log(state, `${winner.name} wins ${pot} (everyone else folded)`)
}

/** Split total contributions into main pot + side pots. */
export function computePots(players) {
  const live = players.filter(p => !p.out && !p.folded && p.totalBet > 0)
  const levels = [...new Set(live.map(p => p.totalBet))].sort((a, b) => a - b)
  const pots = []
  let prev = 0
  for (const level of levels) {
    let amount = 0
    for (const p of players) amount += Math.max(0, Math.min(p.totalBet, level) - prev)
    const eligible = live.filter(p => p.totalBet >= level).map(p => p.id)
    if (amount > 0) {
      // Merge with previous pot if same eligible set (keeps UI tidy)
      const last = pots[pots.length - 1]
      if (last && last.eligible.join() === eligible.join()) last.amount += amount
      else pots.push({ amount, eligible })
    }
    prev = level
  }
  // Any dead money above the highest live level (shouldn't normally happen) goes to the last pot
  const accounted = pots.reduce((s, p) => s + p.amount, 0)
  const total = players.reduce((s, p) => s + p.totalBet, 0)
  if (pots.length && total > accounted) pots[pots.length - 1].amount += total - accounted
  return pots
}

function showdown(state) {
  state.street = 'showdown'
  state.toAct = -1
  const hands = {}
  for (const p of state.players) {
    if (inHand(p)) hands[p.id] = evaluateHand([...p.hand, ...state.board])
  }

  const pots = computePots(state.players)
  const results = []
  // Seat order starting left of dealer (for odd chip distribution)
  const order = []
  let i = state.dealer
  for (let k = 0; k < state.players.length; k++) {
    i = (i + 1) % state.players.length
    order.push(i)
  }

  pots.forEach((pot, idx) => {
    let best = null
    let winners = []
    for (const id of pot.eligible) {
      const h = hands[id]
      const c = best ? compareHands(h, best) : 1
      if (c > 0) { best = h; winners = [id] }
      else if (c === 0) winners.push(id)
    }
    winners.sort((a, b) => order.indexOf(a) - order.indexOf(b))
    const share = Math.floor(pot.amount / winners.length)
    let remainder = pot.amount - share * winners.length
    for (const id of winners) {
      state.players[id].chips += share + (remainder > 0 ? 1 : 0)
      if (remainder > 0) remainder--
    }
    const potName = idx === 0 ? 'main pot' : `side pot ${idx}`
    const names = winners.map(id => state.players[id].name).join(' & ')
    const singleEligible = pot.eligible.length === 1
    log(state, singleEligible
      ? `${names} gets back ${pot.amount} uncalled`
      : `${names} ${winners.length > 1 ? 'split' : 'wins'} the ${potName} (${pot.amount}) with ${best.name}`)
    results.push({ amount: pot.amount, winners, handName: best.name, refund: singleEligible })
  })

  for (const p of state.players) {
    if (inHand(p)) {
      const won = results.some(r => !r.refund && r.winners.includes(p.id))
      p.lastAction = won ? 'Winner' : hands[p.id].name
    }
  }

  state.results = { uncontested: false, pots: results, hands }
}

// ---------- bot AI ----------

const STYLES = {
  tight:      { looseness: -0.06, aggression: 0.8, bluff: 0.03 },
  balanced:   { looseness: 0,     aggression: 1.0, bluff: 0.07 },
  loose:      { looseness: 0.08,  aggression: 1.3, bluff: 0.14 },
}

/** Monte Carlo equity estimate of `hand` vs `opponents` random hands. */
export function estimateEquity(hand, board, opponents, iterations = 300, rng = Math.random) {
  const used = new Set([...hand, ...board].map(c => c.rank + c.suit))
  const rest = createDeck().filter(c => !used.has(c.rank + c.suit))
  let score = 0
  for (let it = 0; it < iterations; it++) {
    // partial Fisher-Yates for just the cards we need
    const need = opponents * 2 + (5 - board.length)
    for (let k = 0; k < need; k++) {
      const j = k + Math.floor(rng() * (rest.length - k))
      ;[rest[k], rest[j]] = [rest[j], rest[k]]
    }
    const fullBoard = board.concat(rest.slice(opponents * 2, need))
    const mine = evaluateHand(hand.concat(fullBoard))
    let beaten = false
    let ties = 0
    for (let o = 0; o < opponents; o++) {
      const theirs = evaluateHand([rest[o * 2], rest[o * 2 + 1], ...fullBoard])
      const c = compareHands(mine, theirs)
      if (c < 0) { beaten = true; break }
      if (c === 0) ties++
    }
    if (!beaten) score += 1 / (ties + 1)
  }
  return score / iterations
}

function roundTo(x, unit) {
  return Math.max(unit, Math.round(x / unit) * unit)
}

export function decideBotAction(state, rng = Math.random) {
  const legal = legalActions(state)
  const p = legal.player
  const style = STYLES[p.style] ?? STYLES.balanced
  const opponents = state.players.filter(o => o !== p && inHand(o)).length
  const equity = estimateEquity(p.hand, state.board, opponents, 250, rng)
  const pot = potTotal(state)
  const potOdds = legal.toCall / (pot + legal.toCall)

  // Equity needed scales with field size: a "fair share" is 1/(opponents+1)
  const fairShare = 1 / (opponents + 1)
  const strength = equity - fairShare + style.looseness // >0 means better than average
  const noise = (rng() - 0.5) * 0.08

  const raiseAmount = (fraction) => {
    const target = state.currentBet + roundTo(Math.max(state.minRaise, pot * fraction), state.smallBlind)
    return Math.min(Math.max(target, legal.minRaiseTo), legal.maxRaiseTo)
  }

  const bluffing = rng() < style.bluff && state.street !== 'river'

  if (legal.canRaise) {
    if (strength + noise > 0.35 / style.aggression) {
      // Monster: big raise / sometimes shove
      const shove = equity > 0.8 && rng() < 0.35
      return { type: 'raise', amount: shove ? legal.maxRaiseTo : raiseAmount(0.75 + rng() * 0.5) }
    }
    if (strength + noise > 0.15 / style.aggression || (bluffing && legal.toCall <= state.bigBlind * 2)) {
      if (rng() < 0.6 * style.aggression) return { type: 'raise', amount: raiseAmount(0.5 + rng() * 0.25) }
    }
  }

  if (legal.canCheck) return { type: 'check' }

  // Facing a bet: call if equity beats pot odds (with some personality slack)
  const callThreshold = potOdds - style.looseness - 0.02
  const tooExpensive = legal.toCall > p.chips * 0.5 && equity < 0.55
  if (equity + noise >= callThreshold && !tooExpensive) return { type: 'call' }
  if (legal.toCall <= state.bigBlind && equity > fairShare * 0.6) return { type: 'call' }
  return { type: 'fold' }
}
