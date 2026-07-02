'use client'

import { useEffect, useMemo, useRef } from 'react'
import type { PlanetEffect } from '@/lib/planets'

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

interface ParticleConfig {
  chars: string[]
  count: number
  anim: 'up' | 'fall' | 'bloom' | 'swirl' | 'burst' | 'rain' | 'embrace' | 'flash' | 'nebula' | 'cascade'
  size: [number, number]
  opacityRange: [number, number]
  layerCount?: number
  glow?: boolean
}

const CONFIG: Record<PlanetEffect, ParticleConfig> = {
  sparkles: {
    chars: ['✦', '✧', '⋆', '·', '✴'],
    count: 35,
    anim: 'up',
    size: [12, 28],
    opacityRange: [0.5, 1],
    layerCount: 2,
    glow: true,
  },
  petals: {
    chars: ['🌸', '🌷', '❀', '⚘', '🥀', '🌹'],
    count: 28,
    anim: 'fall',
    size: [18, 34],
    opacityRange: [0.7, 1],
    layerCount: 3,
    glow: false,
  },
  memories: {
    chars: ['✦', '✧', '·', '✴', '❦'],
    count: 40,
    anim: 'bloom',
    size: [10, 22],
    opacityRange: [0.4, 0.9],
    layerCount: 2,
    glow: true,
  },
  funny: {
    chars: ['⭐', '✨', '💫', '🌟', '💖', '🎉'],
    count: 32,
    anim: 'burst',
    size: [16, 32],
    opacityRange: [0.6, 1],
    layerCount: 2,
    glow: true,
  },
  hearts: {
    chars: ['❤', '💗', '♥', '💕', '💘', '💝'],
    count: 45,
    anim: 'bloom',
    size: [14, 36],
    opacityRange: [0.5, 1],
    layerCount: 3,
    glow: true,
  },
  rain: {
    chars: ['│', '❦', '·', '≋', '✧'],
    count: 50,
    anim: 'rain',
    size: [8, 24],
    opacityRange: [0.3, 0.8],
    layerCount: 2,
    glow: false,
  },
  rings: {
    chars: ['○', '◎', ' ◯', '⭘', '✦'],
    count: 30,
    anim: 'embrace',
    size: [14, 30],
    opacityRange: [0.5, 0.95],
    layerCount: 2,
    glow: true,
  },
  flash: {
    chars: ['✧', '▫', '·', '○', '◌'],
    count: 38,
    anim: 'flash',
    size: [10, 24],
    opacityRange: [0.4, 0.9],
    layerCount: 2,
    glow: true,
  },
  nebula: {
    chars: ['✦', '✧', '⋆', '·', '✴', '❋'],
    count: 50,
    anim: 'nebula',
    size: [8, 26],
    opacityRange: [0.3, 0.85],
    layerCount: 3,
    glow: true,
  },
  finale: {
    chars: ['❤', '💗', '🌹', '✦', '💖', '🌟', '💫'],
    count: 70,
    anim: 'cascade',
    size: [16, 40],
    opacityRange: [0.6, 1],
    layerCount: 4,
    glow: true,
  },
}

