import { flushSync } from 'react-dom'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Runs a state update inside a View Transition when the browser supports it, so the DOM change animates */
export function withViewTransition(update: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
  if (!doc.startViewTransition || prefersReducedMotion()) { update(); return }
  doc.startViewTransition(() => flushSync(update))
}
