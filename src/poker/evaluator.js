// Deck + 7-card Texas Hold'em hand evaluator.
// Card shape: { rank: 2..14 (14 = Ace), suit: 'clubs' | 'diamonds' | 'hearts' | 'spades' }

export const SUITS = ['clubs', 'diamonds', 'hearts', 'spades']
export const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

export const HAND_NAMES = [
  'High Card',
  'One Pair',
  'Two Pair',
  'Three of a Kind',
  'Straight',
  'Flush',
  'Full House',
  'Four of a Kind',
  'Straight Flush',
]

const RANK_LABEL = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' }
const RANK_WORD = {
  2: 'Twos', 3: 'Threes', 4: 'Fours', 5: 'Fives', 6: 'Sixes', 7: 'Sevens', 8: 'Eights',
  9: 'Nines', 10: 'Tens', 11: 'Jacks', 12: 'Queens', 13: 'Kings', 14: 'Aces',
}

export function rankLabel(rank) {
  return RANK_LABEL[rank] ?? String(rank)
}

export function cardLabel(card) {
  const sym = { clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' }[card.suit]
  return `${rankLabel(card.rank)}${sym}`
}

export function createDeck() {
  const deck = []
  for (const suit of SUITS) for (const rank of RANKS) deck.push({ rank, suit })
  return deck
}

export function shuffle(deck, rng = Math.random) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

// Returns highest straight top-card from a set of ranks, or 0. Handles A-2-3-4-5 wheel.
function highestStraight(rankSet) {
  for (let top = 14; top >= 5; top--) {
    let ok = true
    for (let r = top; r > top - 5; r--) {
      const rr = r === 1 ? 14 : r
      if (!rankSet.has(rr)) { ok = false; break }
    }
    if (ok) return top
  }
  // wheel: 5-4-3-2-A
  if ([14, 2, 3, 4, 5].every(r => rankSet.has(r))) return 5
  return 0
}

/**
 * Evaluate the best 5-card hand out of 5..7 cards.
 * Returns { category, values, name } where score comparison is lexicographic
 * over [category, ...values].
 */
export function evaluateHand(cards) {
  const byRank = new Map()
  const bySuit = new Map()
  for (const c of cards) {
    byRank.set(c.rank, (byRank.get(c.rank) ?? 0) + 1)
    if (!bySuit.has(c.suit)) bySuit.set(c.suit, [])
    bySuit.get(c.suit).push(c.rank)
  }

  // Flush / straight flush
  let flushRanks = null
  for (const ranks of bySuit.values()) {
    if (ranks.length >= 5) flushRanks = ranks.slice().sort((a, b) => b - a)
  }
  if (flushRanks) {
    const sf = highestStraight(new Set(flushRanks))
    if (sf) return make(8, [sf], sf === 14 ? 'Royal Flush' : null)
  }

  // Group ranks by count, ordered by (count desc, rank desc)
  const groups = [...byRank.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])
  const sortedRanks = [...byRank.keys()].sort((a, b) => b - a)
  const kickers = (exclude, n) => sortedRanks.filter(r => !exclude.includes(r)).slice(0, n)

  if (groups[0][1] === 4) {
    const q = groups[0][0]
    return make(7, [q, ...kickers([q], 1)])
  }

  const trips = groups.filter(g => g[1] === 3).map(g => g[0])
  const pairs = groups.filter(g => g[1] === 2).map(g => g[0])

  if (trips.length >= 1 && (trips.length >= 2 || pairs.length >= 1)) {
    const t = trips[0]
    const p = Math.max(trips[1] ?? 0, pairs[0] ?? 0)
    return make(6, [t, p])
  }

  if (flushRanks) return make(5, flushRanks.slice(0, 5))

  const straight = highestStraight(new Set(sortedRanks))
  if (straight) return make(4, [straight])

  if (trips.length) return make(3, [trips[0], ...kickers([trips[0]], 2)])

  if (pairs.length >= 2) {
    const [p1, p2] = pairs
    return make(2, [p1, p2, ...kickers([p1, p2], 1)])
  }

  if (pairs.length === 1) return make(1, [pairs[0], ...kickers([pairs[0]], 3)])

  return make(0, sortedRanks.slice(0, 5))
}

function make(category, values, override = null) {
  return { category, values, name: override ?? describe(category, values) }
}

function describe(category, v) {
  switch (category) {
    case 8: return `Straight Flush, ${rankLabel(v[0])} high`
    case 7: return `Four ${RANK_WORD[v[0]]}`
    case 6: return `Full House, ${RANK_WORD[v[0]]} full of ${RANK_WORD[v[1]]}`
    case 5: return `Flush, ${rankLabel(v[0])} high`
    case 4: return `Straight, ${rankLabel(v[0])} high`
    case 3: return `Three ${RANK_WORD[v[0]]}`
    case 2: return `Two Pair, ${RANK_WORD[v[0]]} and ${RANK_WORD[v[1]]}`
    case 1: return `Pair of ${RANK_WORD[v[0]]}`
    default: return `${rankLabel(v[0])} High`
  }
}

/** Positive if a beats b, negative if b beats a, 0 for a tie. */
export function compareHands(a, b) {
  if (a.category !== b.category) return a.category - b.category
  for (let i = 0; i < Math.max(a.values.length, b.values.length); i++) {
    const d = (a.values[i] ?? 0) - (b.values[i] ?? 0)
    if (d) return d
  }
  return 0
}
