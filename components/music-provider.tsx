'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

interface MusicContextValue {
  isPlaying: boolean
  volume: number
  started: boolean
  planetId: number | null
  toggle: () => void
  setVolume: (v: number) => void
  start: () => void
  playPlanetTheme: (id: number) => void
}

const MusicContext = createContext<MusicContextValue | null>(null)

export function useMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used within MusicProvider')
  return ctx
}

/**
 * Enhanced musical theme configuration for each planet
 * Each theme creates a unique romantic atmosphere with:
 * - Lush chord progressions with extended harmonies (7ths, 9ths, 11ths)
 * - Multiple oscillator layers for warmth and depth
 * - Evolving arpeggios with cascading patterns
 * - Gentle rhythmic pulses
 * - Rich filtering and resonance
 */

interface PlanetTheme {
  // Extended chord with 5-7 notes for lush harmonies
  chord: number[]
  // Alternative chord for progression movement
  chordAlt?: number[]
  // Melody notes for arpeggios
  melody: number[]
  // Secondary melody layer (countermelody)
  melody2?: number[]
  // Bass notes for sub layer
  bass: number[]
  // Sparkle/high harmonic notes
  sparkle: number[]
  // Tempo settings
  arpSpeed: number
  bassSpeed: number
  sparkleSpeed: number
  // LFO modulation speeds
  lfoDetune: number
  lfoTremolo: number
  lfoFilter: number
  // Sound design
  padWave: OscillatorType
  bassWave: OscillatorType
  sparkleWave: OscillatorType
  // Mix levels
  padGain: number
  bassGain: number
  sparkleGain: number
  melodyGain: number
  // Filter settings
  filterFreq: number
  filterQ: number
  filterSweepRange: [number, number]
  // Chord progression timing
  chordChangeInterval?: number
  // Optional name for debugging
  name?: string
}

