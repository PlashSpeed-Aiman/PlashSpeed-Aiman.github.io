# 2. Texas Hold'em poker mini game

- **Status:** Accepted (implemented)
- **Date:** 2026-11-19
- **Scope:** `/#/poker` page, `src/poker/`, `public/poker/`

## Context

We wanted a playable Texas Hold'em mini game on the personal site, using card sprites, on its own tab.

Constraints:

- The site is a static Vue 3 + Vite app on GitHub Pages with hash routing. There is no backend, so everything runs in the browser.
- No paid assets, and nothing with a license that affects the rest of the site.
- Keep the main bundle small. The game should only load when someone opens the page.

## Decisions

### 1. Card art: Kenney "Playing Cards Pack" (CC0)

- Downloaded from the OpenGameArt mirror, because Kenney's own download needs JavaScript in a browser.
- Only the large cards are used: 52 cards, the card back and the empty card, each 64×64 pixel art.
- Stored as separate PNG files in `public/poker/cards/`, with `LICENSE-Kenney.txt`. The pack's tilesheet was not used.
- Shown with `image-rendering: pixelated` so the pixel art scales up sharply. Paths are built from `import.meta.env.BASE_URL`.
- CC0 needs no credit, but the page still credits Kenney with a link.
- **Why:** free, public domain, consistent style, and individual files are simpler than working out sprite-sheet positions.

### 2. Own engine in plain JavaScript, no poker library

- `src/poker/evaluator.js` has the deck, shuffle and hand ranking. It finds the best 5-card hand out of 7, including ace-to-five straights, tiebreaks on side cards, and two sets of trips counting as a full house.
- `src/poker/engine.js` has the game rules, written for no-limit Hold'em:
  - blinds, with the heads-up rule (the dealer posts the small blind and acts first before the flop)
  - betting rounds, minimum raises, and raises reopening the action
  - all-ins, and dealing the remaining cards automatically when no one can bet any more
  - side pots, split pots and odd chips
  - the bots
- The engine imports nothing from Vue and changes one plain state object in place.
- **Why:**
  - No dependency to add.
  - The bots run a few hundred simulations per decision, which is fast on plain objects but would be slow on Vue's reactive ones.
  - It can be tested with Node alone.

### 3. Bots: win-chance estimate, pot odds and play styles

- Three bots with different play styles: Ali (tight), Mei (balanced), Raju (loose).
- Before each decision, a bot estimates its win chance by playing out about 250 random deals of the remaining cards.
- It compares that win chance with the pot odds and adjusts for its play style, occasional bluffs and a little randomness.
- Each bot move waits 750 ms so the player can follow the action. (Since replaced by a randomized 800–2500 ms pause — see [ADR 0004](./0004-poker-bot-thinking-time.md).)
- See [ADR 0001](./0001-poker-bot-ai.md) for trained-AI options and planned improvements.

### 4. UI: one page with a separate seat component

- `src/components/Poker.vue` contains the table, board, pot, controls (fold, check/call, raise slider with Min, ½ Pot, Pot and All-in), hand log and end-of-game state.
- `src/components/poker/PlayerSeat.vue` shows one player: cards, name, dealer and blind markers, chips, last action and current bet.
- Styling uses the site's existing amber and stone colors. The green felt and card animations are scoped CSS in `Poker.vue`.

### 5. Connecting the engine to Vue: `shallowRef` and `triggerRef`

- The game state is held in a `shallowRef`. After each engine change, the page calls `triggerRef(game)` to redraw.
- The page reads `game` directly. It must **not** read it through a `computed(() => game.value)` wrapper.
  - Since Vue 3.4, a computed only tells the page it changed when it returns a different object.
  - The engine keeps changing the same object, so the wrapper hid every update. This caused the bug where clicking "Deal" did nothing.
- For the same reason, each seat gets a fresh copy of its player data, and `human` is a fresh copy too.

### 6. Its own route and navbar tab

- Route `/poker` in `src/routes.js`, loaded only when visited. It builds to a separate chunk of about 20 kB (about 8 kB gzipped).
- A top-level **Poker** tab in `Navbar.vue`, next to Lib Dir, styled like the other tabs.

## Consequences

- **Small dependency footprint:** no new packages. About 57 small PNG files are added to `public/`.
- **Mobile navigation:** the navbar links are hidden below the `md` breakpoint, like the existing tabs, so phone users can't reach the poker tab from the menu. The page itself works on small screens.
- **Engine changes must follow the in-place + `triggerRef` pattern.** Any new derived state in `Poker.vue` must read `game` directly or return new objects (see decision 5).
- **No tests in the repo yet.** The engine was checked with throwaway Node scripts that were deleted afterward:
  - 24 hand-ranking and side-pot tests passed.
  - About 1,400 bots-only hands ran with total chips unchanged and no hand getting stuck.
  - Adding a test runner and keeping these tests is recommended.
- **Not included:** sound (added later — see [ADR 0003](./0003-poker-table-sounds.md)), saving chips between visits, difficulty settings, and choosing the number of players.
- The UI has only been checked with production builds, not played through in a browser.

## Related

- [ADR 0001: Poker bot AI approach](./0001-poker-bot-ai.md)
- [ADR 0003: Poker table sounds](./0003-poker-table-sounds.md)
- [ADR 0004: Randomized bot thinking time](./0004-poker-bot-thinking-time.md)
- Card art: <https://kenney.nl/assets/playing-cards-pack> (CC0)
