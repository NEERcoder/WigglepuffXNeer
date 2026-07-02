'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { LockKeyhole, Sparkles } from 'lucide-react'
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
      setEasterEgg('You found the secret nickname ❤️')
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
      // let the star explosion + fade play before navigating
      window.setTimeout(onUnlock, 1900)
    } else {
      setEasterEgg('')
      setError("Oops! That's not our special date ❤️")
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-10">
      {/* Star explosion overlay on success */}
      <AnimatePresence>
        {exploding && (
          <>
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i / 60) * Math.PI * 2
              const dist = 60 + Math.random() * 60
              return (
                <motion.span
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: `${Math.cos(angle) * dist}vw`,
                    y: `${Math.sin(angle) * dist}vh`,
                    opacity: 0,
                    scale: 0.2,
                  }}
                  transition={{ duration: 1.6, ease: 'easeOut' }}
                  className="fixed left-1/2 top-1/2 z-40 h-1.5 w-1.5 rounded-full bg-primary"
                  style={{ boxShadow: '0 0 12px var(--primary)' }}
                />
              )
            })}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, delay: 0.3 }}
              className="fixed inset-0 z-30 bg-background"
            />
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={
          exploding
            ? { scale: 1.4, opacity: 0, filter: 'blur(8px)' }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: exploding ? 1.4 : 0.9, ease: 'easeOut' }}
        className="glass relative z-20 w-full max-w-md rounded-3xl px-7 py-10 text-center shadow-2xl sm:px-10"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary"
        >
          <LockKeyhole className="h-7 w-7" aria-hidden />
        </motion.div>

        <p className="mb-2 flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-[0.3em] text-secondary">
          <Sparkles className="h-4 w-4" aria-hidden /> Our Universe
        </p>
        <h1 className="text-balance font-heading text-3xl italic leading-tight text-foreground text-glow sm:text-4xl">
          Write the password to unlock our universe
        </h1>
        <p className="mt-3 text-pretty text-muted-foreground">
          A date that changed everything.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <input
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
            className="w-full rounded-xl border border-border bg-input/50 px-4 py-3 text-center text-lg tracking-widest text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-[1.02] hover:shadow-primary/50 active:scale-95"
          >
            <span>Unlock Our Universe</span>
          </button>
        </form>

        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-sm text-primary"
            >
              {error}
            </motion.p>
          )}
          {easterEgg && (
            <motion.p
              key="egg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-sm font-medium text-secondary"
            >
              {easterEgg}
            </motion.p>
          )}
        </AnimatePresence>

        <p className="mt-6 text-xs text-muted-foreground/70">
          Hint: the day our story began.
        </p>
      </motion.div>
    </div>
  )
}
