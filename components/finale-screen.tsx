'use client'

import confetti from 'canvas-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, X } from 'lucide-react'
import { useState } from 'react'
import { PLANETS } from '@/lib/planets'
import { PlanetEffects } from './planet-effects'

export function FinaleScreen({
  onComplete,
  onClose,
}: {
  onComplete: () => void
  onClose: () => void
}) {
  const [ended, setEnded] = useState(false)
  const memories = PLANETS.slice(0, 9)

  const fireCelebration = () => {
    const colors = ['#ff9ec4', '#ffd6e8', '#c77dff', '#ffd97a']
    const end = Date.now() + 1200
    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors,
      })
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors,
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.6 },
      colors,
      scalar: 1.1,
    })
    setTimeout(() => setEnded(true), 1400)
    setTimeout(onComplete, 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{
        background:
          'radial-gradient(circle at 50% 40%, oklch(0.4 0.14 350 / 60%), oklch(0.14 0.04 300) 75%)',
      }}
    >
      <PlanetEffects effect="finale" color="#ff9ec4" />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="fixed right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-background/50 text-foreground transition hover:bg-background/80"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>

      <AnimatePresence mode="wait">
        {!ended ? (
          <motion.div
            key="finale"
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            transition={{ duration: 0.9 }}
            className="relative z-10 mx-auto flex min-h-dvh max-w-2xl flex-col items-center justify-center px-5 py-16 text-center"
          >
            <span className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
              Planet Ten
            </span>
            <h2 className="mt-2 font-heading text-4xl italic text-foreground text-glow sm:text-5xl">
              Neer&apos;s Heart
            </h2>

            {/* Circular memory wall around a glowing crystal heart */}
            <div className="relative my-10 h-72 w-72 sm:h-80 sm:w-80">
              {memories.map((m, i) => {
                const angle = (i / memories.length) * Math.PI * 2
                const radius = 140
                return (
                  <motion.img
                    key={m.id}
                    // eslint-disable-next-line @next/next/no-img-element
                    src={m.image || '/placeholder.svg'}
                    alt={m.name}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i, type: 'spring' }}
                    className="absolute h-12 w-12 rounded-full border-2 border-primary/50 object-cover shadow-lg sm:h-14 sm:w-14"
                    style={{
                      left: `calc(50% + ${Math.cos(angle) * radius}px - 28px)`,
                      top: `calc(50% + ${Math.sin(angle) * radius}px - 28px)`,
                    }}
                  />
                )
              })}
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              >
                <div
                  className="absolute inset-0 rounded-full blur-2xl"
                  style={{ background: '#ff9ec4', opacity: 0.6 }}
                />
                <Heart
                  className="relative h-28 w-28 fill-primary text-primary drop-shadow-[0_0_30px_#ff9ec4]"
                  aria-hidden
                />
              </motion.div>
            </div>

            <p className="max-w-md text-pretty font-heading text-xl italic leading-relaxed text-foreground/90">
              &ldquo;Every memory in this universe has you in it. And every road
              somehow led here.&rdquo;
            </p>

            <h3 className="mt-10 text-balance font-heading text-2xl text-foreground sm:text-3xl">
              ❤️ Ready to make more memories together?
            </h3>

            <button
              type="button"
              onClick={fireCelebration}
              className="mt-6 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-xl shadow-primary/40 transition-all hover:scale-105 active:scale-95"
            >
              Yes, let&apos;s keep exploring our universe together
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="continued"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative z-10 mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-5 text-center"
          >
            <h2 className="font-heading text-4xl italic text-foreground text-glow sm:text-6xl">
              To Be Continued...
            </h2>
            <p className="mt-6 text-pretty font-heading text-lg italic text-foreground/90">
              Chapter 2 begins when we finally meet.
            </p>
            <p className="mt-2 text-pretty text-muted-foreground">
              Our universe is still expanding.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
