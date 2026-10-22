import Icon from '../components/Icon'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { awards, testimonialById, testimonials } from '../lib/content'

export default function Recognition() {
  const featured = testimonials.filter((t) => t.featured).slice(0, 2)
  const withQuotes = awards.filter((a) => a.testimonialIds.length > 0)
  const others = awards.filter((a) => a.testimonialIds.length === 0)
  return (
    <section id="recognition" aria-labelledby="recognition-heading" className="theme-dark relative overflow-hidden border-t border-line bg-paper-alt py-24 sm:py-28">
      <div aria-hidden className="aurora left-[-10%] bottom-[-15%] h-[30rem] w-[40rem] bg-[radial-gradient(closest-side,rgb(136_203_0/.10),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="recognition" title="Recognition & Testimonials"
          intro="What managers, product owners and clients said about my work, in their own words." />

        <div className="grid gap-5 lg:grid-cols-2">
          {featured.map((t, i) => (
            <Reveal as="figure" key={t.id} delay={i * 120} className="card relative p-7 sm:p-9">
              <Icon name="quote" className="absolute right-6 top-6 h-10 w-10 text-accent/15" />
              <blockquote className="text-[1.32rem] italic leading-relaxed text-ink">“{t.quote}”</blockquote>
              <figcaption className="mt-6 border-t border-line-soft pt-4 text-sm">
                <span className="block font-bold text-ink">{t.author}</span>
                <span className="text-muted">{t.role} · {t.context} · {t.date}</span>
              </figcaption>
            </Reveal>
          ))}
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {withQuotes.map((a, i) => (
            <Reveal as="li" key={a.id} delay={(i % 3) * 80} className="card card-hover spotlight tilt flex flex-col p-6">
              <p className="flex items-center gap-2 font-mono text-[0.7rem] font-bold uppercase tracking-wider text-label"><Icon name="trophy" className="h-3.5 w-3.5" />{a.date}</p>
              <h3 className="mt-2 text-[1.05rem] font-bold leading-snug">{a.title}</h3>
              <p className="text-xs text-muted">{[a.org, a.context].filter(Boolean).join(' · ')}</p>
              <div className="mt-4 space-y-3">
                {a.testimonialIds.map((id) => testimonialById(id)).filter((t) => t && !t.featured).map((t) => (
                  <blockquote key={t!.id} className="border-l-2 border-accent/40 pl-3 text-[0.9rem] text-ink-2">
                    <p className="italic">“{t!.quote}”</p>
                    <footer className="mt-1 text-xs font-semibold text-ink">{t!.author}{t!.role ? <span className="font-normal text-muted">, {t!.role}</span> : null}</footer>
                  </blockquote>
                ))}
                {a.testimonialIds.every((id) => testimonialById(id)?.featured) && <p className="text-xs italic text-muted">Quoted above.</p>}
              </div>
            </Reveal>
          ))}
        </ul>

        {others.length > 0 && (
          <Reveal className="card mt-8 p-6 sm:p-7">
            <p className="flex items-center gap-2 text-sm font-bold"><Icon name="award" className="h-4 w-4 text-accent-ink" />More awards</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {others.map((a) => <li key={a.id} className="chip"><strong className="text-ink">{a.title}</strong> {a.org.replace('Tata Consultancy Services', 'TCS')}, {a.date}</li>)}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  )
}
