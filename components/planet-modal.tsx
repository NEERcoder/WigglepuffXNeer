'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, X, ZoomIn } from 'lucide-react'
import { useState } from 'react'
import type { Planet } from '@/lib/planets'
import { PlanetEffects } from './planet-effects'

export function PlanetModal({
  planet,
  explored,
  onClose,
  onComplete,
}: {
  planet: Planet
  explored: boolean
  onClose: () => void
  onComplete: () => void
}) {
  const [lightbox, setLightbox] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden
      />

      <PlanetEffects effect={planet.effect} color={planet.glow} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ type: 'spring', damping: 22, stiffness: 200 }}
        className="glass relative z-10 my-auto w-full max-w-lg rounded-3xl p-6 shadow-2xl sm:p-8"
        style={{ boxShadow: `0 0 60px -12px ${planet.glow}80` }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-background/60 text-foreground transition hover:bg-background/90"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        <div className="mb-5 text-center">
          <span className="text-4xl" aria-hidden>
            {planet.emoji}
          </span>
          <h2
            className="mt-2 text-balance font-heading text-2xl italic sm:text-3xl"
            style={{ color: planet.glow, textShadow: `0 0 20px ${planet.glow}60` }}
          >
            {planet.name}
          </h2>
        </div>

        {/* Glassmorphism image frame */}
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="group relative block w-full overflow-hidden rounded-2xl border border-border"
          aria-label="View photo fullscreen"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={planet.image || '/placeholder.svg'}
            alt={planet.name}
            className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:h-64"
          />
          <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/60 text-foreground opacity-0 transition group-hover:opacity-100">
            <ZoomIn className="h-4 w-4" aria-hidden />
          </span>
        </button>

        <p className="mt-6 text-pretty text-center font-heading text-lg italic leading-relaxed text-foreground/90 sm:text-xl">
          &ldquo;{planet.quote}&rdquo;
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {explored ? (
            <span className="flex items-center justify-center gap-2 rounded-xl bg-secondary/20 px-6 py-3 text-sm font-medium text-secondary">
              <Check className="h-4 w-4" aria-hidden /> Memory explored
            </span>
          ) : (
            <button
              type="button"
              onClick={onComplete}
              className="group flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              Continue our journey
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </button>
          )}
        </div>
      </motion.div>

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={planet.image || '/placeholder.svg'}
              alt={planet.name}
              className="max-h-[90vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
