'use client'

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Check, Heart, X, ZoomIn } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Planet } from '@/lib/planets'
import { useMusic } from './music-provider'
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
  const [imageLoaded, setImageLoaded] = useState(false)
  const { playPlanetTheme } = useMusic()

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({ container: containerRef })
  const imageY = useTransform(scrollY, [0, 200], [0, 20])

  useEffect(() => {
    playPlanetTheme(planet.id)
  }, [planet.id, playPlanetTheme])

  // Heart trail effect on mouse move
  const heartTrailRef = useRef<Array<{ x: number; y: number; id: number }>>([])
  const [hearts, setHearts] = useState<Array<{ x: number; y: number; id: number }>>([])
  let heartIdRef = useRef(0)

  useEffect(() => {
    let lastTime = 0
    const handleMove = (e: React.MouseEvent) => {
      const now = Date.now()
      if (now - lastTime < 80) return
      lastTime = now
      const id = heartIdRef.current++
      const newHeart = { x: e.clientX, y: e.clientY, id }
      setHearts(prev => [...prev.slice(-15), newHeart])
    }
    return () => {}
  }, [])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
    >
      {/* Animated gradient background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${planet.glow}30 0%, transparent 50%),
                        radial-gradient(ellipse at 30% 70%, ${planet.colors[0]}20 0%, transparent 40%),
                        radial-gradient(ellipse at 70% 80%, ${planet.colors[1]}15 0%, transparent 35%)`,
        }}
        onClick={onClose}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-background/70 backdrop-blur-xl"
        onClick={onClose}
        aria-hidden
      />

      <PlanetEffects effect={planet.effect} color={planet.glow} />

      {/* Floating hearts trail */}
      {hearts.map((h, i) => (
        <motion.span
          key={h.id}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0.3, y: -30 }}
          transition={{ duration: 1 }}
          className="pointer-events-none fixed z-[65] text-primary"
          style={{ left: h.x, top: h.y, fontSize: 14, textShadow: '0 0 8px var(--primary)' }}
        >
          ♥
        </motion.span>
      ))}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.85,
          y: 60,
          rotateX: 12,
          filter: 'blur(20px)',
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          rotateX: 0,
          filter: 'blur(0px)',
        }}
        exit={{
          opacity: 0,
          scale: 0.9,
          y: 30,
          filter: 'blur(10px)',
        }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 180,
          mass: 0.8,
        }}
        className="love-glass relative z-10 my-auto w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl"
        style={{
          boxShadow: `
            0 0 80px -20px ${planet.glow}60,
            0 25px 50px -12px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.1)
          `,
        }}
      >
        {/* Animated border glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${planet.glow}40, transparent 50%, ${planet.colors[1]}30)`,
          }}
          animate={{ opacity: [0.5, 0.8, 0.5], rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 text-foreground/70 backdrop-blur-sm transition-all hover:scale-110 hover:bg-background hover:text-foreground active:scale-95"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        <div className="relative p-6 sm:p-8">
          {/* Header with emoji and title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-6 text-center"
          >
            <motion.span
              className="inline-block text-5xl"
              animate={{
                y: [0, -8, 0],
                rotate: [-5, 5, -5],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden
            >
              {planet.emoji}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-3 text-balance font-heading text-2xl italic sm:text-3xl"
              style={{
                color: planet.glow,
                textShadow: `0 0 30px ${planet.glow}70, 0 0 60px ${planet.glow}40`,
              }}
            >
              {planet.name}
            </motion.h2>

            {/* Planet indicator dots */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-3 flex justify-center gap-1"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map(i => (
                <motion.div
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                    i === planet.id
                      ? 'scale-150'
                      : ''
                  }`}
                  style={{
                    background: i === planet.id ? planet.glow : `${planet.glow}30`,
                    boxShadow: i === planet.id ? `0 0 8px ${planet.glow}` : undefined,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Cinematic photo frame */}
          <motion.button
            type="button"
            onClick={() => setLightbox(true)}
            className="group relative block w-full overflow-hidden rounded-2xl"
            aria-label="View photo fullscreen"
          >
            {/* Frame glow */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                boxShadow: `inset 0 0 60px ${planet.glow}40`,
              }}
            />

            {/* Loading shimmer */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src={planet.image || '/placeholder.svg'}
              alt={planet.name}
              onLoad={() => setImageLoaded(true)}
              initial={{ scale: 1.1, opacity: 0, filter: 'blur(10px)' }}
              animate={{
                scale: imageLoaded ? 1 : 1.1,
                opacity: imageLoaded ? 1 : 0,
                filter: imageLoaded ? 'blur(0px)' : 'blur(10px)',
                y: imageLoaded ? imageY : 0,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-64"
            />

            {/* Hover overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <motion.span
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm"
              >
                <ZoomIn className="h-5 w-5 text-white" aria-hidden />
              </motion.span>
            </motion.div>
          </motion.button>

          {/* Quote with elegant reveal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative mt-8"
          >
            <Heart
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-4 w-4 opacity-30"
              style={{ color: planet.glow }}
              aria-hidden
            />
            <p className="text-pretty text-center font-heading text-lg italic leading-relaxed text-foreground/95 sm:text-xl">
              &ldquo;{planet.quote}&rdquo;
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            {explored ? (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center gap-2 rounded-xl bg-secondary/20 px-6 py-3 text-sm font-medium text-secondary backdrop-blur-sm"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Check className="h-4 w-4" aria-hidden />
                </motion.span>
                Memory explored
              </motion.span>
            ) : (
              <motion.button
                type="button"
                onClick={onComplete}
                whileHover={{ scale: 1.02, boxShadow: `0 0 40px ${planet.glow}50` }}
                whileTap={{ scale: 0.98 }}
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl px-8 py-4 font-medium text-primary-foreground shadow-lg transition-all"
                style={{
                  background: `linear-gradient(135deg, ${planet.glow}, ${planet.colors[1]})`,
                  boxShadow: `0 0 30px ${planet.glow}40`,
                }}
              >
                {/* Button shimmer effect */}
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-200%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                <span className="relative">Continue our journey</span>
                <ArrowRight
                  className="relative h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </motion.button>
            )}
          </motion.div>
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
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4 backdrop-blur-lg"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-h-[90vh] max-w-full"
            >
              {/* Decorative frame */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-50"
                style={{
                  background: `linear-gradient(135deg, ${planet.glow}30, transparent, ${planet.colors[1]}20)`,
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={planet.image || '/placeholder.svg'}
                alt={planet.name}
                className="relative max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
                style={{
                  boxShadow: `0 0 60px ${planet.glow}40`,
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
