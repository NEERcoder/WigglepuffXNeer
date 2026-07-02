'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Heart, LockKeyhole, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { PLANET_PASSWORD } from '@/lib/planets'
import { useMusic } from './music-provider'

export function LandingScreen({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [easterEgg, setEasterEgg] = useState('')
  const [exploding, setExploding] = useState(false)
  const { start } = useMusic()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const guess = value.trim().toLowerCase()

    if (guess === 'wigglepuff') {
      setEasterEgg('You found the secret nickname <3')
      setError('')
      return
    }
    if (guess === 'weakness') {
      setEasterEgg('Error 404: Resistance impossible.')
      setError('')
      return
    }

    if (value.trim() === PLANET_PASSWORD) {
      setError('')
      setEasterEgg('')
      setExploding(true)
      start()
      window.setTimeout(onUnlock, 2200)
    } else {
      setEasterEgg('')
      setError("Oops! That's not our special date <3")
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-10">
      {/* Animated heart particles background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-primary/20"
            style={{
              left: `${10 + (i * 7) % 80}%`,
              top: `${15 + (i * 11) % 70}%`,
              fontSize: `${16 + (i % 4) * 8}px`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          >
            {i % 3 === 0 ? '♥' : i % 3 === 1 ? '♡' : '❤'}
          </motion.span>
        ))}
      </div>

      {/* Star explosion overlay on success */}
      <AnimatePresence>
        {exploding && (
          <>
            {/* Core burst */}
            {Array.from({ length: 80 }).map((_, i) => {
              const angle = (i / 80) * Math.PI * 2
              const dist = 40 + Math.random() * 100
              const size = 2 + Math.random() * 4
              return (
                <motion.span
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: `${Math.cos(angle) * dist}vw`,
                    y: `${Math.sin(angle) * dist}vh`,
                    opacity: 0,
                    scale: 0.1,
                  }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                  className="fixed left-1/2 top-1/2 z-40 rounded-full"
                  style={{
                    width: size,
                    height: size,
                    background: i % 2 === 0
                      ? 'oklch(0.78 0.15 350)'
                      : 'oklch(0.72 0.14 300)',
                    boxShadow: `0 0 ${size * 2}px currentColor`,
                  }}
                />
              )
            })}

            {/* Heart explosion */}
            {Array.from({ length: 25 }).map((_, i) => {
              const angle = (i / 25) * Math.PI * 2
              const dist = 30 + Math.random() * 80
              return (
                <motion.span
                  key={`h${i}`}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{
                    x: `${Math.cos(angle) * dist}vw`,
                    y: `${Math.sin(angle) * dist}vh`,
                    opacity: 0,
                    scale: [0, 1.5, 0],
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  className="fixed left-1/2 top-1/2 z-40 text-2xl"
                  style={{
                    color: 'oklch(0.78 0.15 350)',
                    textShadow: '0 0 20px currentColor',
                  }}
                >
                  {i % 2 === 0 ? '♥' : '💖'}
                </motion.span>
              )
            })}

            {/* Background fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.8, delay: 0.3 }}
              className="fixed inset-0 z-30"
              style={{
                background: 'radial-gradient(circle at center, oklch(0.13 0.03 285), oklch(0.05 0.02 285))',
              }}
            />

            {/* Central heart pulse */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2, 1.5], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="fixed left-1/2 top-1/2 z-35 -translate-x-1/2 -translate-y-1/2 text-8xl"
              style={{
                color: 'oklch(0.78 0.15 350)',
                textShadow: '0 0 60px currentColor',
              }}
            >
              <Heart className="h-24 w-24 fill-primary" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={
          exploding
            ? { scale: 1.5, opacity: 0, filter: 'blur(12px)' }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{
          duration: exploding ? 1.6 : 1,
          ease: 'easeOut',
          type: exploding ? 'tween' : 'spring',
          damping: 20,
        }}
        className="love-glass relative z-20 w-full max-w-md rounded-3xl px-8 py-12 text-center shadow-2xl sm:px-12"
        style={{
          boxShadow: `
            0 0 60px -15px oklch(0.78 0.15 350 / 40%),
            0 25px 50px -12px rgba(0,0,0,0.5)
          `,
        }}
      >
        {/* Animated border glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, oklch(0.78 0.15 350 / 20%), transparent 40%, oklch(0.72 0.14 300 / 15%))',
          }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />

        <motion.div
          animate={{
            y: [0, -8, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: 'radial-gradient(circle, oklch(0.78 0.15 350 / 20%), oklch(0.78 0.15 350 / 5%))',
            boxShadow: '0 0 40px oklch(0.78 0.15 350 / 30%)',
          }}
        >
          <LockKeyhole className="h-8 w-8 text-primary" aria-hidden />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-2 flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-[0.35em] text-secondary"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          <span>Our Universe</span>
          <Sparkles className="h-4 w-4" aria-hidden />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-balance font-heading text-3xl italic leading-tight text-foreground sm:text-4xl"
          style={{
            textShadow: '0 0 30px oklch(0.78 0.15 350 / 40%)',
          }}
        >
          Write the password to unlock our universe
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-pretty text-muted-foreground"
        >
          A date that changed everything.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          onSubmit={handleSubmit}
          className="relative mt-10 flex flex-col gap-5"
        >
          <div className="relative">
            <motion.input
              type="text"
              inputMode="text"
              autoComplete="off"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                setError('')
                setEasterEgg('')
              }}
              placeholder="Password"
              aria-label="Password"
              whileFocus={{ scale: 1.01 }}
              className="w-full rounded-xl border border-border/50 bg-background/60 px-5 py-4 text-center text-lg tracking-widest text-foreground outline-none transition-all focus:border-primary focus:bg-background/80 focus:ring-2 focus:ring-primary/40"
              style={{
                boxShadow: '0 4px 20px -5px rgba(0,0,0,0.3)',
              }}
            />
            {/* Input glow effect */}
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-xl opacity-0"
              style={{
                background: 'radial-gradient(circle at center, oklch(0.78 0.15 350 / 10%), transparent)',
              }}
              animate={{ opacity: value ? 0.5 : 0 }}
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 40px oklch(0.78 0.15 350 / 50%)',
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden rounded-xl px-8 py-4 font-medium text-primary-foreground shadow-lg transition-all"
            style={{
              background: 'linear-gradient(135deg, oklch(0.78 0.15 350), oklch(0.72 0.14 300))',
              boxShadow: '0 0 30px oklch(0.78 0.15 350 / 40%)',
            }}
          >
            {/* Button shimmer */}
            <span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              style={{
                animation: 'shimmer 3s linear infinite',
                transform: 'translateX(-100%)',
              }}
            />
            <span className="relative flex items-center justify-center gap-2">
              <Heart className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span>Unlock Our Universe</span>
              <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
            </span>
          </motion.button>
        </motion.form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-5 flex items-center justify-center gap-2 text-sm text-primary"
            >
              <Heart className="h-3 w-3" />
              {error}
            </motion.p>
          )}
          {easterEgg && (
            <motion.p
              key="egg"
              initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', damping: 15 }}
              className="mt-5 text-sm font-medium text-secondary"
            >
              {easterEgg}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-xs text-muted-foreground/60"
        >
          Hint: the day our story began.
        </motion.p>
      </motion.div>
    </div>
  )
}
