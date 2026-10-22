import { useEffect, useState } from 'react'
import Icon from './Icon'
import { asset, profile } from '../lib/content'
import { SECTIONS } from '../lib/nav'

const cv = profile.resumes[0]

/** Highlights the section currently on screen */
function useActiveSection() {
  const [active, setActive] = useState<string>(SECTIONS[0].id)
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActive(visible[0].target.id)
    }, { rootMargin: '-35% 0px -55% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return active
}

export function Monogram({ small = false }: { small?: boolean }) {
  const initials = profile.name.split(' ').map((w) => w[0]).join('').slice(0, 2)
  return (
    <span aria-hidden className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-accent font-bold text-black shadow-[0_0_24px_-4px_rgb(136_203_0/.8)] ${small ? 'h-9 w-9 text-sm' : 'h-11 w-11 text-base'}`}>
      {initials}
    </span>
  )
}

export default function Header() {
  const active = useActiveSection()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="theme-dark fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-6 sm:pt-4">
      <div className={`glass ${scrolled || open ? 'scrolled' : ''} ${open ? '!bg-paper' : ''} w-full max-w-6xl rounded-2xl border border-white/10 px-3.5 py-2.5 transition-all duration-300 sm:px-5`}>
        <div className="flex items-center justify-between gap-3">
          <a href="#overview" className="flex min-w-0 items-center gap-3 text-ink no-underline hover:text-ink" onClick={() => setOpen(false)}>
            <Monogram />
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-display text-[1.05rem] font-bold">{profile.name}</span>
              <span className="block truncate text-xs text-muted">{profile.title}</span>
            </span>
          </a>

          <nav aria-label="Sections" className="hidden items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.04] p-1 xl:flex">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}
                className={`rounded-full px-3 py-1.5 text-[0.8rem] no-underline transition-all duration-300 ${active === s.id ? 'bg-accent font-semibold text-black shadow-[0_0_20px_-6px_rgb(136_203_0/.9)]' : 'text-ink-2 hover:text-ink'}`}>
                {s.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a href={asset(cv.file)} download className="btn btn-lime !px-3 !py-2.5 text-sm sm:!px-4">
              <Icon name="download" /><span className="sr-only sm:not-sr-only">Get My CV</span>
            </a>
            <button type="button" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-ink xl:hidden">
              <Icon name={open ? 'x' : 'menu'} className="h-5 w-5" />
            </button>
          </div>
        </div>

        {open && (
          <nav id="mobile-nav" aria-label="Sections" className="mt-3 grid grid-cols-2 gap-1.5 border-t border-line pt-3 xl:hidden">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm no-underline ${active === s.id ? 'bg-accent font-semibold text-black' : 'text-ink-2 hover:bg-white/5 hover:text-ink'}`}>
                {s.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