function getAnimation(config: ParticleConfig, delay: number, duration: number): string {
  const baseAnim = () => {
    switch (config.anim) {
      case 'up': return 'float-up'
      case 'fall': return 'petal-waltz'
      case 'bloom': return 'rose-ascent'
      case 'burst': return 'love-spark'
      case 'rain': return 'gentle-rain'
      case 'embrace': return 'ring-embrace'
      case 'flash': return 'photo-flash'
      case 'nebula': return 'nebula-swirl'
      case 'cascade': return 'rose-ascent'
      default: return 'float-up'
    }
  }
  return `${baseAnim()} ${duration}s ${config.anim === 'burst' ? 'ease-out' : 'linear'} ${delay}s infinite`
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

  // Generate layered particles for depth
  const layers = useMemo(() => {
    const result: Array<Array<{
      id: string
      left: number
      delay: number
      duration: number
      size: number
      char: string
      opacity: number
      zIndex: number
      blur?: number
    }>> = []

    const layersCount = cfg.layerCount ?? 1
    const perLayer = Math.ceil(cfg.count / layersCount)

    for (let layer = 0; layer < layersCount; layer++) {
      const layerParticles: typeof result[0] = []
      const isBackground = layer === 0
      const isForeground = layer === layersCount - 1

      for (let i = 0; i < perLayer; i++) {
        layerParticles.push({
          id: `${layer}-${i}`,
          left: rand(0, 100),
          delay: rand(0, 10) + layer * 2,
          duration: rand(8, 18) - layer * 1.5,
          size: rand(cfg.size[0], cfg.size[1]) * (isForeground ? 1.2 : isBackground ? 0.8 : 1),
          char: cfg.chars[Math.floor(Math.random() * cfg.chars.length)],
          opacity: rand(cfg.opacityRange[0], cfg.opacityRange[1]) * (isForeground ? 1 : isBackground ? 0.5 : 0.75),
          zIndex: layer,
          blur: isBackground ? 2 : undefined,
        })
      }
      result.push(layerParticles)
    }
    return result
  }, [cfg])

  // Spawn burst particles on mount for burst effects
  useEffect(() => {
    if (cfg.anim === 'burst' && containerRef.current) {
      const spawns = Array.from({ length: 12 }, (_, i) => {
        const el = document.createElement('span')
        el.className = 'absolute left-1/2 top-1/2'
        el.style.cssText = `
          font-size: ${rand(20, 40)}px;
          color: ${color};
          text-shadow: 0 0 12px ${color};
          --tx: ${(Math.random() - 0.5) * 400}px;
          --ty: ${(Math.random() - 0.5) * 400}px;
          animation: cascade-burst 1.5s ease-out forwards;
        `
        el.textContent = cfg.chars[Math.floor(Math.random() * cfg.chars.length)]
        containerRef.current?.appendChild(el)
        return el
      })
      return () => spawns.forEach(el => el.remove())
    }
  }, [cfg, color])

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      {layers.map((layer, layerIdx) => (
        <div
          key={layerIdx}
          className="absolute inset-0"
          style={{ zIndex: layerIdx, filter: layer[0]?.blur ? `blur(${layer[0].blur}px)` : undefined }}
        >
          {layer.map((p) => (
            <span
              key={p.id}
              className="absolute select-none will-change-transform"
              style={{
                left: `${p.left}%`,
                bottom: cfg.anim === 'fall' || cfg.anim === 'rain' || cfg.anim === 'flash' ? undefined : '-8%',
                top: cfg.anim === 'fall' || cfg.anim === 'rain' || cfg.anim === 'flash' ? '-8%' : undefined,
                fontSize: `${p.size}px`,
                color,
                opacity: p.opacity,
                textShadow: cfg.glow ? `0 0 ${p.size}px ${color}, 0 0 ${p.size * 2}px ${color}` : `0 0 8px ${color}`,
                animation: getAnimation(cfg, p.delay, p.duration),
                transform: cfg.anim === 'embrace' ? `translate(-50%, -50%)` : undefined,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            >
              {p.char}
            </span>
          ))}
        </div>
      ))}

      {/* Aurora glow layer for special effects */}
      {(effect === 'nebula' || effect === 'finale') && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${color}40 0%, transparent 70%)`,
            animation: 'aurora-shimmer 8s ease-in-out infinite',
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
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: rand(0, 100),
        delay: rand(0, 15),
        duration: rand(15, 28),
        size: rand(12, 28),
        opacity: rand(0.15, 0.45),
        emoji: Math.random() > 0.7 ? '💗' : '❤',
      })),
    [],
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Aurora background layer */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `linear-gradient(135deg,
            oklch(0.6 0.18 350 / 15%) 0%,
            oklch(0.5 0.15 300 / 10%) 50%,
            oklch(0.6 0.12 250 / 12%) 100%)`,
          animation: 'aurora-shimmer 25s ease-in-out infinite',
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
            textShadow: '0 0 20px oklch(0.78 0.15 350 / 60%)',
            animation: `rose-ascent ${h.duration}s linear ${h.delay}s infinite`,
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
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        left: rand(10, 90),
        top: rand(10, 90),
        size: rand(80, 200),
        delay: rand(0, 10),
        duration: rand(20, 40),
        opacity: rand(0.08, 0.18),
      })),
    [],
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {rings.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full border border-primary/30"
          style={{
            left: `${r.left}%`,
            top: `${r.top}%`,
            width: r.size,
            height: r.size,
            opacity: r.opacity,
            animation: `ring-embrace ${r.duration}s linear ${r.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
