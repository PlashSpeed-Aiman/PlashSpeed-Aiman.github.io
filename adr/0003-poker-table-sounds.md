# 3. Poker table sounds

- **Status:** Accepted (implemented)
- **Date:** 2026-11-19
- **Scope:** Poker page audio, `src/composables/useChipSounds.js`, `public/sounds/`

## Context

[ADR 0002](./0002-poker-mini-game.md) left sound out of the poker mini game. Playing without it felt flat: chips moved, bets went in and the pot was shipped to a winner with no feedback at all, and the "check" gesture — knocking the table — had no sound.

Constraints:

- The site is still a static Vue 3 + Vite app on GitHub Pages. No backend, no audio CDN, everything served from `public/`.
- No paid assets, and nothing with a license that affects the rest of the site.
- Browsers block audio until the user interacts with the page, so playback has to survive autoplay policies.
- Audio must never break the game. A missing file, an old browser or a suspended context should end in silence, not an error.
- The poker page is a lazy-loaded route, so its audio shouldn't cost anything on other pages.

## Decisions

### 1. Real recordings instead of synthesis

- The first attempt synthesized chips in the browser with short noise bursts and filtered clicks through the Web Audio API. It worked, but no amount of tweaking made it sound like clay chips on felt.
- It was replaced with real recordings from Kenney's [Casino Audio](https://kenney.nl/assets/casino-audio) pack (CC0 1.0): 19 `.ogg` samples in `public/sounds/chips/`, grouped by what they sound like — `chip-lay` (1–3), `chips-collide` (1–4), `chips-handle` (1–6) and `chips-stack` (1–6).
- The table knocks come from Kenney's [Impact Sounds](https://kenney.nl/assets/impact-sounds) pack (CC0 1.0): 4 wood-impact samples in `public/sounds/table/`.
- Each folder keeps the pack's `License.txt`. Only the files actually used are shipped; the rest of both packs is not part of the repo.
- **Why:** free, public domain, no attribution required (the page still names Kenney), and real samples sound right with no tuning. Synthesis stays a dead end for something this tactile.

### 2. One shared `AudioContext`, created lazily

- `src/composables/useChipSounds.js` holds a single module-level `AudioContext` and a master gain (`MASTER_VOLUME = 0.45`). The context is only created on first use, so other pages never pay for it.
- The context is resumed on the first `pointerdown`, `keydown` or `touchstart` (capture phase, passive, removed after the first hit). Playback also calls `resume()` before every hit, so a context that got suspended later recovers on the next click.
- Every sample is fetched and decoded once and cached as an `AudioBuffer`. In-flight loads are tracked so two hits on the same file don't fetch it twice. `preload()` warms all 23 files on the first interaction.
- Paths are built from `import.meta.env.BASE_URL`, so the same code works at `/` in dev and under `/PlashSpeed-Aiman.github.io/` on GitHub Pages.
- Every hit is a fresh `AudioBufferSourceNode`, with random variant selection, about ±6 % pitch jitter (`PITCH_JITTER`) and a few milliseconds of start-time jitter, so a stack of chips never sounds machine-gunned.
- **Why:** one context avoids the per-context limits some browsers impose, and caching decoded buffers keeps repeated bets free of decode work.

### 3. Which action plays what

All sounds are fired from the `resolveAction()` wrapper in `Poker.vue`, next to the engine call they describe:

| Event | Sound |
| --- | --- |
| Blinds posted | `playChipBet({ count: 2, gain: 0.7 })` |
| Call / bet / raise | `playChipBet()`, one clack per ~60 chips committed, capped at 6, plus a stack sample from 4 chips up |
| All-in | `playChipAllIn()` — dense shove with a rattling cascade |
| Pot awarded | `playPotCollect()` — cascading collect, `big` at 400+ chips, delayed 450 ms if chips just moved |
| Quick-bet buttons (Min, ½ Pot, Pot, All-in) | `playChipClick()` — a single chip tap |
| Check | `playCheckKnock()` (see below) |
| Fold | silent |

- Bot actions play the same sounds a little quieter (gain 0.75–0.8 instead of 1) so the human's own chips stay up front.
- **Why:** routing everything through `resolveAction()` means the sound can't drift from the state change — there is one place where an action is applied and heard.

### 4. Check = knock on the table

- `playCheckKnock()` plays the classic double rap: one randomly picked sample, then the same sample again 110–150 ms later and slightly softer, so it reads as one gesture.
- Fold stays silent on purpose: a fold is a push-away, not a knock, and the sample would get repetitive.
- **Why:** "check" is a gesture in real poker, and the knock is the one sound players expect to hear across the table.

### 5. Mute API, no UI toggle yet

- `setChipSoundMuted(true|false)` and `isChipSoundMuted()` sit next to the play functions, and muting zeroes the master gain.
- There is no button for it in `Poker.vue` yet; nothing calls them.
- **Why:** a mute switch is the obvious next request, and the plumbing costs almost nothing now. Adding the toggle is a UI change, not an audio change.

### 6. Silent failure

- Every entry point is wrapped so a failed `fetch`, a failed decode, a missing `AudioContext` or a suspended context ends in silence.
- The first failure per folder logs one `console.warn` (`warnOnce`, `warnKnockOnce`); after that the file is simply skipped.
- **Why:** audio is decoration. It must never stop a hand, and it must not spam the console every bet.

## Consequences

- **Asset weight:** about 154 KB of `.ogg` in `public/` (roughly 129 KB of chips, 25 KB of knocks). The files are copied as-is, not bundled, so they only download when the poker page is played.
- **OGG support:** `.ogg` is unsupported in older Safari (before 17 on some platforms). Those browsers stay silent — the game itself is unaffected.
- **The context stays open for the whole session** once created. It is never closed, because the site is a single page and reopening a context per hand would be worse.
- **No mute toggle in the UI yet**, so a visitor who doesn't want sound has to mute the tab.
- **Tuning lives in one file:** volumes, `PITCH_JITTER` and sample groups are all in `useChipSounds.js`. Nothing in `Poker.vue` knows a file name.
- **Adding a sound** means dropping the `.ogg` into `public/sounds/<group>/`, adding it to the right list in `SAMPLES` (or `KNOCKS`), and wiring one call into `resolveAction()`.

## Related

- [ADR 0002: Texas Hold'em poker mini game](./0002-poker-mini-game.md)
- [ADR 0004: Randomized bot thinking time](./0004-poker-bot-thinking-time.md)
- Audio: `src/composables/useChipSounds.js`, `public/sounds/chips/`, `public/sounds/table/`
- Trigger points: `src/components/Poker.vue` (`resolveAction`, `dealHand`, `setRaiseTo`, `setRaiseFraction`)
- Packs: <https://kenney.nl/assets/casino-audio>, <https://kenney.nl/assets/impact-sounds> (both CC0)
