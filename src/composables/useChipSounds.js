/**
 * Poker-chip sounds for the Texas Hold'em table.
 *
 * Real recorded samples from Kenney's "Casino Audio" pack (CC0 1.0) —
 * see public/sounds/chips/License.txt for attribution. Only the chip files are
 * shipped; the rest of the pack is not part of this repo.
 *
 * Table knocks (the classic double tap on the felt to check) come from
 * Kenney's "Impact Sounds" pack (CC0 1.0) — see public/sounds/table/License.txt.
 *
 * A single AudioContext is created lazily and shared by the whole app. It is
 * resumed on the first user interaction so autoplay policies are satisfied.
 * Every sample is fetched + decoded once (lazily, or eagerly on the first
 * interaction) and cached as an AudioBuffer; each hit then plays a fresh
 * AudioBufferSourceNode with a little random pitch and timing jitter so a
 * stack of chips never sounds machine-gunned.
 *
 * If Web Audio is unavailable or a sample fails to load we stay silent — the
 * game is never blocked by audio.
 */

const BASE = (import.meta.env && import.meta.env.BASE_URL) || '/'
const ROOT = `${BASE.endsWith('/') ? BASE : `${BASE}/`}sounds/`
const DIR = `${ROOT}chips/`
const TABLE_DIR = `${ROOT}table/`

/** Sample variants, grouped by what they sound like. */
const SAMPLES = {
  // single chip set down on felt
  lay: ['chip-lay-1.ogg', 'chip-lay-2.ogg', 'chip-lay-3.ogg'],
  // two chips knocking together
  collide: [
    'chips-collide-1.ogg',
    'chips-collide-2.ogg',
    'chips-collide-3.ogg',
    'chips-collide-4.ogg',
  ],
  // fingers pushing / releasing a stack
  handle: [
    'chips-handle-1.ogg',
    'chips-handle-2.ogg',
    'chips-handle-3.ogg',
    'chips-handle-4.ogg',
    'chips-handle-5.ogg',
    'chips-handle-6.ogg',
  ],
  // a whole stack landing
  stack: [
    'chips-stack-1.ogg',
    'chips-stack-2.ogg',
    'chips-stack-3.ogg',
    'chips-stack-4.ogg',
    'chips-stack-5.ogg',
    'chips-stack-6.ogg',
  ],
}

const ALL_SAMPLES = Object.values(SAMPLES).reduce((all, list) => all.concat(list), [])

/** Soft wood knocks — knuckles on the table, the "check" gesture. */
const KNOCKS = ['knock-1.ogg', 'knock-2.ogg', 'knock-3.ogg', 'knock-4.ogg']

const MASTER_VOLUME = 0.45
const PITCH_JITTER = 0.06 // ±6 %

let ctx = null
let master = null
let muted = false
let warned = false
let preloaded = false

const buffers = new Map()
const pending = new Map()

const rnd = (min, max) => min + Math.random() * (max - min)
const pick = (list) => list[(Math.random() * list.length) | 0]

function warnOnce() {
  if (warned) return
  warned = true
  try {
    console.warn('[chips] some chip samples could not be loaded — chip audio is disabled')
  } catch {
    /* ignore */
  }
}

let knockWarned = false
function warnKnockOnce() {
  if (knockWarned) return
  knockWarned = true
  try {
    console.warn('[table] knock samples could not be loaded — check knocks are muted')
  } catch {
    /* ignore */
  }
}

function getContext() {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (ctx) return ctx
  try {
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = muted ? 0 : MASTER_VOLUME
    master.connect(ctx.destination)
  } catch {
    ctx = null
    master = null
    return null
  }
  return ctx
}

/** Resolve `data` to an AudioBuffer, or null when decoding is impossible. */
function decode(c, data) {
  return new Promise((resolve) => {
    let settled = false
    const done = (buffer) => {
      if (settled) return
      settled = true
      resolve(buffer || null)
    }
    try {
      const ret = c.decodeAudioData(data, done, () => done(null))
      if (ret && typeof ret.then === 'function') ret.then(done, () => done(null))
    } catch {
      done(null)
    }
  })
}

