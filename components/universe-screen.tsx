'use client'

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { Lock, Sparkles } from 'lucide-react'
import { useRef, useState } from 'react'
import { PLANETS } from '@/lib/planets'
import { AmbientHearts, FloatingRings } from './planet-effects'
import { FinaleScreen } from './finale-screen'
import { PlanetModal } from './planet-modal'
import { PlanetSphere } from './planet-sphere'

const POSITIONS = [
  { x: 50, y: 5 },
  { x: 22, y: 14 },
  { x: 75, y: 23 },
  { x: 27, y: 33 },
  { x: 70, y: 42 },
  { x: 25, y: 52 },
  { x: 73, y: 61 },
  { x: 30, y: 71 },
  { x: 66, y: 80 },
  { x: 50, y: 91 },
]

export function UniverseScreen() {
  const [explored, setExplored] = useState<Set<number>>(new Set())
  const [openId, setOpenId] = useState<number | null>(null)
  const [finaleDone, setFinaleDone] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll({ container: containerRef })
  const bg1Y = useTransform(scrollY, [0, 800], [0, -100])
  const bg2Y = useTransform(scrollY, [0, 800], [0, -60])
  const bg3Y = useTransform(scrollY, [0, 800], [0, -30])

  const isUnlocked = (id: number) =>
    id === 1 || explored.has(id - 1)

  const complete = (id: number) => {
    setExplored(prev => new Set(prev).add(id))
    setOpenId(null)
  }

  const openPlanet = PLANETS.find(p => p.id === openId) ?? null
  const pathPoints = POSITIONS.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <div ref={containerRef} className="relative min-h-dvh">
      {/* Multi-layer parallax background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div style={{ y: bg1Y }} className="absolute inset-0">
          <div
            className="absolute -left-1/4 top-0 h-[60vh] w-[60vh] rounded-full opacity-30 blur-[120px]"
            style={{
              background: 'radial-gradient(circle, oklch(0.65 0.2 350 / 50%), transparent 70%)',
              animation: 'spin-slow 100s linear infinite',
            }}
          />
        </motion.div>
        <motion.div style={{ y: bg2Y }} className="absolute inset-0">
          <div
            className="absolute -right-1/4 top-1/3 h-[80vh] w-[80vh] rounded-full opacity-25 blur-[140px]"
            style={{
              background: 'radial-gradient(circle, oklch(0.55 0.18 300 / 45%), transparent 70%)',
              animation: 'spin-slow 130s linear infinite reverse',
            }}
          />
        </motion.div>
        <motion.div style={{ y: bg3Y }} className="absolute inset-0">
          <div
            className="absolute bottom-0 left-1/4 h-[70vh] w-[70vh] rounded-full opacity-20 blur-[130px]"
            style={{
              background: 'radial-gradient(circle, oklch(0.5 0.15 250 / 40%), transparent 70%)',
            }}
          />
        </motion.div>
      </div>

      <FloatingRings />
      <AmbientHearts />

      {/* Progress header with glass effect */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
        className="love-glass sticky top-0 z-20 mx-auto flex max-w-3xl items-center justify-between gap-4 rounded-b-3xl px-6 py-4 sm:px-10"
      >
        <div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="font-heading text-lg italic text-foreground"
          >
            Journey Progress
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-muted-foreground"
          >
            {explored.size} / {PLANETS.length} Planets Explored
          </motion.p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="relative flex h-14 w-14 items-center justify-center"
        >
          {/* Animated ring around percentage */}
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
            <circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              stroke="oklch(0.28 0.04 290)"
              strokeWidth="3"
            />
            <motion.circle
              cx="28"
              cy="28"
              r="26"
              fill="none"
              stroke="oklch(0.78 0.15 350)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: explored.size / PLANETS.length }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{
                boxShadow: '0 0 10px oklch(0.78 0.15 350)',
              }}
            />
          </svg>
          <motion.span
            key={explored.size}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="text-sm font-bold text-primary drop-shadow-[0_0_8px_var(--primary)]"
          >
            {Math.round((explored.size / PLANETS.length) * 100)}%
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Star map with enhanced paths */}
      <div className="relative mx-auto min-h-[230vh] w-full max-w-4xl px-4 pb-20">
        {/* Glowing connecting path with animation */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="pathgrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.78 0.15 350)" />
              <stop offset="50%" stopColor="oklch(0.72 0.14 300)" />
              <stop offset="100%" stopColor="oklch(0.78 0.15 350)" />
            </linearGradient>
            <filter id="pathglow">
              <feGaussianBlur stdDeviation="0.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Main path */}
          <motion.polyline
            points={pathPoints}
            fill="none"
            stroke="url(#pathgrad)"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeDasharray="2 2"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: 0.6, pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            filter="url(#pathglow)"
            vectorEffect="non-scaling-stroke"
          />

          {/* Glowing overlay path */}
          <motion.polyline
            points={pathPoints}
            fill="none"
            stroke="oklch(0.78 0.15 350 / 40%)"
            strokeWidth="0.3"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            vectorEffect="non-scaling-stroke"
            style={{
              filter: 'blur(0.5px)',
            }}
          />
        </svg>

        {/* Planets */}
        {PLANETS.map((planet, i) => {
          const pos = POSITIONS[i]
          const unlocked = isUnlocked(planet.id)
          const done = explored.has(planet.id)

          return (
            <motion.div
              key={planet.id}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.1 * i + 0.3,
                duration: 0.6,
                type: 'spring',
              }}
            >
              <motion.button
                type="button"
                disabled={!unlocked}
                onClick={() => setOpenId(planet.id)}
                whileHover={unlocked ? { scale: 1.15, y: -5 } : undefined}
                whileTap={unlocked ? { scale: 0.95 } : undefined}
                animate={
                  unlocked
                    ? { y: [0, -10, 0], rotate: [-2, 2, -2] }
                    : { opacity: 0.4 }
                }
                transition={{
                  duration: 5 + (i % 4),
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                aria-label={
                  unlocked
                    ? `Explore ${planet.name}`
                    : `${planet.name} (locked)`
                }
                className="group relative flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:focus-visible:ring-0"
              >
                {/* Planet glow ring */}
                {unlocked && (
                  <motion.span
                    className="absolute rounded-full"
                    style={{
                      width: 100,
                      height: 100,
                      background: `radial-gradient(circle, ${planet.glow}30 0%, transparent 70%)`,
                    }}
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2 + (i % 3) * 0.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                )}

                <PlanetSphere
                  planet={planet}
                  unlocked={unlocked}
                  done={done}
                  size={70}
                />

                {/* Hover sparkle trail */}
                {unlocked && (
                  <motion.span
                    className="pointer-events-none absolute"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {Array.from({ length: 6 }, (_, j) => (
                      <motion.span
                        key={j}
                        className="absolute h-1 w-1 rounded-full bg-primary"
                        style={{
                          boxShadow: '0 0 6px var(--primary)',
                        }}
                        initial={{ scale: 0 }}
                        whileHover={{
                          scale: [0, 1, 0],
                          x: Math.cos((j / 6) * Math.PI * 2) * 50,
                          y: Math.sin((j / 6) * Math.PI * 2) * 50,
                        }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }}
                      />
                    ))}
                  </motion.span>
                )}
              </motion.button>

              {/* Planet name label */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * i + 0.5 }}
                className={`mt-3 max-w-[10rem] text-center text-xs font-medium sm:text-sm ${
                  unlocked ? 'text-foreground' : 'text-muted-foreground/50'
                }`}
              >
                <span className="block text-base">{planet.emoji}</span>
                <span
                  className={`block ${unlocked ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]' : ''}`}
                >
                  {planet.name}
                </span>
              </motion.span>
            </motion.div>
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

      {finaleDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-8 left-1/2 z-30 -translate-x-1/2"
        >
          <div className="love-glass flex items-center gap-3 rounded-full px-6 py-3">
            <Sparkles className="h-5 w-5 text-secondary" />
            <span className="font-heading text-lg italic text-foreground">
              Journey Complete
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
