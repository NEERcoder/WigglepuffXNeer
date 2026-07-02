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

/** Musical theme configuration for each planet */
interface PlanetTheme {
  chord: number[]
  melody: number[]
  arpSpeed: number
  lfoSpeed: number
  waveType: OscillatorType
  resonance: number
  padGain: number
}

const PLANET_THEMES: Record<number, PlanetTheme> = {
  1: { // Gift Star - warm, sweet
    chord: [130.81, 164.81, 196, 261.63], // C major warmth
    melody: [261.63, 293.66, 329.63, 261.63],
    arpSpeed: 2.5,
    lfoSpeed: 0.04,
    waveType: 'sine',
    resonance: 0.3,
    padGain: 0.16,
  },
  2: { // Flower Planet - gentle, blooming
    chord: [146.83, 185, 220, 293.66], // D major bloom
    melody: [293.66, 329.63, 349.23, 293.66],
    arpSpeed: 3,
    lfoSpeed: 0.035,
    waveType: 'sine',
    resonance: 0.25,
    padGain: 0.14,
  },
  3: { // Planet Riya - mysterious, cosmic
    chord: [98, 123.47, 146.83, 196], // G2-G3 ambient
    melody: [196, 220, 246.94, 196],
    arpSpeed: 2,
    lfoSpeed: 0.025,
    waveType: 'triangle',
    resonance: 0.4,
    padGain: 0.12,
  },
  4: { // Wigglepuff - playful, chirpy
    chord: [261.63, 329.63, 392, 523.25], // C4 major bright
    melody: [523.25, 587.33, 659.25, 523.25],
    arpSpeed: 4,
    lfoSpeed: 0.06,
    waveType: 'square',
    resonance: 0.2,
    padGain: 0.1,
  },
  5: { // My Weakness - emotional, deep
    chord: [110, 138.59, 164.81, 220], // A minor depth
    melody: [220, 246.94, 261.63, 220],
    arpSpeed: 1.8,
    lfoSpeed: 0.02,
    waveType: 'sine',
    resonance: 0.5,
    padGain: 0.18,
  },
  6: { // Forgiveness Moon - somber, healing
    chord: [82.41, 110, 130.81, 164.81], // E deep minor
    melody: [164.81, 185, 196, 164.81],
    arpSpeed: 1.5,
    lfoSpeed: 0.015,
    waveType: 'sine',
    resonance: 0.45,
    padGain: 0.15,
  },
  7: { // Promise Planet - majestic, golden
    chord: [130.81, 164.81, 196, 261.63], // C major noble
    melody: [261.63, 329.63, 392, 261.63],
    arpSpeed: 2.2,
    lfoSpeed: 0.03,
    waveType: 'triangle',
    resonance: 0.35,
    padGain: 0.16,
  },
  8: { // First Smile - bright, joyful
    chord: [174.61, 220, 261.63, 349.23], // F major joy
    melody: [349.23, 392, 440, 349.23],
    arpSpeed: 3.5,
    lfoSpeed: 0.05,
    waveType: 'sine',
    resonance: 0.25,
    padGain: 0.14,
  },
  9: { // Galaxy Eyes - ethereal, cosmic
    chord: [116.54, 146.83, 174.61, 233.08], // Bb cosmic
    melody: [233.08, 261.63, 293.66, 233.08],
    arpSpeed: 2,
    lfoSpeed: 0.018,
    waveType: 'sine',
    resonance: 0.55,
    padGain: 0.13,
  },
  10: { // Finale - love anthem
    chord: [130.81, 164.81, 196, 261.63, 329.63], // C major full
    melody: [261.63, 329.63, 392, 523.25, 659.25],
    arpSpeed: 2.8,
    lfoSpeed: 0.04,
    waveType: 'sine',
    resonance: 0.4,
    padGain: 0.2,
  },
}

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.35)
  const [started, setStarted] = useState(false)
  const [planetId, setPlanetId] = useState<number | null>(null)

  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const nodesRef = useRef<{ oscs: OscillatorNode[]; stops: () => void }[]>([])
  const currentThemeRef = useRef<number | null>(null)

  const createTheme = useCallback((themeId: number) => {
    const ctx = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return

    const theme = PLANET_THEMES[themeId] ?? PLANET_THEMES[1]

    // Stop previous theme
    nodesRef.current.forEach(n => n.stops())
    nodesRef.current = []

    const oscs: OscillatorNode[] = []
    const stops: (() => void)[] = []

    // Rich pad chord
    theme.chord.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = theme.waveType
      osc.frequency.value = freq

      const gain = ctx.createGain()
      gain.gain.value = theme.padGain / (i + 1)

      // Detune shimmer for warmth
      const detuneLfo = ctx.createOscillator()
      detuneLfo.type = 'sine'
      detuneLfo.frequency.value = theme.lfoSpeed + i * 0.01
      const detuneGain = ctx.createGain()
      detuneGain.gain.value = 3
      detuneLfo.connect(detuneGain)
      detuneGain.connect(osc.frequency)
      detuneLfo.start()
      stops.push(() => { detuneLfo.stop() })

      // Amplitude LFO for movement
      const ampLfo = ctx.createOscillator()
      ampLfo.type = 'sine'
      ampLfo.frequency.value = theme.lfoSpeed * 2 + i * 0.02
      const ampGain = ctx.createGain()
      ampGain.gain.value = 0.08
      ampLfo.connect(ampGain)
      ampGain.connect(gain.gain)
      ampLfo.start()
      stops.push(() => { ampLfo.stop() })

      // Filter for resonance
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 800 + i * 200
      filter.Q.value = theme.resonance

      osc.connect(gain)
      gain.connect(filter)
      filter.connect(master)
      osc.start()
      oscs.push(osc)
    })

    // Ethereal arpeggio melody
    const arpOsc = ctx.createOscillator()
    arpOsc.type = 'sine'
    const arpGain = ctx.createGain()
    arpGain.gain.value = 0.06

    const arpFilter = ctx.createBiquadFilter()
    arpFilter.type = 'lowpass'
    arpFilter.frequency.value = 1200
    arpFilter.Q.value = 2

    let arpIndex = 0
    const arpTime = theme.arpSpeed
    const playArp = () => {
      if (!ctxRef.current) return
      const now = ctx.currentTime
      arpOsc.frequency.setTargetAtTime(theme.melody[arpIndex % theme.melody.length], now, 0.1)
      arpIndex++

      // Gentle envelope per note
      arpGain.gain.setTargetAtTime(0.08, now, 0.05)
      arpGain.gain.setTargetAtTime(0.02, now + arpTime * 0.7, 0.1)
    }
    playArp()
    const arpInterval = setInterval(playArp, arpTime * 1000)

    arpOsc.connect(arpGain)
    arpGain.connect(arpFilter)
    arpFilter.connect(master)
    arpOsc.start()

    oscs.push(arpOsc)
    stops.push(() => {
      clearInterval(arpInterval)
      arpOsc.stop()
    })

    nodesRef.current.push({ oscs, stops: () => stops.forEach(s => s()) })
    currentThemeRef.current = themeId
  }, [])

  const buildGraph = useCallback(() => {
    if (ctxRef.current) return
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    const ctx = new AudioCtx()
    const master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    ctxRef.current = ctx
    masterRef.current = master
  }, [])

  const ramp = useCallback((target: number) => {
    const ctx = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
    master.gain.linearRampToValueAtTime(target, ctx.currentTime + 1.5)
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
      nodesRef.current.forEach(n => n.stops())
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
