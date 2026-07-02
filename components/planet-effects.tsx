'use client'

import { motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { PlanetEffect } from '@/lib/planets'

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

// === ENHANCED PARTICLE CONFIGURATIONS ===

interface ParticleLayer {
  id: string
  left: number
  top: number
  delay: number
  duration: number
  size: number
  char: string
  opacity: number
  zIndex: number
  blur?: number
  rotation?: number
  scale?: number
}

interface ParticleConfig {
  chars: string[]
  count: number
  secondaries?: string[]
  anim: string
  size: [number, number]
  opacityRange: [number, number]
  layerCount: number
  glow: boolean
  colors?: string[]
  trail?: boolean
  pulse?: boolean
  spin?: boolean
  wave?: boolean
  spawn?: boolean
}

const CONFIG: Record<PlanetEffect, ParticleConfig> = {
  sparkles: {
    chars: ['✦', '✧', '⋆', '·', '✴', '✶', '✷', '✸'],
    secondaries: ['✨', '💫', '⭐'],
    count: 60,
    anim: 'star-dance',
    size: [10, 36],
    opacityRange: [0.4, 1],
    layerCount: 4,
    glow: true,
    colors: ['#ffd700', '#ffb347', '#fff4e0', '#ffe4b5'],
    trail: true,
    pulse: true,
  },
  petals: {
    chars: ['🌸', '🌷', '❀', '⚘', '🥀', '🌹', '🌺', '🍀'],
    secondaries: ['💖', '💕', '💗'],
    count: 45,
    anim: 'petal-waltz',
    size: [16, 42],
    opacityRange: [0.5, 1],
    layerCount: 4,
    glow: false,
    colors: ['#ffb7c5', '#ffc0cb', '#ff69b4', '#ff1493'],
    spin: true,
  },
  memories: {
    chars: ['✦', '✧', '·', '✴', '❦', '✿', '❁', '✾'],
    secondaries: ['📷', '🎞️', '💫'],
    count: 55,
    anim: 'memory-drift',
    size: [8, 28],
    opacityRange: [0.3, 0.9],
    layerCount: 3,
    glow: true,
    colors: ['#87ceeb', '#add8e6', '#b0e0e6', '#e0ffff'],
    wave: true,
  },
  funny: {
    chars: ['⭐', '✨', '💫', '🌟', '💖', '🎉', '🎊', '🎈'],
    secondaries: ['🚀', '💫', '✨'],
    count: 50,
    anim: 'chaos-burst',
    size: [14, 40],
    opacityRange: [0.5, 1],
    layerCount: 3,
    glow: true,
    colors: ['#ff6b9d', '#c44569', '#f8b500', '#ff6348'],
    spawn: true,
    pulse: true,
  },
  hearts: {
    chars: ['❤', '💗', '♥', '💕', '💘', '💝', '💞', '💟'],
    secondaries: ['💖', '💗', '💓'],
    count: 70,
    anim: 'heart-pulse',
    size: [12, 48],
    opacityRange: [0.4, 1],
    layerCount: 5,
    glow: true,
    colors: ['#ff0844', '#ff4d6d', '#ff758f', '#ffb3c1'],
    pulse: true,
  },
  rain: {
    chars: ['│', '❦', '·', '≋', '✧', '💧', '〰', '∿'],
    secondaries: ['🌧️', '💧', '✨'],
    count: 65,
    anim: 'soulful-rain',
    size: [6, 28],
    opacityRange: [0.2, 0.75],
    layerCount: 4,
    glow: false,
    colors: ['#6b8cae', '#89a6c2', '#a8c0d8', '#c8daf0'],
    wave: true,
  },
  rings: {
    chars: ['○', '◎', '◯', '⭘', '✦', '◇', '◆', '❖'],
    secondaries: ['💍', '✨', '💫'],
    count: 40,
    anim: 'ring-embrace',
    size: [12, 36],
    opacityRange: [0.4, 0.95],
    layerCount: 3,
    glow: true,
    colors: ['#ffd700', '#ffb347', '#daa520', '#b8860b'],
    spin: true,
    pulse: true,
  },
  flash: {
    chars: ['✧', '▫', '·', '○', '◌', '✦', '◈', '❋'],
    secondaries: ['📸', '✨', '💫'],
    count: 50,
    anim: 'photo-reveal',
    size: [8, 30],
    opacityRange: [0.35, 0.9],
    layerCount: 3,
    glow: true,
    colors: ['#e6e6fa', '#d8bfd8', '#dda0dd', '#da70d6'],
    pulse: true,
  },
  nebula: {
    chars: ['✦', '✧', '⋆', '·', '✴', '❋', '✵', '✹'],
    secondaries: ['🌌', '✨', '💫'],
    count: 75,
    anim: 'nebula-cosmic',
    size: [6, 32],
    opacityRange: [0.25, 0.85],
    layerCount: 5,
    glow: true,
    colors: ['#9b59b6', '#8e44ad', '#663399', '#da70d6'],
    wave: true,
    spin: true,
  },
  finale: {
    chars: ['❤', '💗', '🌹', '✦', '💖', '🌟', '💫', '✨', '💕', '💝'],
    secondaries: ['🎊', '🎉', '⭐'],
    count: 100,
    anim: 'finale-explosion',
    size: [14, 50],
    opacityRange: [0.5, 1],
    layerCount: 5,
    glow: true,
    colors: ['#ff0844', '#ff6b9d', '#c44569', '#ffd700', '#ff758f'],
    spawn: true,
    pulse: true,
    spin: true,
  },
}

// Get animation string based on config
function getAnimation(config: ParticleConfig, delay: number, duration: number): string {
  const animations: Record<string, string> = {
    'star-dance': `star-dance ${duration}s ease-in-out ${delay}s infinite`,
    'petal-waltz': `petal-waltz ${duration}s linear ${delay}s infinite`,
    'memory-drift': `memory-drift ${duration}s ease-in-out ${delay}s infinite`,
    'chaos-burst': `chaos-burst ${duration}s ease-out ${delay}s infinite`,
    'heart-pulse': `heart-pulse ${duration}s ease-in-out ${delay}s infinite`,
    'soulful-rain': `soulful-rain ${duration}s linear ${delay}s infinite`,
    'ring-embrace': `ring-embrace ${duration}s linear ${delay}s infinite`,
    'photo-reveal': `photo-reveal ${duration}s ease-in ${delay}s infinite`,
    'nebula-cosmic': `nebula-cosmic ${duration}s ease-in-out ${delay}s infinite`,
    'finale-explosion': `finale-explosion ${duration}s ease-out ${delay}s infinite`,
  }
  return animations[config.anim] || `rose-ascent ${duration}s linear ${delay}s infinite`
}

export function PlanetEffects({
  effect,
  color = '#ffffff',
}: {
  effect: PlanetEffect
  color?: string
}) {
  const cfg = CONFIG[effect]
  const containerRef = useRef<HTMLDivElement>(null)
  const [spawns, setSpawns] = useState<Array<{ x: number; y: number; id: number; char: string }>>([])

  // Generate multi-layered particles for depth and dimensionality
  const layers = useMemo(() => {
    const result: ParticleLayer[][] = []
    const perLayer = Math.ceil(cfg.count / cfg.layerCount)

    for (let layer = 0; layer < cfg.layerCount; layer++) {
      const layerParticles: ParticleLayer[] = []
      const depthFactor = (layer + 1) / cfg.layerCount
      const isBackground = layer === 0
      const isForeground = layer === cfg.layerCount - 1

      for (let i = 0; i < perLayer; i++) {
        const opacityBase = rand(cfg.opacityRange[0], cfg.opacityRange[1])
        const sizeBase = rand(cfg.size[0], cfg.size[1])

        layerParticles.push({
          id: `${layer}-${i}`,
          left: rand(0, 100),
          top: effect === 'nebula' || effect === 'finale' ? rand(0, 100) : rand(-10, 10),
          delay: rand(0, 12) + layer * 1.5,
          duration: rand(10, 25) * (isForeground ? 0.7 : isBackground ? 1.3 : 1),
          size: sizeBase * (isForeground ? 1.3 : isBackground ? 0.7 : depthFactor),
          char: cfg.chars[Math.floor(Math.random() * cfg.chars.length)],
          opacity: opacityBase * (isForeground ? 1 : isBackground ? 0.4 : 0.65),
          zIndex: layer,
          blur: isBackground ? 3 : isForeground ? 0 : 1,
          rotation: rand(-180, 180),
          scale: rand(0.8, 1.2),
        })
      }
      result.push(layerParticles)
    }
    return result
  }, [cfg, effect])

  // Spawn burst particles dynamically for dramatic effects
  useEffect(() => {
    if (!cfg.spawn) return

    const spawnBurst = () => {
      if (!containerRef.current) return

      const count = effect === 'finale' ? 25 : 15
      const centerX = rand(30, 70)
      const centerY = rand(30, 70)

      const newSpawns = Array.from({ length: count }, (_, i) => ({
        id: Date.now() + i,
        x: centerX,
        y: centerY,
        char: cfg.secondaries?.[Math.floor(Math.random() * (cfg.secondaries?.length || 1))] || '✨',
      }))

      setSpawns(prev => [...prev.slice(-30), ...newSpawns])

      // Clean up spawns after animation
      setTimeout(() => {
        setSpawns(prev => prev.filter(s => !newSpawns.find(ns => ns.id === s.id)))
      }, 2000)
    }

    // Spawn every few seconds
    const interval = setInterval(spawnBurst, effect === 'finale' ? 1500 : 3000)

    // Initial spawn
    setTimeout(spawnBurst, 500)

    return () => clearInterval(interval)
  }, [cfg, effect])

  // Mouse follower sparkles for special planets
  const [mouseSparks, setMouseSparks] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    if (effect !== 'sparkles' && effect !== 'hearts') return

    const handleMove = (e: MouseEvent) => {
      if (Math.random() > 0.75) {
        const id = Date.now()
        setMouseSparks(prev => [...prev.slice(-8), { id, x: e.clientX, y: e.clientY }])

        setTimeout(() => {
          setMouseSparks(prev => prev.filter(s => s.id !== id))
        }, 1000)
      }
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [effect])

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Primary particle layers */}
      {layers.map((layer, layerIdx) => (
        <div
          key={layerIdx}
          className="absolute inset-0"
          style={{
            zIndex: layerIdx,
            filter: layer[0]?.blur ? `blur(${layer[0].blur}px)` : undefined,
          }}
        >
          {layer.map((p) => {
            const animColor = cfg.colors?.[layerIdx % (cfg.colors?.length || 1)] || color

            return (
              <span
                key={p.id}
                className="absolute select-none will-change-transform"
                style={{
                  left: `${p.left}%`,
                  top: `${p.top}%`,
                  fontSize: `${p.size}px`,
                  color: animColor,
                  opacity: p.opacity,
                  textShadow: cfg.glow
                    ? `0 0 ${p.size * 0.5}px ${animColor}, 0 0 ${p.size}px ${animColor}, 0 0 ${p.size * 1.5}px ${animColor}40`
                    : `0 0 ${p.size * 0.3}px ${animColor}`,
                  animation: getAnimation(cfg, p.delay, p.duration),
                  ['--initial-rotation' as string]: `${p.rotation}deg`,
                  ['--initial-scale' as string]: p.scale,
                }}
              >
                {p.char}
              </span>
            )
          })}
        </div>
      ))}

      {/* Dynamic spawn bursts */}
      {spawns.map((s) => (
        <motion.span
          key={s.id}
          initial={{ opacity: 1, scale: 0, x: `${s.x}%`, y: `${s.y}%` }}
          animate={{
            opacity: 0,
            scale: [0, 2, 1],
            x: `${s.x + (Math.random() - 0.5) * 60}%`,
            y: `${s.y + (Math.random() - 0.5) * 60}%`,
          }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute text-3xl"
          style={{
            color: color,
            textShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
          }}
        >
          {s.char}
        </motion.span>
      ))}

      {/* Mouse-following sparkles */}
      {mouseSparks.map((s) => (
        <motion.span
          key={s.id}
          initial={{ opacity: 1, scale: 1, x: s.x, y: s.y }}
          animate={{
            opacity: 0,
            scale: 0.3,
            y: s.y - 50,
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="fixed pointer-events-none text-lg z-[60]"
          style={{
            color: color,
            textShadow: `0 0 15px ${color}`,
          }}
        >
          {effect === 'hearts' ? '💖' : '✨'}
        </motion.span>
      ))}

      {/* === SPECIAL EFFECT LAYERS === */}

      {/* Aurora shimmer for nebula/finale */}
      {(effect === 'nebula' || effect === 'finale') && (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${color}30 0%, transparent 60%)`,
            animation: 'aurora-shimmer 12s ease-in-out infinite',
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* Rain ripple effect */}
      {effect === 'rain' && (
        <>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-white/10"
              style={{
                left: `${rand(20, 80)}%`,
                top: `${rand(20, 80)}%`,
              }}
              animate={{
                width: [0, 200],
                height: [0, 200],
                opacity: [0.3, 0],
                x: -100,
                y: -100,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.8,
                ease: 'easeOut',
              }}
            />
          ))}
        </>
      )}

      {/* Ring pulse effect */}
      {effect === 'rings' && (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
              style={{
                borderColor: color,
                width: 100,
                height: 100,
              }}
              animate={{
                scale: [1, 2.5],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: 'easeOut',
              }}
            />
          ))}
        </>
      )}

      {/* Photo flash effect */}
      {effect === 'flash' && (
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0, 0.15, 0],
          }}
          transition={{
            duration: 0.15,
            repeat: Infinity,
            repeatDelay: 5,
          }}
          style={{
            background: `radial-gradient(circle at ${rand(30, 70)}% ${rand(30, 70)}%, white 0%, transparent 50%)`,
          }}
        />
      )}

      {/* Heart beat pulse for hearts effect */}
      {effect === 'hearts' && (
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] opacity-10"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.05, 0.12, 0.05],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ color }}
        >
          ❤
        </motion.div>
      )}

      {/* Glowing trail for sparkles */}
      {effect === 'sparkles' && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at center, ${color}20 0%, transparent 50%)`,
            animation: 'cosmic-pulse 4s ease-in-out infinite',
          }}
        />
      )}
    </div>
  )
}

