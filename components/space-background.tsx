'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  r: number
  base: number
  speed: number
  phase: number
}

interface Shooting {
  x: number
  y: number
  len: number
  speed: number
  angle: number
  life: number
  active: boolean
}

/**
 * Animated deep-space canvas: twinkling stars + shooting stars.
 * Nebula glows and floating particles are layered via CSS below.
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

    const count = Math.min(
      dense ? 320 : 180,
      Math.floor((width * height) / (dense ? 4500 : 8000)),
    )
    const stars: Star[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.4 + 0.3,
      base: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }))

    const shooting: Shooting[] = Array.from({ length: 3 }, () => ({
      x: 0,
      y: 0,
      len: 0,
      speed: 0,
      angle: 0,
      life: 0,
      active: false,
    }))

    const spawnShooting = (s: Shooting) => {
      s.x = Math.random() * width
      s.y = Math.random() * height * 0.5
      s.len = Math.random() * 120 + 80
      s.speed = Math.random() * 8 + 6
      s.angle = Math.PI / 4 + (Math.random() * 0.4 - 0.2)
      s.life = 1
      s.active = true
    }

    let t = 0
    const render = () => {
      ctx.clearRect(0, 0, width, height)
      t += 1

      for (const s of stars) {
        const tw = s.base + Math.sin(t * s.speed + s.phase) * 0.4
        ctx.globalAlpha = Math.max(0, Math.min(1, tw))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = '#fdf6ff'
        ctx.fill()
      }
      ctx.globalAlpha = 1

      for (const s of shooting) {
        if (!s.active) {
          if (Math.random() < 0.004) spawnShooting(s)
          continue
        }
        const dx = Math.cos(s.angle) * s.speed
        const dy = Math.sin(s.angle) * s.speed
        s.x += dx
        s.y += dy
        s.life -= 0.012
        if (s.life <= 0 || s.x > width || s.y > height) {
          s.active = false
          continue
        }
        const tailX = s.x - Math.cos(s.angle) * s.len
        const tailY = s.y - Math.sin(s.angle) * s.len
        const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY)
        grad.addColorStop(0, `rgba(255,220,240,${s.life})`)
        grad.addColorStop(1, 'rgba(255,220,240,0)')
        ctx.strokeStyle = grad
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(tailX, tailY)
        ctx.stroke()
      }

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
      {/* Nebula glows */}
      <div
        className="absolute -left-1/4 top-0 h-[60vh] w-[60vh] rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, oklch(0.6 0.2 350 / 60%), transparent 70%)',
          animation: 'spin-slow 90s linear infinite',
        }}
      />
      <div
        className="absolute -right-1/4 top-1/3 h-[70vh] w-[70vh] rounded-full opacity-35 blur-[130px]"
        style={{
          background:
            'radial-gradient(circle, oklch(0.55 0.2 300 / 55%), transparent 70%)',
          animation: 'spin-slow 120s linear infinite reverse',
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 h-[50vh] w-[50vh] rounded-full opacity-25 blur-[110px]"
        style={{
          background:
            'radial-gradient(circle, oklch(0.6 0.15 250 / 50%), transparent 70%)',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
