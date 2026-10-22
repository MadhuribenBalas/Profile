import Icon from '../components/Icon'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { asset, certifications, certificationsInProgress, profile } from '../lib/content'
import { formatMonth } from '../lib/format'

export default function Certifications() {
  const [degree, ...school] = profile.education
  return (
    <section id="certifications" aria-labelledby="certifications-heading" className="theme-dark relative overflow-hidden border-t border-line bg-paper py-24 sm:py-28">
      <div aria-hidden className="aurora left-[-12%] top-[20%] h-[30rem] w-[40rem] bg-[radial-gradient(closest-side,rgb(136_203_0/.13),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="certifications" title="Certifications & Education"
          intro="Backed by ISTQB® standards and cloud and AI credentials. Each verified credential links to the issuer's own proof page." />

        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((c, i) => (
            <Reveal as="li" key={c.id} delay={(i % 3) * 80} className="group card card-hover spotlight tilt flex flex-col p-6 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-card-hover text-label shadow-sm"><Icon name="award" className="h-5 w-5" /></span>
                  {c.code && <span className="rounded-lg border border-line bg-card-hover px-2.5 py-1 font-mono text-xs font-bold text-ink">{c.code}</span>}
                </div>
                {c.badge && (/^istqb-|\.svg$/.test(c.badge)
                  ? <img src={asset(`badges/${c.badge}`)} alt="" className="h-20 w-auto max-w-[8rem] rounded-lg bg-white object-contain p-1 shadow-[0_10px_30px_-12px_rgb(0_0_0/.8)]" width={87} height={80} loading="lazy" />
                  : <img src={asset(`badges/${c.badge}`)} alt="" className="h-24 w-auto drop-shadow-[0_12px_24px_rgb(136_203_0/.25)] transition-transform duration-500 group-hover:scale-105" width={96} height={96} loading="lazy" />)}
              </div>
              <h3 className="mt-5 text-[1.08rem] font-bold leading-snug">{c.name}</h3>
              <p className="mt-1 text-sm font-semibold text-label">{c.issuer}</p>
              {c.about && <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-2">{c.about}</p>}
              {c.details && <p className="mt-2 text-xs text-muted">{c.details}</p>}
              <div className="mt-auto pt-5"><div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-4">
                <p className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="text-muted">{c.issued ? formatMonth(c.issued) : ''}</span>
                  {c.score && <span className="chip chip-solid !py-0.5">{c.score}</span>}
                  {c.credentialId && <span className="hidden text-muted sm:inline">#{c.credentialId}</span>}
                </p>
                <span className="flex flex-wrap gap-3">
                  {c.links?.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold">{l.label}</a>)}
                  {c.verifyUrl && (
                    <a href={c.verifyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-bold no-underline">
                      Inspect proof<Icon name="external-link" className="h-3.5 w-3.5" /><span className="sr-only"> for {c.name} (opens in a new tab)</span>
                    </a>
                  )}
                </span>
              </div></div>
            </Reveal>
          ))}
          {certificationsInProgress.map((c) => (
            <Reveal as="li" key={c.id} className="flex flex-col rounded-2xl border-2 border-dashed border-line bg-paper p-6 sm:p-7">
              <span className="self-start rounded-full border border-line bg-white/5 px-2.5 py-1 font-mono text-xs font-bold text-ink">{c.code}</span>
              <h3 className="mt-4 text-[1.02rem] font-bold leading-snug">{c.name}</h3>
              {c.about && <p className="mt-2 text-sm text-ink-2">{c.about}</p>}
              <p className="mt-auto pt-4 font-mono text-xs font-bold text-label">In progress · expected {c.expected}</p>
            </Reveal>
          ))}
        </ul>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <Reveal className="card p-6 sm:p-8">
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-label">Higher education <span className="text-faint">•</span> {degree.dates}</p>
            <div className="mt-4 flex items-start gap-4">
              {degree.logo && <img src={asset(`logos/${degree.logo}`)} alt={degree.logoAlt ?? ''} className="h-16 w-16 shrink-0 rounded-xl border border-line bg-white object-contain p-1.5" width={64} height={64} loading="lazy" />}
              <div>
                <h3 className="text-xl font-bold">{degree.qualification}</h3>
                <p className="mt-1 font-semibold text-accent-ink">{degree.institution}</p>
                <p className="text-sm text-muted">{degree.details}</p>
              </div>
            </div>
            <ul className="mt-6 space-y-3 border-t border-line-soft pt-5">
              {school.map((ed) => (
                <li key={ed.qualification} className="flex items-start gap-3">
                  {ed.logo && <img src={asset(`logos/${ed.logo}`)} alt={ed.logoAlt ?? ''} className="h-10 w-10 shrink-0 rounded-lg border border-line bg-white object-contain p-1" width={40} height={40} loading="lazy" />}
                  <div className="text-sm">
                    <p className="font-bold text-ink">{ed.qualification}</p>
                    <p className="text-ink-2">{ed.institution} · <span className="font-mono text-xs text-muted">{ed.dates}</span></p>
                    <p className="text-xs text-muted">{ed.details}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100} className="card p-6 sm:p-8">
            <p className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-label"><Icon name="graduation-cap" className="h-4 w-4" />Academic achievements</p>
            {profile.achievements.map((g) => (
              <div key={g.label} className="mt-4">
                <h3 className="text-sm font-bold">{g.label}</h3>
                <ul className="mt-1.5 space-y-1 text-[0.88rem] text-ink-2">
                  {g.items.map((it) => <li key={it} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />{it}</li>)}
                </ul>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
