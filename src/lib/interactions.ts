import { prefersReducedMotion } from './motion'

/**
 * Page-wide pointer effects, installed once:
 * - .spotlight elements get --mx/--my so a soft lime light follows the cursor
 * - .tilt elements lean slightly towards the cursor in 3D
 * - the scroll progress bar width follows the scroll position
 * Nothing runs for touch-only devices or when the visitor prefers reduced motion.
 */
export function installInteractions() {
  const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches
  const still = prefersReducedMotion()

  if (finePointer) {
    document.addEventListener('pointermove', (e) => {
      const target = (e.target as Element | null)?.closest?.('.spotlight, .tilt') as HTMLElement | null
      if (!target) return
      const r = target.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      target.style.setProperty('--mx', `${x}px`)
      target.style.setProperty('--my', `${y}px`)
      if (!still && target.classList.contains('tilt')) {
        const rx = ((y / r.height) - 0.5) * -5
        const ry = ((x / r.width) - 0.5) * 5
        target.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-4px)`
      }
    }, { passive: true })
    document.addEventListener('pointerout', (e) => {
      const target = (e.target as Element | null)?.closest?.('.tilt') as HTMLElement | null
      if (target && !target.contains(e.relatedTarget as Node)) target.style.transform = ''
    }, { passive: true })
  }

  const bar = document.querySelector<HTMLElement>('.scroll-progress')
  if (bar) {
    let ticking = false
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      bar.style.setProperty('--p', String(max > 0 ? Math.min(1, window.scrollY / max) : 0))
      ticking = false
    }
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }, { passive: true })
    update()
  }
}