/** Fetch + decode one file once; always resolves (null on failure). */
function load(file, dir = DIR) {
  const key = dir + file
  const cached = buffers.get(key)
  if (cached) return Promise.resolve(cached)
  const inflight = pending.get(key)
  if (inflight) return inflight

  const c = getContext()
  if (!c || typeof fetch !== 'function') return Promise.resolve(null)

  const onFail = () => {
    pending.delete(key)
    if (dir === TABLE_DIR) warnKnockOnce()
    else warnOnce()
    return null
  }

  const p = fetch(dir + file)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.arrayBuffer()
    })
    .then((data) => decode(c, data))
    .then((buffer) => {
      if (buffer) buffers.set(key, buffer)
      pending.delete(key)
      return buffer
    })
    .catch(onFail)

  pending.set(key, p)
  return p
}

/** Kick off loading of every sample (chips + table knocks); idempotent. */
function preload() {
  if (preloaded) return
  if (!getContext()) return
  preloaded = true
  ALL_SAMPLES.forEach((file) => {
    load(file)
  })
  KNOCKS.forEach((file) => {
    load(file, TABLE_DIR)
  })
}

/** Context ready for playback, or null when we should stay quiet. */
function ready() {
  if (muted) return null
  const c = getContext()
  if (!c) return null
  if (c.state !== 'running') {
    try {
      const p = c.resume()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    } catch {
      /* suspended forever — stay silent */
    }
  }
  preload()
  return c
}

let hooked = false
function hookInteraction() {
  if (hooked || typeof window === 'undefined' || !window.addEventListener) return
  hooked = true
  const events = ['pointerdown', 'keydown', 'touchstart']
  const onInteract = () => {
    ready()
    events.forEach((name) => {
      try {
        window.removeEventListener(name, onInteract, true)
      } catch {
        /* ignore */
      }
    })
  }
  events.forEach((name) => {
    try {
      window.addEventListener(name, onInteract, { capture: true, passive: true })
    } catch {
      /* ignore */
    }
  })
}

hookInteraction()

/**
 * Play one random sample from a group.
 * Skipped (and loading started) when the buffer isn't decoded yet.
 */
function playSample(group, { when, gain = 1, rate = 1, offset = 0, dir = DIR } = {}) {
  try {
    const list = SAMPLES[group]
    if (!list || !list.length) return
    const c = ready()
    if (!c) return
    playFile(pick(list), { when, gain, rate, offset, dir, c })
  } catch {
    /* never let audio break the game */
  }
}

/** Play one already-known file from `dir` (one node, jittered pitch + start). */
function playFile(file, { when, gain, rate, offset = 0, dir = DIR, c } = {}) {
  try {
    const buffer = buffers.get(dir + file)
    if (!buffer) {
      load(file, dir)
      return
    }
    const src = c.createBufferSource()
    src.buffer = buffer
    src.playbackRate.value = Math.min(
      4,
      Math.max(0.25, (rate || 1) * rnd(1 - PITCH_JITTER, 1 + PITCH_JITTER)),
    )
    const g = c.createGain()
    g.gain.value = Math.max(0, gain == null ? 1 : gain)
    src.connect(g)
    g.connect(master)
    const start = Math.max(c.currentTime, (when == null ? c.currentTime : when) + rnd(0, 0.004))
    src.start(start, Math.min(offset, Math.max(0, buffer.duration - 0.01)))
  } catch {
    /* never let audio break the game */
  }
}

/** One chip set down on the felt — quick-bet / denomination buttons. */
export function playChipClick() {
  const c = ready()
  if (!c) return
  playSample('lay', { when: c.currentTime + 0.005, gain: 0.85 })
}

/**
 * Chips pushed in for a bet / call / raise.
 * One sample per chip, slightly staggered; bigger counts also lay down a
 * stack sample so it doesn't just sound like a burst of taps.
 * @param {{ count?: number, gain?: number }} opts count = how many chips hit the felt
 */
export function playChipBet({ count = 1, gain = 0.9 } = {}) {
  const c = ready()
  if (!c) return
  try {
    const n = Math.max(1, Math.min(8, Math.round(count)))
    const level = Math.max(0, gain)
    const t0 = c.currentTime + 0.01
    const spread = 0.06 + n * 0.012

    if (n >= 4) {
      // the bulk of the stack arriving in one go
      playSample('stack', { when: t0, gain: 0.5 * level, rate: rnd(0.94, 1.04) })
      playSample('handle', { when: t0 + rnd(0.02, 0.06), gain: 0.28 * level })
    }

    for (let i = 0; i < n; i++) {
      const when = t0 + spread * (i / n) * rnd(0.75, 1.25)
      const group = Math.random() < 0.55 ? 'lay' : 'collide'
      playSample(group, {
        when,
        gain: 0.55 * level * rnd(0.75, 1.15),
        rate: rnd(0.94, 1.08),
      })
    }
  } catch {
    /* ignore */
  }
}

