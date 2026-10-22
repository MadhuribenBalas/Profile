import CountUp from '../components/CountUp'
import Icon from '../components/Icon'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { caseStudyBySlug, certifications } from '../lib/content'

const RANK = ['CTAL-TAE', 'CTAL-TM', 'CT-GenAI', 'CTFL']
const istqb = certifications.filter((c) => c.name.startsWith('ISTQB')).sort((a, b) => RANK.indexOf(a.code ?? '') - RANK.indexOf(b.code ?? ''))
const best = [...istqb].filter((c) => c.score).sort((a, b) => parseFloat(b.score!) - parseFloat(a.score!))

interface Metric { tag: string; area: string; value: string; unit: string; title: string; text: string; caseStudy?: string; wide?: boolean }

const METRICS: Metric[] = [
  { tag: 'Rakuten Mobile', area: 'CI acceleration', value: '62%', unit: 'faster', title: 'Jenkins regression build: ~2 h → ~45 min', wide: true,
    text: 'Moved the shop reservation suite to Robot Framework Browser Library, introduced parallel execution and fixed flaky scripts, so every release gets feedback in under an hour.', caseStudy: 'faster-ci-builds' },
  { tag: 'Claude AI', area: 'AI-assisted scripting', value: '2.5x', unit: 'output', title: '~40 → nearly 200 test cases in 2 months',
    text: 'Used Claude AI to develop and optimise scripts and locators, while keeping every test reviewed and maintainable.' },
  { tag: 'Comviva NeuraTalk', area: 'LLM & chatbot testing', value: '800+', unit: 'tests', title: '50+ critical defects caught before production',
    text: 'Built a Python + BERT framework that compares chatbot answers by meaning, covering intents, entities, fallbacks and multi-turn flows.', caseStudy: 'testing-ai-chatbots' },
  { tag: 'Axis Bank', area: 'Mobile regression', value: '3d → 5h', unit: 'regression', title: 'Appium framework designed from scratch', wide: true,
    text: 'Page-object Appium framework in Java for a React Native CRM: 170+ scenarios (120+ Android, 50+ iOS) and 60+ bugs fixed before release.', caseStudy: 'mobile-regression-in-hours' },
  { tag: '7+ clients', area: 'Defect prevention', value: '480+', unit: 'critical', title: 'Critical defects found across 4,500+ automated tests',
    text: 'Banking, FinTech, financial markets, telecom, media and AI products, for clients in Japan, Australia, the UK and India.' },
  { tag: 'ISTQB®', area: 'Certified expertise', value: `${istqb.length}x`, unit: 'certified', title: istqb.map((c) => c.code).join(' • '), wide: true,
    text: `Two Advanced Level certificates (Test Automation Engineering and Test Management) plus Testing with Generative AI${best[0] ? `, with scores up to ${best[0].score}` : ''}.` },
]

/** Counts up numbers such as "62%", "800+" or "2.5x"; other values (e.g. "3d → 5h") are shown as written */
function Metric({ value }: { value: string }) {
  const m = value.match(/^(\d+(?:\.\d+)?)(\D*)$/)
  if (!m) return <>{value}</>
  const decimals = m[1].includes('.') ? m[1].split('.')[1].length : 0
  return <CountUp value={parseFloat(m[1])} suffix={m[2]} decimals={decimals} duration={1600} />
}

export default function Impact() {
  return (
    <section id="impact" aria-labelledby="impact-heading" className="theme-dark night-grid relative border-y border-night-line bg-night py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="impact" dark title="Measurable Engineering Outcomes"
          intro="Results from real client projects: faster pipelines, broader coverage and defects stopped before they reached users." />
        <ul className="grid gap-5 lg:grid-cols-3">
          {METRICS.map((m, i) => {
            const cs = m.caseStudy ? caseStudyBySlug(m.caseStudy) : undefined
            return (
              <Reveal as="li" key={m.title} delay={(i % 3) * 90} className={`night-card spotlight flex flex-col p-6 sm:p-8 ${m.wide ? 'lg:col-span-2' : ''}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-2.5">
                    <span className="rounded border border-accent/30 bg-accent/15 px-2 py-0.5 font-mono text-[0.68rem] font-bold text-accent">METRIC_{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-mono text-[0.68rem] uppercase tracking-wider text-night-muted">{m.area}</span>
                  </p>
                  <span className="chip chip-night !text-[0.66rem]">{m.tag}</span>
                </div>
                <p className="mt-6 flex flex-wrap items-baseline gap-x-3">
                  <span className="text-5xl font-bold tracking-tight text-night-ink sm:text-6xl"><Metric value={m.value} /></span>
                  <span className="font-mono text-sm font-bold uppercase tracking-wider text-accent">{m.unit}</span>
                </p>
                <h3 className="mt-3 text-lg font-semibold tracking-normal text-night-ink">{m.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-night-muted">{m.text}</p>
                {cs && (
                  <details className="group mt-5 rounded-xl border border-night-line bg-black/25 px-4 py-3 text-[0.92rem] text-night-muted open:pb-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-night-ink">
                      How I did it <Icon name="chevron-down" className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-3"><span className="font-semibold text-night-ink">Problem: </span>{cs.problem}</p>
                    <ul className="mt-2 space-y-1.5">
                      {cs.approach.map((a) => <li key={a} className="flex gap-2"><Icon name="circle-check" className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" />{a}</li>)}
                    </ul>
                    <p className="mt-3 font-semibold text-night-ink">Result</p>
                    <ul className="mt-1 list-disc space-y-1 pl-5">{cs.result.map((r) => <li key={r}>{r}</li>)}</ul>
                  </details>
                )}
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
