'use client'

import { Lock } from 'lucide-react'
import type { Planet } from '@/lib/planets'

/**
 * Per-planet cosmetic features so each world in the map feels distinct:
 * rings, moons, atmosphere tint, rotation speed & direction.
 */
interface Features {
  ring?: { tilt: number; color: string; speed: number }
  moons?: { size: number; radius: number; speed: number; ccw?: boolean }[]
  spinDuration: number
  ccw?: boolean
  bandAngle: number
}

const FEATURES: Record<number, Features> = {
  1: { spinDuration: 26, bandAngle: 60 },
  2: { spinDuration: 30, bandAngle: 30, moons: [{ size: 6, radius: 46, speed: 14 }] },
  3: {
    spinDuration: 22,
    bandAngle: 75,
    moons: [{ size: 7, radius: 50, speed: 16 }],
  },
  4: { spinDuration: 18, bandAngle: 45, ccw: true },
  5: {
    spinDuration: 24,
    bandAngle: 50,
    moons: [{ size: 5, radius: 44, speed: 12, ccw: true }],
  },
  6: {
    spinDuration: 34,
    bandAngle: 20,
    moons: [{ size: 8, radius: 52, speed: 20 }],
  },
  7: {
    spinDuration: 28,
    bandAngle: 55,
    ring: { tilt: 72, color: '#ffe6a8', speed: 30 },
  },
  8: { spinDuration: 20, bandAngle: 65, ccw: true },
  9: {
    spinDuration: 16,
    bandAngle: 40,
    ring: { tilt: 68, color: '#e9c7ff', speed: 26 },
    moons: [{ size: 5, radius: 48, speed: 11 }],
  },
  10: { spinDuration: 20, bandAngle: 50 },
}

export function PlanetSphere({
  planet,
  unlocked,
  done,
  size = 80,
}: {
  planet: Planet
  unlocked: boolean
  done: boolean
  size?: number
}) {
  const f = FEATURES[planet.id] ?? { spinDuration: 24, bandAngle: 50 }
  const [dark, light] = planet.colors
  const orbitBox = size * 1.9

  return (
    <span
      className="relative grid place-items-center"
      style={{ width: orbitBox, height: orbitBox }}
    >
      {/* Outer atmospheric halo */}
      <span
        aria-hidden
        className="motion-safe-only absolute rounded-full"
        style={{
          width: size * 1.5,
          height: size * 1.5,
          background: `radial-gradient(circle, ${planet.glow}55 0%, ${planet.glow}22 40%, transparent 70%)`,
          animation: unlocked ? 'halo-pulse 5s ease-in-out infinite' : 'none',
          opacity: unlocked ? undefined : 0.25,
        }}
      />

      {/* Orbiting sparkle satellites + moons */}
      {unlocked &&
        f.moons?.map((m, i) => (
          <span
            key={i}
            aria-hidden
            className="motion-safe-only absolute rounded-full"
            style={{
              width: m.radius * 2,
              height: m.radius * 2,
              animation: `${m.ccw ? 'orbit-ccw' : 'orbit-cw'} ${m.speed}s linear infinite`,
            }}
          >
            <span
              className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full"
              style={{
                width: m.size,
                height: m.size,
                background: 'radial-gradient(circle at 35% 30%, #fff, #cbd5ff)',
                boxShadow: `0 0 8px ${planet.glow}`,
              }}
            />
          </span>
        ))}

      {/* Ring system (behind the sphere) */}
      {f.ring && (
        <span
          aria-hidden
          className="absolute"
          style={{
            width: size * 1.7,
            height: size * 1.7,
            transform: `rotateX(${f.ring.tilt}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <span
            className="motion-safe-only absolute inset-0 rounded-full"
            style={{
              border: `${Math.max(2, size * 0.04)}px solid ${f.ring.color}`,
              opacity: unlocked ? 0.7 : 0.2,
              boxShadow: `0 0 12px ${f.ring.color}88, inset 0 0 10px ${f.ring.color}66`,
              maskImage:
                'linear-gradient(90deg, transparent 4%, #000 20%, #000 80%, transparent 96%)',
              WebkitMaskImage:
                'linear-gradient(90deg, transparent 4%, #000 20%, #000 80%, transparent 96%)',
              animation: unlocked
                ? `orbit-cw ${f.ring.speed}s linear infinite`
                : 'none',
            }}
          />
        </span>
      )}

      {/* The planet body */}
      <span
        className="motion-safe-only relative overflow-hidden rounded-full"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 32% 26%, ${light}, ${dark} 72%)`,
          boxShadow: unlocked
            ? `0 0 34px -2px ${planet.glow}, inset -${size * 0.16}px -${size * 0.16}px ${size * 0.28}px rgba(0,0,0,0.55), inset ${size * 0.08}px ${size * 0.06}px ${size * 0.2}px ${light}66`
            : `inset -${size * 0.16}px -${size * 0.16}px ${size * 0.28}px rgba(0,0,0,0.65)`,
          filter: unlocked ? 'none' : 'grayscale(0.75) brightness(0.7)',
          animation: unlocked
            ? 'core-breathe 6s ease-in-out infinite'
            : 'none',
        }}
      >
        {/* Scrolling surface bands (cloud/gas texture) */}
        <span
          aria-hidden
          className="motion-safe-only absolute inset-0 rounded-full mix-blend-soft-light"
          style={{
            backgroundImage: `repeating-linear-gradient(${f.bandAngle}deg, transparent 0, transparent ${size * 0.06}px, ${light}55 ${size * 0.09}px, transparent ${size * 0.14}px)`,
            backgroundSize: '200% 100%',
            animation: unlocked
              ? `surface-scroll ${f.spinDuration}s linear infinite ${f.ccw ? 'reverse' : ''}`
              : 'none',
            opacity: 0.6,
          }}
        />
        {/* Second finer band layer */}
        <span
          aria-hidden
          className="motion-safe-only absolute inset-0 rounded-full mix-blend-overlay"
          style={{
            backgroundImage: `repeating-linear-gradient(${f.bandAngle + 12}deg, transparent 0, transparent ${size * 0.03}px, rgba(255,255,255,0.14) ${size * 0.05}px, transparent ${size * 0.08}px)`,
            backgroundSize: '200% 100%',
            animation: unlocked
              ? `surface-scroll ${f.spinDuration * 1.6}s linear infinite ${f.ccw ? '' : 'reverse'}`
              : 'none',
            opacity: 0.5,
          }}
        />
        {/* Specular highlight */}
        <span
          aria-hidden
          className="absolute rounded-full"
          style={{
            width: size * 0.34,
            height: size * 0.34,
            top: size * 0.14,
            left: size * 0.18,
            background:
              'radial-gradient(circle, rgba(255,255,255,0.85), transparent 70%)',
            filter: 'blur(2px)',
            opacity: unlocked ? 0.8 : 0.3,
          }}
        />
        {/* Terminator (day/night shading) */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 78% 82%, rgba(0,0,0,0.55), transparent 55%)',
          }}
        />

        {!unlocked && (
          <span className="absolute inset-0 flex items-center justify-center text-foreground/70">
            <Lock className="h-5 w-5" aria-hidden />
          </span>
        )}
      </span>

      {/* Completed badge */}
      {done && (
        <span
          className="absolute z-10 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-secondary-foreground shadow-lg"
          style={{
            top: `calc(50% - ${size * 0.62}px)`,
            left: `calc(50% + ${size * 0.34}px)`,
            boxShadow: `0 0 10px ${planet.glow}`,
          }}
        >
          ✓
        </span>
      )}
    </span>
  )
}
