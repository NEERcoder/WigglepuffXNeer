'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  base: number
  speed: number
  phase: number
  color: string
}

interface Shooting {
  x: number
  y: number
  len: number
  speed: number
  angle: number
  life: number
  active: boolean
  color: string
}

interface Heart {
  x: number
  y: number
  size: number
  speed: number
  wobble: number
  phase: number
}

const STAR_COLORS = [
  '#ffecf8', // Pink-tinted white
  '#fdf6ff', // Warm white
  '#e8f0ff', // Cool blue-white
  '#ffe8f0', // Rose white
  '#fff5fb', // Pure
]

/**
 * Enhanced deep-space canvas with:
 * - Multi-color twinkling stars with depth
 * - Dramatic shooting stars with trails
 * - Floating heart particles
 * - Love-themed color palette
 */
export function SpaceBackground({ dense = false }: { dense?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let raf = 0

    // Stars with depth layers
    const layers = dense ? 4 : 2
    const baseCount = Math.min(dense ? 350 : 200, Math.floor((width * height) / (dense ? 4000 : 7000)))
    const count = baseCount * layers

    const stars: Star[] = Array.from({ length: count }, (_, i) => {
      const layer = i % layers
      const layerScale = 1 - (layer / layers) * 0.4
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: (Math.random() * 1.6 + 0.3) * layerScale,
        base: (Math.random() * 0.6 + 0.3) * layerScale,
        speed: (Math.random() * 0.025 + 0.008) * (1 / layerScale),
        phase: Math.random() * Math.PI * 2,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      }
    })

    const shooting: Shooting[] = Array.from({ length: 5 }, () => ({
      x: 0,
      y: 0,
      len: 0,
      speed: 0,
      angle: 0,
      life: 0,
      active: false,
      color: '#ffcce8',
    }))

    const hearts: Heart[] = Array.from({ length: dense ? 15 : 8 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 0.5 + 0.2,
      wobble: Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
    }))

    const spawnShooting = (s: Shooting) => {
      s.x = Math.random() * width * 0.8
      s.y = Math.random() * height * 0.4
      s.len = Math.random() * 150 + 100
      s.speed = Math.random() * 12 + 8
      s.angle = Math.PI / 4 + (Math.random() * 0.3 - 0.15)
      s.life = 1
      s.active = true
      s.color = Math.random() > 0.5 ? '#ffcce8' : '#e8ccff'
    }

    let t = 0
    const render = () => {
      ctx.clearRect(0, 0, width, height)
      t += 1

      // Draw stars with enhanced twinkle
      for (const s of stars) {
        const tw = s.base + Math.sin(t * s.speed + s.phase) * 0.5
        ctx.globalAlpha = Math.max(0, Math.min(1, tw))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * (1 + Math.sin(t * s.speed * 0.5) * 0.1), 0, Math.PI * 2)
        ctx.fillStyle = s.color
        ctx.fill()

        // Star glow
        if (s.r > 1 && tw > 0.7) {
          ctx.globalAlpha = Math.max(0, (tw - 0.7) * 0.5)
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2)
          ctx.fillStyle = s.color
          ctx.filter = 'blur(2px)'
          ctx.fill()
          ctx.filter = 'none'
        }
      }
      ctx.globalAlpha = 1

      // Draw shooting stars with dramatic trails
      for (const s of shooting) {
        if (!s.active) {
          if (Math.random() < 0.006) spawnShooting(s)
          continue
        }
        const dx = Math.cos(s.angle) * s.speed
        const dy = Math.sin(s.angle) * s.speed
        s.x += dx
        s.y += dy
        s.life -= 0.01

        if (s.life <= 0 || s.x > width || s.y > height) {
          s.active = false
          continue
        }

        const tailX = s.x - Math.cos(s.angle) * s.len
        const tailY = s.y - Math.sin(s.angle) * s.len

        // Multi-layer trail
        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255,204,232,${s.life})`)
        grad.addColorStop(0.3, `rgba(255,204,232,${s.life * 0.6})`)
        grad.addColorStop(1, 'rgba(255,204,232,0)')

        // Outer glow
        ctx.strokeStyle = s.color
        ctx.lineWidth = 4
        ctx.globalAlpha = s.life * 0.3
        ctx.filter = 'blur(4px)'
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(tailX, tailY)
        ctx.stroke()
        ctx.filter = 'none'

        // Core trail
        ctx.strokeStyle = grad
        ctx.lineWidth = 2
        ctx.globalAlpha = 1
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(tailX, tailY)
        ctx.stroke()

        // Bright head
        ctx.beginPath()
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = '#fff'
        ctx.globalAlpha = s.life
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // Draw floating hearts
      ctx.font = '12px serif'
      for (const h of hearts) {
        h.y -= h.speed
        h.x += Math.sin(t * 0.02 + h.phase) * h.wobble * 0.1
        ctx.globalAlpha = 0.15 + Math.sin(t * 0.01 + h.phase) * 0.1
        ctx.fillStyle = '#ffcce8'
        ctx.fillText('♥', h.x, h.y)
        if (h.y < -10) {
          h.y = height + 20
          h.x = Math.random() * width
        }
      }
      ctx.globalAlpha = 1

      raf = requestAnimationFrame(render)
    }
    render()

    const onResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [dense])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Multiple nebula layers with animation */}
      <div
        className="absolute -left-1/4 top-0 h-[70vh] w-[70vh] rounded-full opacity-40 blur-[120px]"
        style={{
          background: 'radial-gradient(circle, oklch(0.65 0.22 350 / 55%), transparent 70%)',
          animation: 'spin-slow 90s linear infinite',
        }}
      />

      <div
        className="absolute -right-1/4 top-1/3 h-[90vh] w-[90vh] rounded-full opacity-35 blur-[140px]"
        style={{
          background: 'radial-gradient(circle, oklch(0.55 0.2 300 / 50%), transparent 70%)',
          animation: 'spin-slow 120s linear infinite reverse',
        }}
      />

      <div
        className="absolute -left-1/8 top-2/3 h-[60vh] w-[60vh] rounded-full opacity-25 blur-[100px]"
        style={{
          background: 'radial-gradient(circle, oklch(0.6 0.18 250 / 45%), transparent 70%)',
          animation: 'spin-slow 150s linear infinite',
        }}
      />

      {/* Bottom rose glow */}
      <div
        className="absolute -bottom-1/4 left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full opacity-20 blur-[150px]"
        style={{
          background: 'radial-gradient(circle, oklch(0.7 0.15 350 / 40%), transparent 70%)',
        }}
      />

      {/* Aurora shimmer overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(45deg,
            oklch(0.7 0.2 350) 0%,
            oklch(0.6 0.18 300) 25%,
            oklch(0.5 0.12 250) 50%,
            oklch(0.6 0.18 300) 75%,
            oklch(0.7 0.2 350) 100%)`,
          backgroundSize: '400% 400%',
          animation: 'aurora-shimmer 20s ease-in-out infinite',
        }}
      />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