const PLANET_THEMES: Record<number, PlanetTheme> = {
  1: {
    // Gift Star - warm chocolate sweetness, nostalgic warmth
    // Key: F Major with warm extended voicings
    name: 'Gift Star - Sweet Nostalgia',
    chord: [87.31, 110, 130.81, 174.61, 220, 261.63], // Fmaj9 warm voicing
    chordAlt: [82.41, 98, 110, 146.83, 185, 220], // Bbmaj7 transition
    melody: [349.23, 392, 440, 523.25, 587.33, 523.25, 440, 392],
    melody2: [261.63, 293.66, 329.63, 349.23, 329.63, 293.66],
    bass: [43.66, 55, 65.41],
    sparkle: [698.46, 783.99, 880, 1046.5],
    arpSpeed: 1.8,
    bassSpeed: 4,
    sparkleSpeed: 0.4,
    lfoDetune: 0.08,
    lfoTremolo: 0.06,
    lfoFilter: 0.015,
    padWave: 'sine',
    bassWave: 'sine',
    sparkleWave: 'sine',
    padGain: 0.14,
    bassGain: 0.08,
    sparkleGain: 0.025,
    melodyGain: 0.05,
    filterFreq: 900,
    filterQ: 0.6,
    filterSweepRange: [700, 1200],
    chordChangeInterval: 8000,
  },
  2: {
    // Flower Planet - blooming romance, gentle growth
    // Key: D Major with Lydian lift dreamy and ethereal
    name: 'Flower Planet - Blooming Romance',
    chord: [73.42, 92.5, 110, 146.83, 185, 220, 277.18], // Dmaj9#11
    chordAlt: [65.41, 82.41, 98, 130.81, 164.81, 196], // Gmaj7 embrace
    melody: [293.66, 329.63, 369.99, 392, 440, 493.88, 440, 369.99],
    melody2: [220, 246.94, 261.63, 293.66, 329.63, 293.66],
    bass: [36.71, 49, 55],
    sparkle: [587.33, 659.25, 739.99, 880, 987.77],
    arpSpeed: 2.2,
    bassSpeed: 5,
    sparkleSpeed: 0.35,
    lfoDetune: 0.06,
    lfoTremolo: 0.045,
    lfoFilter: 0.012,
    padWave: 'sine',
    bassWave: 'sine',
    sparkleWave: 'sine',
    padGain: 0.12,
    bassGain: 0.07,
    sparkleGain: 0.03,
    melodyGain: 0.045,
    filterFreq: 1100,
    filterQ: 0.5,
    filterSweepRange: [800, 1400],
    chordChangeInterval: 9000,
  },
  3: {
    // Planet Riya - mysterious cosmic wonder, infinite depth
    // Key: Em with Phrygian mystery and suspended harmonies
    name: 'Planet Riya - Cosmic Mystery',
    chord: [41.2, 55, 82.41, 98, 123.47, 164.81, 196], // Em11 atmospheric
    chordAlt: [39.2, 49, 58.27, 73.42, 98, 116.54], // Gbsus2 mystery
    melody: [164.81, 185, 196, 220, 246.94, 261.63, 246.94, 220],
    melody2: [98, 110, 123.47, 130.81, 146.83, 164.81],
    bass: [20.6, 27.5, 41.2],
    sparkle: [493.88, 554.37, 622.25, 698.46, 783.99],
    arpSpeed: 2.5,
    bassSpeed: 6,
    sparkleSpeed: 0.5,
    lfoDetune: 0.035,
    lfoTremolo: 0.02,
    lfoFilter: 0.008,
    padWave: 'triangle',
    bassWave: 'sine',
    sparkleWave: 'sine',
    padGain: 0.1,
    bassGain: 0.09,
    sparkleGain: 0.02,
    melodyGain: 0.04,
    filterFreq: 600,
    filterQ: 1.2,
    filterSweepRange: [400, 900],
    chordChangeInterval: 10000,
  },
  4: {
    // Wigglepuff - playful chaos, joyous fun
    // Key: C Major with cheeky staccato energy
    name: 'Wigglepuff - Playful Chaos',
    chord: [130.81, 164.81, 196, 261.63, 329.63, 392], // C6 playful
    chordAlt: [116.54, 146.83, 174.61, 233.08, 293.66, 349.23], // Bb cheerful
    melody: [523.25, 587.33, 659.25, 698.46, 783.99, 880, 783.99, 698.46],
    melody2: [392, 440, 493.88, 523.25, 587.33, 523.25],
    bass: [65.41, 82.41, 98],
    sparkle: [1046.5, 1174.66, 1318.51, 1396.91, 1567.98],
    arpSpeed: 0.8,
    bassSpeed: 2.5,
    sparkleSpeed: 0.25,
    lfoDetune: 0.12,
    lfoTremolo: 0.1,
    lfoFilter: 0.025,
    padWave: 'triangle',
    bassWave: 'triangle',
    sparkleWave: 'sine',
    padGain: 0.08,
    bassGain: 0.06,
    sparkleGain: 0.035,
    melodyGain: 0.055,
    filterFreq: 1500,
    filterQ: 0.4,
    filterSweepRange: [1000, 2000],
    chordChangeInterval: 4000,
  },
  5: {
    // My Weakness - deep emotional vulnerability, heart swelling
    // Key: Am with heartbreaking diminished colors
    name: 'My Weakness - Heart\'s Confession',
    chord: [55, 65.41, 82.41, 110, 130.81, 164.81, 196], // Amadd9 vulnerable
    chordAlt: [49, 58.27, 73.42, 98, 116.54, 138.59], // Fmaj7#11 yearning
    melody: [220, 246.94, 261.63, 293.66, 329.63, 349.23, 329.63, 293.66],
    melody2: [164.81, 185, 196, 220, 246.94, 261.63],
    bass: [27.5, 32.7, 41.2],
    sparkle: [440, 493.88, 523.25, 587.33, 659.25],
    arpSpeed: 3.2,
    bassSpeed: 7,
    sparkleSpeed: 0.6,
    lfoDetune: 0.025,
    lfoTremolo: 0.018,
    lfoFilter: 0.006,
    padWave: 'sine',
    bassWave: 'sine',
    sparkleWave: 'sine',
    padGain: 0.15,
    bassGain: 0.1,
    sparkleGain: 0.015,
    melodyGain: 0.035,
    filterFreq: 500,
    filterQ: 1.5,
    filterSweepRange: [350, 750],
    chordChangeInterval: 12000,
  },
  6: {
    // Forgiveness Moon - healing rain, cleansing tears
    // Key: Dm with melancholic acceptance
    name: 'Forgiveness Moon - Healing Rain',
    chord: [36.71, 49, 55, 73.42, 87.31, 110, 146.83], // Dm9 rain
    chordAlt: [32.7, 43.65, 58.27, 73.42, 82.41, 110], // Bbmaj7 sorrow
    melody: [146.83, 164.81, 174.61, 196, 220, 233.08, 220, 196],
    melody2: [110, 123.47, 130.81, 146.83, 164.81, 174.61],
    bass: [18.35, 24.5, 27.5],
    sparkle: [392, 440, 493.88, 523.25, 587.33],
    arpSpeed: 3.5,
    bassSpeed: 8,
    sparkleSpeed: 0.55,
    lfoDetune: 0.02,
    lfoTremolo: 0.015,
    lfoFilter: 0.005,
    padWave: 'sine',
    bassWave: 'sine',
    sparkleWave: 'sine',
    padGain: 0.13,
    bassGain: 0.11,
    sparkleGain: 0.012,
    melodyGain: 0.03,
    filterFreq: 400,
    filterQ: 2,
    filterSweepRange: [300, 650],
    chordChangeInterval: 14000,
  },
  7: {
    // Promise Planet - majestic golden vow, eternal commitment
    // Key: Ab Major with regal nobility
    name: 'Promise Planet - Golden Vow',
    chord: [51.91, 65.41, 82.41, 103.83, 130.81, 155.56, 207.65], // Abmaj7 noble
    chordAlt: [46.25, 58.27, 69.3, 92.5, 116.54, 138.59], // Dbmaj7 promise
    melody: [207.65, 233.08, 261.63, 311.13, 349.23, 415.3, 349.23, 311.13],
    melody2: [155.56, 174.61, 196, 207.65, 233.08, 261.63],
    bass: [25.96, 32.7, 41.2],
    sparkle: [415.3, 466.16, 523.25, 622.25, 698.46],
    arpSpeed: 2.8,
    bassSpeed: 6,
    sparkleSpeed: 0.45,
    lfoDetune: 0.045,
    lfoTremolo: 0.035,
    lfoFilter: 0.01,
    padWave: 'triangle',
    bassWave: 'sine',
    sparkleWave: 'sine',
    padGain: 0.14,
    bassGain: 0.085,
    sparkleGain: 0.028,
    melodyGain: 0.048,
    filterFreq: 850,
    filterQ: 0.8,
    filterSweepRange: [600, 1100],
    chordChangeInterval: 10000,
  },
  8: {
    // First Smile - bright joy, heart racing happiness
    // Key: F Major with sparkling optimism
    name: 'First Smile - Heart\'s Joy',
    chord: [87.31, 110, 130.81, 174.61, 220, 261.63, 329.63], // Fmaj7 bright
    chordAlt: [73.42, 92.5, 110, 146.83, 185, 220, 293.66], // Dm7 happiness
    melody: [349.23, 392, 440, 523.25, 587.33, 659.25, 587.33, 523.25],
    melody2: [261.63, 293.66, 329.63, 349.23, 392, 440],
    bass: [43.66, 55, 65.41],
    sparkle: [698.46, 783.99, 880, 987.77, 1046.5, 1174.66],
    arpSpeed: 1.5,
    bassSpeed: 3.5,
    sparkleSpeed: 0.3,
    lfoDetune: 0.09,
    lfoTremolo: 0.07,
    lfoFilter: 0.018,
    padWave: 'sine',
    bassWave: 'triangle',
    sparkleWave: 'sine',
    padGain: 0.11,
    bassGain: 0.065,
    sparkleGain: 0.04,
    melodyGain: 0.055,
    filterFreq: 1300,
    filterQ: 0.45,
    filterSweepRange: [900, 1600],
    chordChangeInterval: 6000,
  },
  9: {
    // Galaxy Eyes - infinite cosmic wonder, ethereal beauty
    // Key: Eb with lydian spaciness
    name: 'Galaxy Eyes - Cosmic Wonder',
    chord: [38.89, 51.91, 58.27, 77.78, 103.83, 116.54, 155.56], // Ebmaj7#11 space
    chordAlt: [34.65, 46.25, 58.27, 69.3, 92.5, 103.83], // Absus2 ether
    melody: [155.56, 174.61, 207.65, 233.08, 261.63, 311.13, 261.63, 233.08],
    melody2: [116.54, 130.81, 155.56, 174.61, 196, 207.65],
    bass: [19.45, 25.96, 29.14],
    sparkle: [311.13, 349.23, 415.3, 466.16, 523.25, 622.25],
    arpSpeed: 3,
    bassSpeed: 9,
    sparkleSpeed: 0.5,
    lfoDetune: 0.015,
    lfoTremolo: 0.012,
    lfoFilter: 0.004,
    padWave: 'sine',
    bassWave: 'sine',
    sparkleWave: 'sine',
    padGain: 0.1,
    bassGain: 0.09,
    sparkleGain: 0.022,
    melodyGain: 0.038,
    filterFreq: 450,
    filterQ: 2.5,
    filterSweepRange: [300, 800],
    chordChangeInterval: 15000,
  },
  10: {
    // Finale - ultimate love anthem, everything combined
    // Key: C Major with all the love
    name: 'Finale - Love Anthem',
    chord: [65.41, 82.41, 130.81, 164.81, 196, 261.63, 329.63, 392], // Cmaj13 love
    chordAlt: [55, 73.42, 98, 110, 146.83, 185, 220, 293.66], // Fmaj9 forever
    melody: [261.63, 329.63, 392, 523.25, 659.25, 783.99, 659.25, 523.25],
    melody2: [196, 220, 261.63, 329.63, 392, 440, 493.88],
    bass: [32.7, 41.2, 65.41],
    sparkle: [523.25, 659.25, 783.99, 1046.5, 1174.66, 1318.51, 1567.98],
    arpSpeed: 2.5,
    bassSpeed: 5,
    sparkleSpeed: 0.35,
    lfoDetune: 0.055,
    lfoTremolo: 0.045,
    lfoFilter: 0.012,
    padWave: 'sine',
    bassWave: 'sine',
    sparkleWave: 'sine',
    padGain: 0.16,
    bassGain: 0.09,
    sparkleGain: 0.035,
    melodyGain: 0.055,
    filterFreq: 1000,
    filterQ: 0.7,
    filterSweepRange: [700, 1400],
    chordChangeInterval: 8000,
  },
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.4)
  const [started, setStarted] = useState(false)
  const [planetId, setPlanetId] = useState<number | null>(null)

  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const reverbRef = useRef<ConvolverNode | null>(null)
  const nodesRef = useRef<(() => void)[]>([])
  const currentThemeRef = useRef<number | null>(null)
  const chordIndexRef = useRef(0)

  // Create impulse response for reverb
  const createReverbImpulse = useCallback((ctx: AudioContext, duration = 3, decay = 2) => {
    const sampleRate = ctx.sampleRate
    const length = sampleRate * duration
    const impulse = ctx.createBuffer(2, length, sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
      }
    }
    return impulse
  }, [])

  const createOscillatorWithLFOs = useCallback((
    ctx: AudioContext,
    freq: number,
    type: OscillatorType,
    gainValue: number,
    theme: PlanetTheme,
    destination: AudioNode,
    detuneOffset = 0
  ) => {
    // Create dual oscillators for warmth
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    osc1.type = type
    osc2.type = type
    osc1.frequency.value = freq
    osc2.frequency.value = freq * 1.002 // Slight detune for thickness

    // Detune LFO for shimmer
    const detuneLfo = ctx.createOscillator()
    detuneLfo.type = 'sine'
    detuneLfo.frequency.value = theme.lfoDetune + detuneOffset

    const detuneGain = ctx.createGain()
    detuneGain.gain.value = 4

    const detuneGain2 = ctx.createGain()
    detuneGain2.gain.value = -4

    detuneLfo.connect(detuneGain)
    detuneLfo.connect(detuneGain2)
    detuneGain.connect(osc1.frequency)
    detuneGain2.connect(osc2.frequency)

    // Tremolo LFO for warmth
    const tremoloLfo = ctx.createOscillator()
    tremoloLfo.type = 'sine'
    tremoloLfo.frequency.value = theme.lfoTremolo + detuneOffset * 0.5

    const tremoloGain = ctx.createGain()
    tremoloGain.gain.value = 0.15

    // Main gain
    const gain = ctx.createGain()
    gain.gain.value = gainValue

    tremoloLfo.connect(tremoloGain)
    tremoloGain.connect(gain.gain)

    // Low-pass filter for warmth
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = theme.filterFreq + Math.random() * 200
    filter.Q.value = theme.filterQ

    // Connect
    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(destination)

    osc1.start()
    osc2.start()
    detuneLfo.start()
    tremoloLfo.start()

    return {
      stop: () => {
        osc1.stop()
        osc2.stop()
        detuneLfo.stop()
        tremoloLfo.stop()
      },
      setFrequency: (f: number) => {
        osc1.frequency.setTargetAtTime(f, ctx.currentTime, 0.3)
        osc2.frequency.setTargetAtTime(f * 1.002, ctx.currentTime, 0.3)
      }
    }
  }, [])

  const createArpeggio = useCallback((
    ctx: AudioContext,
    notes: number[],
    speed: number,
    gainValue: number,
    theme: PlanetTheme,
    destination: AudioNode,
    secondary = false
  ) => {
    const osc = ctx.createOscillator()
    osc.type = secondary ? 'triangle' : 'sine'

    const gain = ctx.createGain()
    gain.gain.value = 0

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 2000
    filter.Q.value = 1

    // Add slight detune for richness
    const osc2 = ctx.createOscillator()
    osc2.type = osc.type
    osc2.frequency.value = osc.frequency.value * 1.005

    osc.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(destination)

    osc.start()
    osc2.start()

    let noteIndex = 0
    let direction = 1 // for up-down pattern

    const playNote = () => {
      if (!ctxRef.current) return

      const note = notes[noteIndex % notes.length]
      const now = ctx.currentTime

      osc.frequency.setTargetAtTime(note, now, 0.05)
      osc2.frequency.setTargetAtTime(note * 1.005, now, 0.05)

      // Gentle envelope
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(gainValue * 0.8, now + speed * 0.15)
      gain.gain.exponentialRampToValueAtTime(gainValue * 0.3, now + speed * 0.6)
      gain.gain.linearRampToValueAtTime(0.001, now + speed * 0.95)

      // Up-down arpeggio pattern
      noteIndex += direction
      if (noteIndex >= notes.length - 1 || noteIndex <= 0) {
        direction *= -1
      }
    }

    playNote()
    const interval = setInterval(playNote, speed * 1000)

    return () => {
      clearInterval(interval)
      osc.stop()
      osc2.stop()
    }
  }, [])

  const createBassPulse = useCallback((
    ctx: AudioContext,
    notes: number[],
    speed: number,
    gainValue: number,
    theme: PlanetTheme,
    destination: AudioNode
  ) => {
    const osc = ctx.createOscillator()
    osc.type = theme.bassWave

    const gain = ctx.createGain()
    gain.gain.value = 0

    // Sub oscillator for depth
    const subOsc = ctx.createOscillator()
    subOsc.type = 'sine'
    subOsc.frequency.value = osc.frequency.value / 2

    const subGain = ctx.createGain()
    subGain.gain.value = gainValue * 0.5

    // Soft distortion for warmth
    const distortion = ctx.createWaveShaper()
    const k = 10
    const n_samples = 44100
    const curve = new Float32Array(n_samples)
    const deg = Math.PI / 180
    for (let i = 0; i < n_samples; i++) {
      const x = (i * 2) / n_samples - 1
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x))
    }
    distortion.curve = curve
    distortion.oversample = 'none'

    osc.connect(distortion)
    subOsc.connect(subGain)
    distortion.connect(gain)
    subGain.connect(gain)
    gain.connect(destination)

    osc.start()
    subOsc.start()

    let noteIndex = 0

    const playNote = () => {
      if (!ctxRef.current) return

      const note = notes[noteIndex % notes.length]
      const now = ctx.currentTime

      osc.frequency.setTargetAtTime(note, now, 0.1)
      subOsc.frequency.setTargetAtTime(note / 2, now, 0.1)

      // Deep thump envelope
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(gainValue, now + 0.05)
      gain.gain.exponentialRampToValueAtTime(gainValue * 0.4, now + speed * 0.3)
      gain.gain.linearRampToValueAtTime(0.001, now + speed * 0.8)

      noteIndex++
    }

    playNote()
    const interval = setInterval(playNote, speed * 1000)

    return () => {
      clearInterval(interval)
      osc.stop()
      subOsc.stop()
    }
  }, [])

  const createSparkles = useCallback((
    ctx: AudioContext,
    notes: number[],
    speed: number,
    gainValue: number,
    destination: AudioNode
  ) => {
    const stops: (() => void)[] = []

    const playSparkle = () => {
      if (!ctxRef.current) return

      const note = notes[Math.floor(Math.random() * notes.length)]
      const now = ctx.currentTime

      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = note * (1 + Math.random() * 0.02)

      const gain = ctx.createGain()
      gain.gain.value = 0

      // High-pass for sparkle
      const filter = ctx.createBiquadFilter()
      filter.type = 'highpass'
      filter.frequency.value = note * 0.8

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(destination)

      // Quick sparkle envelope
      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(gainValue * (0.5 + Math.random() * 0.5), now + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, now + speed * (0.5 + Math.random() * 0.5))

      osc.start(now)
      osc.stop(now + speed * 1.5)
    }

    // Random sparkle timing
    const interval = setInterval(playSparkle, speed * 400 + Math.random() * speed * 200)
    stops.push(() => clearInterval(interval))

    // Play some initial sparkles
    for (let i = 0; i < 3; i++) {
      setTimeout(playSparkle, i * speed * 300)
    }

    return () => stops.forEach(s => s())
  }, [])

  const createTheme = useCallback((themeId: number) => {
    const ctx = ctxRef.current
    const master = masterRef.current
    const reverb = reverbRef.current
    if (!ctx || !master || !reverb) return

    const theme = PLANET_THEMES[themeId] ?? PLANET_THEMES[1]

    // Stop previous theme with fade out
    nodesRef.current.forEach(stop => stop())
    nodesRef.current = []
    currentThemeRef.current = themeId

    // Create sub-mixes for better control
    const padMix = ctx.createGain()
    padMix.gain.value = 1

    const melodyMix = ctx.createGain()
    melodyMix.gain.value = 1

    const bassMix = ctx.createGain()
    bassMix.gain.value = 1

    const sparkleMix = ctx.createGain()
    sparkleMix.gain.value = 0.7

    // Create master filter for sweeping effect
    const masterFilter = ctx.createBiquadFilter()
    masterFilter.type = 'lowpass'
    masterFilter.frequency.value = theme.filterFreq
    masterFilter.Q.value = 0.5

    // Filter LFO for gentle sweeps
    const filterLfo = ctx.createOscillator()
    filterLfo.type = 'sine'
    filterLfo.frequency.value = theme.lfoFilter

    const filterLfoGain = ctx.createGain()
    filterLfoGain.gain.value = theme.filterSweepRange[1] - theme.filterSweepRange[0]

    filterLfo.connect(filterLfoGain)
    filterLfoGain.connect(masterFilter.frequency)
    masterFilter.frequency.value = (theme.filterSweepRange[0] + theme.filterSweepRange[1]) / 2
    filterLfo.start()

    // Connect sub-mixes
    padMix.connect(masterFilter)
    melodyMix.connect(masterFilter)
    bassMix.connect(masterFilter) // Bass bypasses reverb for clarity
    sparkleMix.connect(masterFilter)

    masterFilter.connect(master)
    masterFilter.connect(reverb)

    // === PAD CHORD LAYER ===
    const padStops: (() => void)[] = []

    // Main chord with extended voicing
    theme.chord.forEach((freq, i) => {
      const result = createOscillatorWithLFOs(
        ctx,
        freq,
        theme.padWave,
        theme.padGain / (1 + i * 0.3),
        theme,
        padMix,
        i * 0.01
      )
      padStops.push(result.stop)
    })

    // Chord progression if available
    if (theme.chordAlt && theme.chordChangeInterval) {
      const changeChord = () => {
        chordIndexRef.current = (chordIndexRef.current + 1) % 2
        const currentChord = chordIndexRef.current === 0 ? theme.chord : theme.chordAlt

        currentChord.forEach((freq, i) => {
          if (theme.chord[i] && result.setFrequency) {
            result.setFrequency(freq)
          }
        })
      }
      const chordInterval = setInterval(changeChord, theme.chordChangeInterval)
      padStops.push(() => clearInterval(chordInterval))
    }

    nodesRef.current.push(() => padStops.forEach(s => s()))

    // === MELODY ARPEGGIO ===
    const melodyStop = createArpeggio(
      ctx,
      theme.melody,
      theme.arpSpeed,
      theme.melodyGain,
      theme,
      melodyMix
    )
    nodesRef.current.push(melodyStop)

    // Secondary melody layer
    if (theme.melody2) {
      const melody2Stop = createArpeggio(
        ctx,
        theme.melody2,
        theme.arpSpeed * 1.5,
        theme.melodyGain * 0.6,
        theme,
        melodyMix,
        true
      )
      nodesRef.current.push(melody2Stop)
    }

    // === BASS PULSE ===
    const bassStop = createBassPulse(
      ctx,
      theme.bass,
      theme.bassSpeed,
      theme.bassGain,
      theme,
      bassMix
    )
    nodesRef.current.push(bassStop)

    // === SPARKLE LAYER ===
    const sparkleStop = createSparkles(
      ctx,
      theme.sparkle,
      theme.sparkleSpeed,
      theme.sparkleGain,
      sparkleMix
    )
    nodesRef.current.push(sparkleStop)

    // Store filter LFO for cleanup
    nodesRef.current.push(() => filterLfo.stop())

    currentThemeRef.current = themeId
  }, [createOscillatorWithLFOs, createArpeggio, createBassPulse, createSparkles])

  const buildGraph = useCallback(() => {
    if (ctxRef.current) return
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    const ctx = new AudioCtx()

    // Master gain
    const master = ctx.createGain()
    master.gain.value = 0

    // Create reverb
    const reverb = ctx.createConvolver()
    reverb.buffer = createReverbImpulse(ctx, 3.5, 2.5)

    // Reverb wet/dry mix
    const reverbGain = ctx.createGain()
    reverbGain.gain.value = 0.25 // 25% reverb wet

    const dryGain = ctx.createGain()
    dryGain.gain.value = 0.85 // 85% dry

    // Compressor to smooth dynamics
    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.value = -24
    compressor.knee.value = 30
    compressor.ratio.value = 12
    compressor.attack.value = 0.003
    compressor.release.value = 0.25

    // Connect chain
    reverb.connect(reverbGain)
    reverbGain.connect(compressor)
    dryGain.connect(compressor)
    master.connect(dryGain)
    compressor.connect(ctx.destination)

    ctxRef.current = ctx
    masterRef.current = master
    reverbRef.current = reverb
  }, [createReverbImpulse])

  const ramp = useCallback((target: number) => {
    const ctx = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
    master.gain.linearRampToValueAtTime(target, ctx.currentTime + 2)
  }, [])

  const start = useCallback(() => {
    buildGraph()
    ctxRef.current?.resume()
    setStarted(true)
    setIsPlaying(true)
    createTheme(1)
    ramp(volume)
  }, [buildGraph, createTheme, ramp, volume])

  const playPlanetTheme = useCallback((id: number) => {
    if (!started) {
      buildGraph()
      ctxRef.current?.resume()
      setStarted(true)
      setIsPlaying(true)
    }
    if (currentThemeRef.current !== id) {
      createTheme(id)
      setPlanetId(id)
    }
  }, [buildGraph, createTheme, started])

  const toggle = useCallback(() => {
    if (!started) {
      start()
      return
    }
    setIsPlaying((prev) => {
      const next = !prev
      ramp(next ? volume : 0)
      return next
    })
  }, [ramp, start, started, volume])

  const setVolume = useCallback(
    (v: number) => {
      setVolumeState(v)
      if (isPlaying) ramp(v)
    },
    [isPlaying, ramp],
  )

  useEffect(() => {
    return () => {
      nodesRef.current.forEach(stop => stop())
      ctxRef.current?.close()
    }
  }, [])

  return (
    <MusicContext.Provider
      value={{ isPlaying, volume, started, planetId, toggle, setVolume, start, playPlanetTheme }}
    >
      {children}
    </MusicContext.Provider>
  )
}
