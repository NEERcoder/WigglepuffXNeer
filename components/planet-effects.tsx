'use client'

import { useMemo } from 'react'
import type { PlanetEffect } from '@/lib/planets'

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

const CONFIG: Record<
  PlanetEffect,
  { chars: string[]; count: number; anim: 'up' | 'fall'; size: [number, number] }
> = {
  sparkles: { chars: ['✦', '✧', '⋆'], count: 22, anim: 'up', size: [10, 22] },
  petals: { chars: ['🌸', '🌷', '❀'], count: 20, anim: 'fall', size: [16, 30] },
  memories: { chars: ['✦', '✧', '·'], count: 24, anim: 'up', size: [8, 18] },
  funny: { chars: ['⭐', '✨', '💫'], count: 18, anim: 'up', size: [14, 26] },
  hearts: { chars: ['❤', '💗', '♥'], count: 22, anim: 'up', size: [12, 26] },
  rain: { chars: ['│', '❦', '·'], count: 26, anim: 'fall', size: [10, 20] },
  rings: { chars: ['✦', '◦', '⋆'], count: 20, anim: 'up', size: [10, 22] },
  flash: { chars: ['✧', '▫', '·'], count: 18, anim: 'up', size: [8, 18] },
  nebula: { chars: ['✦', '✧', '⋆', '·'], count: 28, anim: 'up', size: [8, 20] },
  finale: { chars: ['❤', '💗', '🌹', '✦'], count: 34, anim: 'up', size: [14, 30] },
}

export function PlanetEffects({
  effect,
  color = '#ffffff',
}: {
  effect: PlanetEffect
  color?: string
}) {
  const cfg = CONFIG[effect]
  const particles = useMemo(
    () =>
      Array.from({ length: cfg.count }, (_, i) => ({
        id: i,
        left: rand(0, 100),
        delay: rand(0, 8),
        duration: rand(6, 14),
        size: rand(cfg.size[0], cfg.size[1]),
        char: cfg.chars[Math.floor(Math.random() * cfg.chars.length)],
      })),
    [cfg],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute select-none will-change-transform"
          style={{
            left: `${p.left}%`,
            bottom: cfg.anim === 'up' ? '-5%' : undefined,
            top: cfg.anim === 'fall' ? '-5%' : undefined,
            fontSize: `${p.size}px`,
            color,
            textShadow: `0 0 8px ${color}`,
            animation: `${
              cfg.anim === 'up' ? 'float-up' : 'petal-fall'
            } ${p.duration}s linear ${p.delay}s infinite`,
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  )
}

/** Subtle ambient hearts used across the universe screen */
export function AmbientHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: rand(0, 100),
        delay: rand(0, 12),
        duration: rand(12, 22),
        size: rand(10, 22),
        opacity: rand(0.15, 0.4),
      })),
    [],
  )
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute select-none text-primary"
          style={{
            left: `${h.left}%`,
            bottom: '-5%',
            fontSize: `${h.size}px`,
            opacity: h.opacity,
            animation: `float-up ${h.duration}s linear ${h.delay}s infinite`,
          }}
        >
          ❤
        </span>
      ))}
    </div>
  )
}