/** The whole stack goes in — denser, wider, with a short shuffle. */
export function playChipAllIn({ gain = 1 } = {}) {
  const c = ready()
  if (!c) return
  try {
    const level = Math.max(0, gain)
    const t0 = c.currentTime + 0.01

    // the stack being pushed forward, then tipping over
    playSample('handle', { when: t0, gain: 0.45 * level, rate: rnd(0.96, 1.04) })
    playSample('stack', { when: t0 + 0.04, gain: 0.55 * level, rate: rnd(0.92, 1.02) })

    // chips rattling together as they go
    const hits = 7
    for (let i = 0; i < hits; i++) {
      const t = Math.pow(i / hits, 0.75)
      playSample(i % 2 ? 'collide' : 'lay', {
        when: t0 + t * 0.34 * rnd(0.85, 1.15),
        gain: 0.42 * level * rnd(0.7, 1.1) * (1 - t * 0.3),
        rate: rnd(0.9, 1.1),
      })
    }
    playSample('stack', { when: t0 + 0.3, gain: 0.34 * level, rate: rnd(0.94, 1.06) })
  } catch {
    /* ignore */
  }
}

/** Pot pushed to the winner — chips cascading and clinking together. */
export function playPotCollect({ big = false, delay = 0.02 } = {}) {
  const c = ready()
  if (!c) return
  try {
    const t0 = c.currentTime + Math.max(0, delay)
    const hits = big ? 13 : 9
    const reach = big ? 0.75 : 0.55

    // the pile being dragged across the felt
    playSample('handle', { when: t0, gain: big ? 0.32 : 0.22, rate: rnd(0.95, 1.05) })
    if (big) playSample('handle', { when: t0 + 0.22, gain: 0.2, rate: rnd(0.95, 1.05) })

    for (let i = 0; i < hits; i++) {
      // Denser in the middle, thinning out as the chips settle.
      const t = Math.pow(i / hits, 0.7)
      const group = i % 3 === 0 ? 'stack' : i % 3 === 1 ? 'collide' : 'lay'
      playSample(group, {
        when: t0 + t * reach * rnd(0.85, 1.15),
        gain: (big ? 0.4 : 0.3) * rnd(0.6, 1.1) * (1 - t * 0.35),
        rate: rnd(0.92, 1.12),
      })
    }
  } catch {
    /* ignore */
  }
}

/**
 * Check — the classic "knock on the table": two quick raps with the knuckles,
 * the second one a little softer as the hand settles.
 * @param {{ gain?: number }} opts relative volume (bots are a touch quieter)
 */
export function playCheckKnock({ gain = 1 } = {}) {
  const c = ready()
  if (!c) return
  try {
    const level = Math.max(0, gain)
    const t0 = c.currentTime + 0.01
    // Same sample both times so it reads as one gesture, but pitch-jittered.
    const file = pick(KNOCKS)
    playFile(file, {
      when: t0,
      gain: 0.6 * level,
      rate: rnd(0.97, 1.03),
      dir: TABLE_DIR,
      c,
    })
    playFile(file, {
      when: t0 + rnd(0.11, 0.15),
      gain: 0.42 * level,
      rate: rnd(0.95, 1.0),
      dir: TABLE_DIR,
      c,
    })
  } catch {
    /* ignore */
  }
}

/** Enable / disable all chip audio (not surfaced in the UI yet). */
export function setChipSoundMuted(value) {
  muted = !!value
  if (master) {
    try {
      master.gain.value = muted ? 0 : MASTER_VOLUME
    } catch {
      /* ignore */
    }
  }
}

export function isChipSoundMuted() {
  return muted
}

export function useChipSounds() {
  return {
    playChipClick,
    playChipBet,
    playChipAllIn,
    playPotCollect,
    playCheckKnock,
    setChipSoundMuted,
    isChipSoundMuted,
  }
}

export default useChipSounds
