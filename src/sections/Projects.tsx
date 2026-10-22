import { useState } from 'react'
import Icon from '../components/Icon'
import OrgLogo from '../components/OrgLogo'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { employerById, projects } from '../lib/content'
import { filterBySector, sectorTabs, sortProjects } from '../lib/filters'
import { formatRange } from '../lib/format'
import { withViewTransition } from '../lib/motion'
import type { Project } from '../types'

const ALL = sortProjects(projects)
const TABS = sectorTabs(ALL)

function ProjectCard({ p }: { p: Project }) {
  const [open, setOpen] = useState(false)
  const shown = open ? p.highlights : p.highlights.slice(0, 2)
  const more = p.highlights.length - 2
  const employer = employerById(p.employerId)
  return (
    <article className="card card-hover spotlight tilt flex h-full flex-col p-6 sm:p-7" style={{ viewTransitionName: `p-${p.id}` }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex min-w-0 items-center gap-2.5 text-sm">
          <OrgLogo id={p.clientId} size="sm" />
          <span className="min-w-0">
            <span className="block truncate font-bold text-ink">{p.client}</span>
            <span className="block truncate text-xs text-muted">via {employer?.company.replace(/ India Pvt\. Ltd\.| Limited \(TCS\)/, '')}</span>
          </span>
        </p>
        <span className="chip chip-lime !text-[0.66rem]">{p.sector}</span>
      </div>
      <h3 className="mt-5 text-xl font-bold leading-snug">{p.name}</h3>
      <p className="mt-1 text-sm font-semibold text-ink-2">{p.role} · <span className="font-normal text-muted">{formatRange(p.start, p.end, p.duration)}</span></p>
      <p className="mt-3 font-mono text-[0.78rem] font-bold text-accent-ink">{p.metrics.slice(0, 2).join(' | ')}</p>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">{p.summary}</p>
      <ul className="mt-3 space-y-2 text-[0.93rem] text-ink-2">
        {shown.map((h) => <li key={h} className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />{h}</li>)}
      </ul>
      {more > 0 && (
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
          className="mt-2 self-start font-mono text-xs font-bold text-label hover:text-accent-ink">
          {open ? '[− show less]' : `[+${more} more point${more > 1 ? 's' : ''}]`}
        </button>
      )}
      <p className="mt-auto flex flex-wrap gap-1.5 pt-5">{p.technologies.map((t) => <span key={t} className="chip !py-0.5">{t}</span>)}</p>
    </article>
  )
}

export default function Projects() {
  const [tab, setTab] = useState('All')
  const list = filterBySector(ALL, tab)
  return (
    <section id="projects" aria-labelledby="projects-heading" className="theme-dark relative overflow-hidden border-t border-line bg-paper py-24 sm:py-28">
      <div aria-hidden className="aurora right-[-12%] top-[-8%] h-[30rem] w-[40rem] bg-[radial-gradient(closest-side,rgb(136_203_0/.13),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="projects" title="Production Quality Systems"
          intro="Client systems where I designed the automation, ran the regression and signed off releases.">
          <div role="group" aria-label="Filter projects by sector"
            className="no-scrollbar flex max-w-full items-center gap-0.5 self-start overflow-x-auto rounded-full border border-line bg-white/[0.04] p-1 md:self-auto">
            {TABS.map((t) => (
              <button key={t} type="button" aria-pressed={tab === t} onClick={() => withViewTransition(() => setTab(t))}
                className={`min-h-[38px] shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs transition-all duration-300 ${tab === t ? 'bg-accent font-semibold text-black shadow-[0_0_20px_-6px_rgb(136_203_0/.9)]' : 'text-ink-2 hover:text-ink'}`}>
                {t}
              </button>
            ))}
          </div>
        </SectionHeading>
        <ul className="grid gap-6 md:grid-cols-2">
          {list.map((p, i) => <Reveal as="li" key={p.id} delay={(i % 2) * 90}><ProjectCard p={p} /></Reveal>)}
        </ul>
        <p className="mt-8 flex items-center gap-2 text-sm text-muted"><Icon name="shield-check" className="h-4 w-4 text-accent-ink" />Client details are kept general to respect confidentiality.</p>
      </div>
    </section>
  )
}
