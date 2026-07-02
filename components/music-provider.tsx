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
  toggle: () => void
  setVolume: (v: number) => void
  start: () => void
}

const MusicContext = createContext<MusicContextValue | null>(null)

export function useMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used within MusicProvider')
  return ctx
}

/**
 * Generates a soft, evolving ambient pad with the Web Audio API so music
 * plays with no external file. To use your own song instead, drop it in
 * /public/music/ and swap this for an <audio> element.
 */
export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(0.4)
  const [started, setStarted] = useState(false)

  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const nodesRef = useRef<OscillatorNode[]>([])

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

    // Warm chord: A2, E3, C#4, A4 (A major-ish) with slow detune shimmer
    const freqs = [110, 164.81, 277.18, 440]
    const oscs: OscillatorNode[] = []
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator()
      osc.type = i % 2 === 0 ? 'sine' : 'triangle'
      osc.frequency.value = f
      const g = ctx.createGain()
      g.gain.value = 0.18 / (i + 1)

      // slow amplitude LFO for movement
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.05 + i * 0.02
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 0.06
      lfo.connect(lfoGain)
      lfoGain.connect(g.gain)
      lfo.start()

      osc.connect(g)
      g.connect(master)
      osc.start()
      oscs.push(osc)
    })

    ctxRef.current = ctx
    masterRef.current = master
    nodesRef.current = oscs
  }, [])

  const ramp = useCallback((target: number) => {
    const ctx = ctxRef.current
    const master = masterRef.current
    if (!ctx || !master) return
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime)
    master.gain.linearRampToValueAtTime(target, ctx.currentTime + 1.2)
  }, [])

  const start = useCallback(() => {
    buildGraph()
    ctxRef.current?.resume()
    setStarted(true)
    setIsPlaying(true)
    ramp(volume)
  }, [buildGraph, ramp, volume])

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
      nodesRef.current.forEach((n) => {
        try {
          n.stop()
        } catch {
          /* already stopped */
        }
      })
      ctxRef.current?.close()
    }
  }, [])

  return (
    <MusicContext.Provider
      value={{ isPlaying, volume, started, toggle, setVolume, start }}
    >
      {children}
    </MusicContext.Provider>
  )
}
