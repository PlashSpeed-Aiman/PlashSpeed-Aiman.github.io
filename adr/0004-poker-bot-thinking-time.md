# 4. Randomized bot thinking time

- **Status:** Accepted (implemented)
- **Date:** 2026-11-19
- **Scope:** Bot pacing in `src/components/Poker.vue`

## Context

Bots in the poker mini game acted after a flat 750 ms `BOT_DELAY`, the same pause for every decision. It kept the table readable but made the bots feel like a metronome: a snap check on the river and a decision for the last of someone's chips both took exactly 750 ms, so the pause carried no information and gave away nothing about the hand.

We wanted the wait to feel like a person thinking, without making the game slow or letting a stale timer fire an action into the wrong spot.

Constraints:

- Bots must stay strictly sequential. At most one bot timer may be live, and an action must never land on a state it wasn't decided for.
- Longer pauses mean more chances for a timer to outlive its turn (new hand, restart, page unmount, human acting first). That has to be airtight.
- The delay is presentation only. It must not touch `src/poker/engine.js`, which stays Vue-free and testable under Node.

## Decision

### 1. A randomized 800–2500 ms window

- `BOT_DELAY` is gone. Three constants at the top of `Poker.vue` replace it:
  - `BOT_THINK_MIN_MS = 800`
  - `BOT_THINK_MAX_MS = 2500`
  - `BOT_THINK_JITTER = 0.15` — the fraction of the window that random jitter may nudge a computed time by.
- `botThinkTime(state, action)` produces a 0..1 "difficulty" score and maps it onto that window with `clamp01`, so easy spots land near 800 ms and genuinely hard spots climb toward 2500 ms.
- **Why:** one window with a difficulty score is easy to reason about and easy to tune — two numbers change the whole feel.

### 2. Difficulty comes from the spot, not the bot

The score starts at `0.3 + random * 0.25` (lower-middle of the window) and is adjusted by what the decision actually was:

| Signal | Effect |
| --- | --- |
| Check | −0.2 — nothing to think about |
| Fold to an expensive bet (`toCall > 40 %` of chips) | **reset** to 0.1 — snappy, it's an easy throw-away |
| Any other fold | **reset** to −0.25 — a cheap/close fold still takes a beat |
| Call | +0.1 |
| Raise | +0.15 |
| Facing a bet (`toCall > 0`) | +0.15 |
| `currentBet > 3 ×` big blind | +0.1 |
| Pot ≥ 25 × big blind | +0.2 (≥ 10 × big blind: +0.1) |
| Turn or river | +0.1 |
| Raise at `maxRaiseTo` (a shove) | +0.25 |
| `toCall` ≥ the bot's whole stack | +0.15 |
| Random jitter | ±`BOT_THINK_JITTER / 2` |

The two reset lines are assignments, not additions, but the cumulative terms below them still apply on top — a cheap fold in a big pot on the river still takes longer than the same fold preflop.

- Differences in play style are not modeled; the difficulty is read off the spot, so a tight and a loose bot both take longer when the decision is genuinely hard.
- **Why:** the pause should track the hand, not the personality. It also means bigger pots and later streets naturally slow down, which is where a human would pause too.

### 3. Decide first, wait second

- `scheduleBots()` calls `decideBotAction(s)` immediately, computes the delay from the action it picked, and only then sets the timer. The decided action is applied when the timer fires.
- **Why:** the whole point is to match the pause to the decision. Deciding after the wait would make the pause meaningless, and moving `decideBotAction` inside the timeout would let the state drift during the wait.

### 4. Timer safety

Longer timers made cancellation bugs much more likely, so the flow is defensive:

- `cancelBotTimer()` is the only cancellation path. It bumps a `botTicket` counter, clears `botTimer`, and resets the `thinking` flag.
- `scheduleBots()` always cancels first, so at most one bot timer is ever live and turns stay strictly sequential.
- The callback captures a ticket, the hand number, the street and the acting player id. When it fires it drops itself as stale if the ticket changed, the hand number or street changed, the hand ended (`showdown` / `idle`), or `toAct` is no longer that player. A stale callback also clears the thinking flag if nothing else is queued, so the cue can't stick.
- `dealHand()`, `restart()` and `onBeforeUnmount()` each cancel the timer, so a new hand, a restart or leaving the page can't fire a leftover action.
- **Why:** with a 2.5 s ceiling, a human can fold, deal again or navigate away well before a queued bot acts. The guards are what make the longer pause safe.

### 5. The UI already explains the wait

- No new spinner. The acting seat's existing highlight (`isTurn`) and the `"<name> is thinking…"` line under the controls (`thinking` ref) already tell the player who the table is waiting on.
- **Why:** the pause only needs to feel intentional; extra chrome would clutter the table.

## Consequences

- **Hands take longer.** With three bots at up to 2.5 s each, a full orbit can add roughly 7.5 s of waiting per betting round, and longer on big decisions.
- **The wait is now information.** Checks and cheap folds come back fast, calls and raises and shoves take longer — the pacing reads as hesitation rather than lag.
- **`thinking` and the seat highlight are load-bearing.** Any future change to `scheduleBots()` must keep cancelling through `cancelBotTimer()` and must keep the stale-callback guards, or a bot will eventually act out of turn.
- **Tuning is two numbers.** `BOT_THINK_MIN_MS` / `BOT_THINK_MAX_MS` set the feel; `BOT_THINK_JITTER` only stops it feeling metronomic.
- **Engine untouched.** The delay lives entirely in `Poker.vue`; `src/poker/engine.js` still decides instantly and stays testable under Node.

## Related

- [ADR 0002: Texas Hold'em poker mini game](./0002-poker-mini-game.md)
- [ADR 0001: Poker bot AI approach](./0001-poker-bot-ai.md)
- Code: `src/components/Poker.vue` (`BOT_THINK_*`, `botThinkTime`, `cancelBotTimer`, `scheduleBots`)
- Bot decisions: `src/poker/engine.js` (`decideBotAction`)
