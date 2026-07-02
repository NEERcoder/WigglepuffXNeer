'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Music2, Pause, Play, Volume2 } from 'lucide-react'
import { PLANETS } from '@/lib/planets'
import { useMusic } from './music-provider'

export function MusicPlayer() {
  const { isPlaying, volume, started, planetId, toggle, setVolume } = useMusic()

  if (!started) return null

  const currentPlanet = PLANETS.find(p => p.id === planetId) ?? PLANETS[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.5, type: 'spring', damping: 20 }}
      className="love-glass fixed bottom-5 right-5 z-50 flex items-center gap-4 rounded-2xl px-5 py-3.5 shadow-lg"
      style={{
        boxShadow: `0 0 30px -5px oklch(0.78 0.15 350 / 30%)`,
      }}
    >
      {/* Animated music icon */}
      <div className="relative flex h-10 w-10 items-center justify-center">
        <AnimatePresence>
          {isPlaying && (
            <>
              {/* Outer pulse ring */}
              <motion.span
                key="pulse-outer"
                initial={{ opacity: 0.5, scale: 0.8 }}
                animate={{ opacity: 0, scale: 1.8 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                className="absolute rounded-full bg-primary/20"
                style={{ inset: 0 }}
              />
              {/* Inner pulse ring */}
              <motion.span
                key="pulse-inner"
                initial={{ opacity: 0.6, scale: 0.9 }}
                animate={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3, ease: 'easeOut' }}
                className="absolute rounded-full bg-primary/30"
                style={{ inset: -4 }}
              />
            </>
          )}
        </AnimatePresence>
        <motion.span
          whileHover={{ scale: 1.1 }}
          className="relative flex h-10 w-10 items-center justify-center rounded-full"
          style={{
            background: `linear-gradient(135deg, ${currentPlanet.glow}40, ${currentPlanet.colors[1]}20)`,
          }}
        >
          <Music2 className="h-5 w-5 text-primary" aria-hidden />
        </motion.span>
      </div>

      {/* Play/Pause button */}
      <motion.button
        type="button"
        onClick={toggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        className="relative flex h-10 w-10 items-center justify-center rounded-full"
        style={{
          background: `linear-gradient(135deg, ${currentPlanet.glow}, ${currentPlanet.colors[1]})`,
          boxShadow: `0 0 20px ${currentPlanet.glow}60`,
        }}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 text-primary-foreground" aria-hidden />
        ) : (
          <Play className="ml-0.5 h-4 w-4 text-primary-foreground" aria-hidden />
        )}
      </motion.button>

      {/* Current theme indicator */}
      <div className="hidden flex-col items-start gap-0.5 sm:flex">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Now Playing</span>
        <motion.span
          key={planetId}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1.5 text-sm font-medium text-foreground"
        >
          <span>{currentPlanet.emoji}</span>
          <span>{currentPlanet.name}</span>
        </motion.span>
      </div>

      {/* Volume slider */}
      <div className="hidden items-center gap-2.5 sm:flex">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="text-muted-foreground"
        >
          <Volume2 className="h-4 w-4" aria-hidden />
        </motion.div>
        <div className="relative h-1 w-24 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-secondary"
            style={{ width: `${volume * 100}%` }}
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
            className="absolute inset-0 cursor-pointer appearance-none bg-transparent opacity-0"
          />
        </div>
      </div>

      {/* Heart decoration */}
      <motion.span
        animate={isPlaying ? {
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        } : { opacity: 0.3 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        className="text-primary"
      >
        <Heart className="h-4 w-4 fill-primary" aria-hidden />
      </motion.span>
    </motion.div>
  )
}
