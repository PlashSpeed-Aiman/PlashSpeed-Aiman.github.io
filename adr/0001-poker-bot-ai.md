# 1. Poker bot AI approach

- **Status:** Proposed
- **Date:** 2026-11-19
- **Scope:** Texas Hold'em mini game (`/#/poker`)

## Context

The site has a no-limit Texas Hold'em mini game: the player against 3 bots, blinds 10/20, 1000 starting chips. It is a static Vue 3 + Vite site hosted on GitHub Pages, so the bots must run entirely in the browser with no backend.

The current bots live in `src/poker/engine.js` (`decideBotAction`). On each decision a bot:

1. Estimates its win chance by playing out about 250 random deals of the remaining cards (Monte Carlo) against the number of opponents still in the hand.
2. Compares that win chance with the pot odds (cost to call ÷ pot after calling).
3. Applies a play style (`tight`, `balanced`, `loose`) that changes how loose, aggressive and bluff-prone it is, plus a little randomness.

The bots are reasonable but play too many weak starting hands and don't adapt to the player.

We looked at whether an open-source trained poker AI could replace or add to them.

## Options considered

### A. Keep and improve the current heuristic bots

- Add starting-hand charts by seat position, so bots fold weak hands before the flop.
- Add opponent modeling: track how often the player raises or folds and adjust bluffing and calling.
- **Pros:** no new dependencies, no model download, keeps the poker page small, works with any number of players.
- **Cons:** still hand-tuned rules, not "real" AI.

### B. Train a model with RLCard, export it to ONNX and run it with `onnxruntime-web`

- [RLCard](https://github.com/datamllab/rlcard) is MIT licensed and has a no-limit Hold'em environment with trainable agents (DQN, NFSP and others).
- Train offline in Python, export to ONNX, then load it in the browser with `onnxruntime-web` (MIT) as a "Hard" difficulty level.
- **Pros:** free, the model is a static file that works on GitHub Pages, and it could beat the current bots.
- **Cons:**
  - RLCard's no-limit actions are fixed: fold, check/call, raise ½ pot, raise pot, all-in. No custom bet sizes.
  - Our game state must be converted into RLCard's input format, and bet sizes mapped back.
  - Adds a few MB plus the ONNX runtime to the poker page.
  - Estimated at about a day of work. A model trained on a home PC won't be pro-level.

### C. Use a pre-trained model

- RLCard's only shipped trained model is `leduc_holdem_cfr`, for Leduc Hold'em (a 6-card toy game). It is a strategy table, not a neural network, so it can't be converted to ONNX.
- RLCard's Limit Hold'em models are hand-written rules, not trained, and simpler than our current bots.
- RLCard has no trained no-limit Hold'em model.
- Hugging Face, Kaggle and other GitHub projects were **not** checked. Anything found there is likely heads-up only, with unclear format, license and quality.
- **Rejected for now:** nothing usable for a 4-player no-limit table was found.

### D. Other options looked at and rejected

- **wasm-postflop / postflop-solver** (Rust → WASM, AGPL as far as we know): a real game-theory solver that runs in the browser, but it only solves one heads-up spot after the flop and can take seconds to minutes. Too slow for live bots, and AGPL affects the site's license. It could still work for a separate "analyze this hand" feature.
- **OpenSpiel** (Apache-2.0): has the same offline-training path as option B, but is more research-oriented and harder to set up.
- **DeepStack, TexasSolver:** need native code or heavy compute. Not browser-friendly.
- **Libratus, Pluribus:** never released.
- **Running an LLM in the browser (WebLLM):** gigabytes to download, and it plays poker poorly.

## Decision

Proposed: do **option A** first, and keep **option B** as a possible later "Hard" level.

Option A gives the biggest improvement for the least work and adds no dependencies. Option B is worth doing only if a trained AI becomes a goal in itself.

## Consequences

- The bot code stays in `src/poker/engine.js`, and engine tests can run under Node without Vue.
- If option B goes ahead, it needs:
  - a Python training script kept outside the site build,
  - an ONNX model under `public/poker/`,
  - a mapping between our game state and RLCard's input and actions,
  - a difficulty setting in `Poker.vue`.
- Revisit this ADR if a trained no-limit Hold'em model for multiple players becomes available.

## Related

- Card art: Kenney Playing Cards Pack (CC0), `public/poker/cards/`
- Engine: `src/poker/engine.js`, `src/poker/evaluator.js`
- UI: `src/components/Poker.vue`, `src/components/poker/PlayerSeat.vue`
