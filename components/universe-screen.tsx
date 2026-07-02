'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { useState } from 'react'
import { PLANETS } from '@/lib/planets'
import { AmbientHearts } from './planet-effects'
import { FinaleScreen } from './finale-screen'
import { PlanetModal } from './planet-modal'

const POSITIONS = [
  { x: 50, y: 5 },
  { x: 27, y: 14 },
  { x: 71, y: 23 },
  { x: 31, y: 33 },
  { x: 66, y: 42 },
  { x: 29, y: 52 },
  { x: 69, y: 61 },
  { x: 34, y: 71 },
  { x: 64, y: 80 },
  { x: 50, y: 91 },
]

export function UniverseScreen() {
  const [explored, setExplored] = useState<Set<number>>(new Set())
  const [openId, setOpenId] = useState<number | null>(null)
  const [finaleDone, setFinaleDone] = useState(false)

  // A planet is unlocked if it's the first, or the previous one is explored.
  const isUnlocked = (id: number) =>
    id === 1 || explored.has(id - 1)

  const complete = (id: number) => {
    setExplored((prev) => new Set(prev).add(id))
    setOpenId(null)
  }

  const openPlanet = PLANETS.find((p) => p.id === openId) ?? null
  const pathPoints = POSITIONS.map((p) => `${p.x},${p.y}`).join(' ')

  return (
    <div className="relative min-h-dvh">
      <AmbientHearts />

      {/* Progress header */}
      <div className="glass sticky top-0 z-20 mx-auto flex max-w-3xl items-center justify-between gap-4 rounded-b-2xl px-5 py-3 sm:px-8">
        <div>
          <p className="font-heading text-lg italic text-foreground">
            Journey Progress
          </p>
          <p className="text-sm text-muted-foreground">
            {explored.size} / {PLANETS.length} Planets Explored
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
          {Math.round((explored.size / PLANETS.length) * 100)}%
        </div>
      </div>

      {/* Star map */}
      <div className="relative mx-auto min-h-[220vh] w-full max-w-4xl px-4">
        {/* Glowing connecting path */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="pathgrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.78 0.15 350)" />
              <stop offset="100%" stopColor="oklch(0.72 0.14 300)" />
            </linearGradient>
          </defs>
          <polyline
            points={pathPoints}
            fill="none"
            stroke="url(#pathgrad)"
            strokeWidth="0.4"
            strokeLinecap="round"
            strokeDasharray="1.5 1.5"
            opacity="0.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {PLANETS.map((planet, i) => {
          const pos = POSITIONS[i]
          const unlocked = isUnlocked(planet.id)
          const done = explored.has(planet.id)
          return (
            <div
              key={planet.id}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <motion.button
                type="button"
                disabled={!unlocked}
                onClick={() => setOpenId(planet.id)}
                whileHover={unlocked ? { scale: 1.12 } : undefined}
                whileTap={unlocked ? { scale: 0.94 } : undefined}
                animate={
                  unlocked
                    ? { y: [0, -8, 0] }
                    : { opacity: 0.45 }
                }
                transition={{
                  duration: 4 + (i % 3),
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                aria-label={
                  unlocked
                    ? `Explore ${planet.name}`
                    : `${planet.name} (locked)`
                }
                className="group relative flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed"
              >
                {/* rotating sphere */}
                <span
                  className="relative block h-16 w-16 rounded-full sm:h-20 sm:w-20"
                  style={{
                    background: `radial-gradient(circle at 30% 25%, ${planet.colors[1]}, ${planet.colors[0]})`,
                    boxShadow: unlocked
                      ? `0 0 30px -4px ${planet.glow}, inset -6px -6px 14px rgba(0,0,0,0.45)`
                      : 'inset -6px -6px 14px rgba(0,0,0,0.6)',
                    filter: unlocked ? 'none' : 'grayscale(0.7)',
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-full opacity-40 mix-blend-overlay"
                    style={{
                      background:
                        'repeating-linear-gradient(60deg, transparent, transparent 6px, rgba(255,255,255,0.15) 8px)',
                      animation: 'spin-slow 18s linear infinite',
                    }}
                  />
                  {!unlocked && (
                    <span className="absolute inset-0 flex items-center justify-center text-foreground/70">
                      <Lock className="h-5 w-5" aria-hidden />
                    </span>
                  )}
                  {done && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[10px] text-secondary-foreground">
                      ✓
                    </span>
                  )}
                </span>
              </motion.button>
              <span
                className={`mt-2 max-w-[9rem] text-center text-xs font-medium sm:text-sm ${
                  unlocked ? 'text-foreground' : 'text-muted-foreground/60'
                }`}
              >
                {planet.emoji} {planet.name}
              </span>
            </div>
          )
        })}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {openPlanet && openPlanet.effect !== 'finale' && (
          <PlanetModal
            planet={openPlanet}
            explored={explored.has(openPlanet.id)}
            onClose={() => setOpenId(null)}
            onComplete={() => complete(openPlanet.id)}
          />
        )}
        {openPlanet && openPlanet.effect === 'finale' && (
          <FinaleScreen
            key="finale"
            onClose={() => setOpenId(null)}
            onComplete={() => {
              complete(10)
              setFinaleDone(true)
            }}
          />
        )}
      </AnimatePresence>

      {finaleDone && <span className="sr-only">Journey complete</span>}
    </div>
  )
}
