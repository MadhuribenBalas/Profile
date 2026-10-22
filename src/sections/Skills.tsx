import Icon from '../components/Icon'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { asset, profile, techById } from '../lib/content'

const GROUP_ICONS: Record<string, string> = {
  'Languages': 'code', 'Test automation': 'layers', 'API & performance': 'gauge', 'AI & GenAI testing': 'sparkles',
  'CI/CD & devices': 'workflow', 'Test management & IDE': 'clipboard-list', 'Cloud & platforms': 'cloud',
}

/** Levels written in the CV, e.g. "C# (Expert)". Only shown where the CV states one. */
const LEVELS: Record<string, string> = Object.fromEntries(
  profile.skills.flatMap((s) => [...s.items.matchAll(/([A-Za-z#+ ]+?) \((Expert|Advanced|Proficient)\)/g)].map((m) => [m[1].trim(), m[2]])),
)

function ToolRow({ id }: { id: string }) {
  const t = techById(id)
  if (!t) return null
  const level = LEVELS[t.name]
  return (
    <li className="flex items-center justify-between gap-3 py-2">
      <span className="flex min-w-0 items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-white p-1.5">
          {t.logo
            ? <img src={asset(`tech/${t.logo}`)} alt={`${t.name} logo`} className="h-full w-full object-contain" width={20} height={20} loading="lazy" />
            : <span role="img" aria-label={`${t.name} logo`} className="font-mono text-[0.58rem] font-bold text-label">{t.initials}</span>}
        </span>
        <span className="truncate text-[0.93rem] font-medium text-ink">{t.name}</span>
      </span>
      {level && <span className={`chip !py-0.5 !text-[0.66rem] ${level === 'Expert' ? 'chip-lime' : ''}`}>{level}</span>}
    </li>
  )
}

export default function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="theme-dark relative overflow-hidden border-t border-line bg-paper-alt py-24 sm:py-28">
      <div aria-hidden className="aurora right-[-12%] top-[30%] h-[30rem] w-[40rem] bg-[radial-gradient(closest-side,rgb(136_203_0/.10),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="skills" title="Technical Competencies"
          intro="The tools I use to build, run and report on automation, from test design to CI and the cloud." />
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {profile.toolGroups.map((g, i) => (
            <Reveal as="li" key={g.label} delay={(i % 3) * 80} className="card card-hover spotlight tilt flex flex-col p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-card-hover text-accent-ink shadow-sm">
                  <Icon name={GROUP_ICONS[g.label] ?? 'code'} className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold">{g.label}</h3>
                  <p className="font-mono text-[0.7rem] text-muted">{g.tools.length} tools</p>
                </div>
              </div>
              <ul className="mt-4 divide-y divide-line-soft">{g.tools.map((id) => <ToolRow key={id} id={id} />)}</ul>
            </Reveal>
          ))}
          <Reveal as="li" delay={80} className="card flex flex-col p-6 sm:p-7 md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-card-hover text-accent-ink shadow-sm"><Icon name="target" className="h-5 w-5" /></span>
              <div>
                <h3 className="text-lg font-bold">Core competencies</h3>
                <p className="font-mono text-[0.7rem] text-muted">{profile.competencies.length} areas</p>
              </div>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {profile.competencies.map((c) => (
                <li key={c.name} className="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-label-bg px-3 py-1.5 text-[0.84rem] font-medium text-ink">
                  <Icon name={c.icon} className="h-3.5 w-3.5 text-label" />{c.name}
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-line-soft pt-5">
              <p className="flex items-center gap-2 text-sm font-bold"><Icon name="languages" className="h-4 w-4 text-accent-ink" />Spoken languages</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {profile.languages.map((l) => <li key={l.language} className="chip"><strong className="text-ink">{l.language}</strong> {l.level}</li>)}
              </ul>
            </div>
          </Reveal>
        </ul>
      </div>
    </section>
  )
}
