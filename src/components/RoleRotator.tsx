import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

/** Types out each phrase, pauses, deletes it and moves on. Screen readers get the full list once. */
export default function RoleRotator({ phrases }: { phrases: string[] }) {
  const [i, setI] = useState(0)
  const [text, setText] = useState(prefersReducedMotion() ? phrases[0] : '')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const full = phrases[i]
    let t: ReturnType<typeof setTimeout>
    if (!deleting && text === full) t = setTimeout(() => setDeleting(true), 1800)
    else if (deleting && text === '') { setDeleting(false); setI((n) => (n + 1) % phrases.length) }
    else t = setTimeout(() => setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1)), deleting ? 28 : 55)
    return () => clearTimeout(t)
  }, [text, deleting, i, phrases])

  return (
    <span className="inline-flex items-center">
      <span className="sr-only">{phrases.join(', ')}</span>
      <span aria-hidden className="text-accent-ink">{text}</span>
      <span aria-hidden className="caret ml-0.5 inline-block h-[1.05em] w-[3px] translate-y-[2px] rounded bg-accent" />
    </span>
  )
}
