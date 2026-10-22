import Icon from '../components/Icon'
import OrgLogo from '../components/OrgLogo'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { employers, orgById, projects } from '../lib/content'
import { sortProjects } from '../lib/filters'
import { formatRange } from '../lib/format'

/** "SourceFuse Technologies India Pvt. Ltd." -> "SourceFuse"; "Tata Consultancy Services Limited (TCS)" -> "TCS" */
const short = (company: string) => company.includes('ISRO') ? 'ISRO' : company.match(/\(([A-Z]+)\)/)?.[1] ?? company.replace(/ (Technologies|India|Pvt\.|Ltd\.|Limited).*$/, '').replace(/ \(SAC\), ISRO$/, ' (ISRO)')

export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="theme-dark relative overflow-hidden border-t border-line bg-paper-alt py-24 sm:py-28">
      <div aria-hidden className="aurora left-[-14%] top-[8%] h-[30rem] w-[40rem] bg-[radial-gradient(closest-side,rgb(136_203_0/.10),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="experience" title="Engineering Experience"
          intro="Eight years of test automation and quality leadership across IT services, delivering for international banking, telecom and AI clients." />
        <Reveal className="-mt-6 mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-line bg-card/60 px-5 py-3 text-sm text-muted" aria-label="How to read this section">
          <span className="inline-flex items-center gap-2"><span className="tag-employer"><Icon name="briefcase" className="h-3 w-3" />Employer</span>the company I work for</span>
          <span className="inline-flex items-center gap-2"><span className="tag-client"><Icon name="globe" className="h-3 w-3" />Client</span>the company a project was delivered for</span>
        </Reveal>
        <ol className="space-y-8">
          {employers.map((e, i) => {
            const own = sortProjects(projects.filter((p) => p.employerId === e.id))
            const stack = [...new Set(own.flatMap((p) => p.technologies))]
            const kind = !e.end ? 'Current role' : e.id === 'isro' ? 'Internship' : 'Previous role'
            const year = (ym: string | null) => (ym ? ym.slice(0, 4) : 'now')
            return (
              <Reveal as="li" key={e.id} delay={i * 80} className="card spotlight relative overflow-hidden p-6 sm:p-10">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="tag-employer"><Icon name="briefcase" className="h-3 w-3" />Employer</span>
                    <span className="rounded-full border border-accent/40 bg-label-bg px-2.5 py-0.5 text-[0.64rem] font-semibold uppercase tracking-wide text-label">{kind}</span>
                  </p>
                  <p className="font-mono text-xs text-muted">career/{e.id} <span className="text-faint">›</span> {year(e.start)}–{year(e.end)}</p>
                </div>

                <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex min-w-0 flex-col items-start gap-4 sm:flex-row">
                    <OrgLogo id={e.orgId} size="lg" />
                    <div className="min-w-0">
                      <h3 className="text-2xl font-bold sm:text-[1.7rem]">{e.company}</h3>
                      <p className="mt-1 text-[1.02rem] text-muted">My role: <strong className="font-semibold text-accent-ink">{e.title}</strong></p>
                      <p className="text-sm text-muted">{e.summary}</p>
                    </div>
                  </div>
                  <div className="shrink-0 text-sm md:text-right">
                    <p className="inline-flex items-center gap-1.5 font-mono font-bold text-ink"><Icon name="briefcase" className="h-4 w-4 text-label" />{formatRange(e.start, e.end)}</p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-muted md:flex md:justify-end"><Icon name="map-pin" className="h-4 w-4" />{e.location}</p>
                  </div>
                </div>

                {e.clientIds.length > 0 && (
                  <div className="mt-6 rounded-2xl border border-sky-300/20 bg-sky-300/[0.04] p-4">
                    <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
                      <span className="tag-client"><Icon name="globe" className="h-3 w-3" />Clients</span>
                      served through {short(e.company)}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2" aria-label={`Clients served through ${e.company}`}>
                      {e.clientIds.map((id) => (
                        <li key={id} className="inline-flex items-center gap-2 rounded-xl border border-sky-300/25 bg-card py-1 pl-1 pr-3 text-sm text-ink">
                          <OrgLogo id={id} size="sm" />{orgById(id)?.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="mt-7 font-mono text-[0.72rem] font-bold uppercase tracking-wider text-label">My contributions at {short(e.company)}</p>
                <ul className="mt-3 grid gap-x-8 gap-y-2.5 lg:grid-cols-2">
                  {e.highlights.map((h) => (
                    <li key={h.text} className="flex gap-2.5 text-[0.95rem] text-ink-2">
                      <Icon name="circle-check" className="mt-1 h-4 w-4 shrink-0 text-accent-ink" />
                      <span>{h.label && <strong className="text-ink">{h.label}: </strong>}{h.text}</span>
                    </li>
                  ))}
                </ul>

                {own.length > 0 && (
                  <>
                    <p className="mt-8 font-mono text-[0.72rem] font-bold uppercase tracking-wider client-ink">Client projects at {short(e.company)}</p>
                    <ul className="tl mt-4 space-y-4">
                      {own.map((p) => (
                        <li key={p.id} className="relative pl-8">
                          <span className="tl-dot" aria-hidden />
                          <details className="group rounded-xl border border-line-soft bg-card-hover px-4 py-3 transition-colors open:bg-card hover:border-accent/30">
                            <summary className="flex cursor-pointer list-none flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                              <span className="flex w-full flex-wrap items-center gap-2 pb-1 text-sm">
                                <span className="tag-client"><Icon name="globe" className="h-3 w-3" />Client</span>
                                <OrgLogo id={p.clientId} size="sm" />
                                <strong className="font-semibold text-ink">{p.client}</strong>
                              </span>
                              <span className="font-display text-[1.02rem] font-bold">{p.name}</span>
                              <span className="inline-flex items-center gap-2 font-mono text-xs text-muted">
                                {formatRange(p.start, p.end, p.duration)}
                                <Icon name="chevron-down" className="h-4 w-4 transition-transform group-open:rotate-180" />
                              </span>
                              <span className="w-full text-sm text-ink-2">Role: <span className="font-semibold">{p.role}</span> · {p.metrics[0]}</span>
                            </summary>
                            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.93rem] text-ink-2">{p.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
                            <p className="mt-3 flex flex-wrap gap-1.5">{p.technologies.map((t) => <span key={t} className="chip !py-0.5">{t}</span>)}</p>
                          </details>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {stack.length > 0 && (
                  <div className="mt-8 border-t border-line-soft pt-5">
                    <p className="text-sm font-bold">Production stack & tooling</p>
                    <p className="mt-3 flex flex-wrap gap-1.5">{stack.map((t) => <span key={t} className="rounded-full border border-line bg-ink/[0.04] px-3 py-1 text-xs font-medium">{t}</span>)}</p>
                  </div>
                )}
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