/** Enhanced ambient hearts with soulful floating */
export function AmbientHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: rand(0, 100),
        delay: rand(0, 20),
        duration: rand(18, 35),
        size: rand(10, 32),
        opacity: rand(0.1, 0.35),
        emoji: ['❤', '💗', '💕', '💖'][Math.floor(Math.random() * 4)],
        spin: rand(-1, 1) > 0,
      })),
    [],
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Aurora background layer */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          background: `linear-gradient(135deg,
            oklch(0.6 0.18 350 / 15%) 0%,
            oklch(0.5 0.15 300 / 10%) 33%,
            oklch(0.4 0.12 250 / 8%) 66%,
            oklch(0.5 0.15 300 / 12%) 100%)`,
          animation: 'aurora-shimmer 30s ease-in-out infinite',
          backgroundSize: '400% 400%',
        }}
      />
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute select-none"
          style={{
            left: `${h.left}%`,
            bottom: '-10%',
            fontSize: `${h.size}px`,
            opacity: h.opacity,
            color: 'oklch(0.78 0.15 350)',
            textShadow: '0 0 25px oklch(0.78 0.15 350 / 50%)',
            animation: h.spin
              ? `rose-ascent ${h.duration}s linear ${h.delay}s infinite`
              : `soulful-float ${h.duration}s ease-in-out ${h.delay}s infinite`,
          }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  )
}

/** Floating ring decorations for universe screen */
export function FloatingRings() {
  const rings = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: rand(5, 95),
        top: rand(5, 95),
        size: rand(60, 180),
        delay: rand(0, 15),
        duration: rand(25, 50),
        opacity: rand(0.06, 0.15),
      })),
    [],
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {rings.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full"
          style={{
            left: `${r.left}%`,
            top: `${r.top}%`,
            width: r.size,
            height: r.size,
            opacity: r.opacity,
            border: '1px solid oklch(0.78 0.15 350 / 40%)',
            animation: `ring-embrace ${r.duration}s linear ${r.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

/** Cosmic dust particles for nebula effect */
export function CosmicDust() {
  const particles = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: rand(0, 100),
        top: rand(0, 100),
        size: rand(1, 3),
        delay: rand(0, 30),
        duration: rand(10, 40),
        opacity: rand(0.2, 0.6),
      })),
    [],
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `twinkle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
