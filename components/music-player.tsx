'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Music2, Pause, Play, Volume2 } from 'lucide-react'
import { useMusic } from './music-provider'

export function MusicPlayer() {
  const { isPlaying, volume, started, toggle, setVolume } = useMusic()

  if (!started) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="glass fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-lg"
    >
      <div className="relative flex h-9 w-9 items-center justify-center">
        <AnimatePresence>
          {isPlaying && (
            <motion.span
              key="pulse"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0.6, 0], scale: [1, 1.8] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-primary/40"
            />
          )}
        </AnimatePresence>
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
          <Music2 className="h-4 w-4" aria-hidden />
        </span>
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-110 active:scale-95"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" aria-hidden />
        ) : (
          <Play className="ml-0.5 h-4 w-4" aria-hidden />
        )}
      </button>

      <div className="hidden items-center gap-2 sm:flex">
        <Volume2 className="h-4 w-4 text-muted-foreground" aria-hidden />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Volume"
          className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-muted accent-primary"
        />
      </div>
    </motion.div>
  )
}
