import type { ReactNode } from 'react'
import Reveal from './Reveal'
import { SECTIONS } from '../lib/nav'

/** Section title with a small lime label above it, in the SourceFuse style */
export default function SectionHeading({ id, title, intro, children }: { id: string; title: string; intro?: string; dark?: boolean; children?: ReactNode }) {
  const label = SECTIONS.find((s) => s.id === id)?.label
  return (
    <Reveal className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {label && <p className="kicker">{label}</p>}
        <h2 id={`${id}-heading`} className="mt-3 text-3xl font-semibold text-ink sm:text-[2.6rem]">{title}</h2>
        {intro && <p className="mt-4 text-lg text-muted">{intro}</p>}
      </div>
      {children}
    </Reveal>
  )
}
