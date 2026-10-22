import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/motion'

/**
 * Animated network of glowing nodes for the hero: nodes drift, link up when close,
 * and lean towards the cursor. Drawn at the screen's pixel density so it stays sharp,
 * paused when off screen, and drawn once (still) when the visitor prefers reduced motion.
 */
export default function ParticleField({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const still = prefersReducedMotion()
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true
    const mouse = { x: -9999, y: -9999 }
    type P = { x: number; y: number; vx: number; vy: number; r: number; hue: number }
    let pts: P[] = []

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width; h = rect.height
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(90, Math.max(36, (w * h) / 16000)))
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.6 + 0.6, hue: Math.random(),
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const link = Math.min(150, w / 7)
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]
        if (!still) {
          // gentle pull towards the cursor
          const dx = mouse.x - a.x, dy = mouse.y - a.y, d2 = dx * dx + dy * dy
          if (d2 < 220 * 220) { a.vx += dx * 0.000012; a.vy += dy * 0.000012 }
          a.x += a.vx; a.y += a.vy
          a.vx *= 0.999; a.vy *= 0.999
          if (a.x < -20) a.x = w + 20; if (a.x > w + 20) a.x = -20
          if (a.y < -20) a.y = h + 20; if (a.y > h + 20) a.y = -20
        }
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]
          const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy)
          if (d < link) {
            ctx.strokeStyle = `rgba(136, 203, 0, ${0.22 * (1 - d / link)})`
            ctx.lineWidth = 0.8
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        }
      }
      for (const p of pts) {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5)
        const c = p.hue > 0.7 ? '200, 235, 127' : '136, 203, 0'
        g.addColorStop(0, `rgba(${c}, 0.95)`); g.addColorStop(0.3, `rgba(${c}, 0.35)`); g.addColorStop(1, `rgba(${c}, 0)`)
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2); ctx.fill()
      }
    }

    const loop = () => { if (visible) draw(); raf = requestAnimationFrame(loop) }
    resize()
    if (still) draw(); else raf = requestAnimationFrame(loop)

    const onResize = () => { resize(); if (still) draw() }
    const onMove = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top }
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove, { passive: true })
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(([e]) => { visible = e.isIntersecting }) : null
    io?.observe(canvas)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); window.removeEventListener('pointermove', onMove); io?.disconnect() }
  }, [])

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />
}
