import CountUp from '../components/CountUp'
import Icon from '../components/Icon'
import OrgLogo from '../components/OrgLogo'
import ParticleField from '../components/ParticleField'
import RoleRotator from '../components/RoleRotator'
import { asset, certifications, clientOrgs, employers, profile } from '../lib/content'

const RANK = ['CTAL-TAE', 'CTAL-TM', 'CT-GenAI', 'CTFL']
const istqb = certifications.filter((c) => c.name.startsWith('ISTQB')).sort((a, b) => RANK.indexOf(a.code ?? '') - RANK.indexOf(b.code ?? ''))

const STATS = [
  { icon: 'award', label: 'ISTQB', value: istqb.length, suffix: 'x', caption: 'Certified, 2 Advanced Level' },
  { icon: 'zap', label: 'CI builds', value: 62, suffix: '%', caption: 'Faster Jenkins regression' },
  { icon: 'target', label: 'Automation', value: 4500, suffix: '+', caption: 'Automated tests delivered' },
]

const FOCUS = [
  { icon: 'code', text: 'Test automation frameworks' },
  { icon: 'terminal', text: 'Playwright / Robot Framework' },
  { icon: 'layers', text: 'Selenium / Appium' },
  { icon: 'bot', text: 'LLM & chatbot testing' },
  { icon: 'smartphone', text: 'Android & iOS (EN / JA)' },
  { icon: 'users', text: 'Leading a team of 5' },
]

const ROLES = ['test automation frameworks', 'AI & LLM chatbot testing', 'mobile automation, Android & iOS', 'faster CI/CD pipelines', 'QA leadership & test strategy']

const MATRIX = [
  { icon: 'bot', title: 'AI & LLM Chatbot Testing', sub: '800+ tests · 50+ critical defects', tag: 'SEMANTIC',
    text: 'Python + BERT framework that checks chatbot answers by meaning, not exact wording, for LLM and Rasa bots.', tools: ['Python', 'BERT', 'Rasa', 'Robot Framework'] },
  { icon: 'smartphone', title: 'Mobile Automation, Android & iOS', sub: 'English & Japanese · 400+ tests', tag: 'REAL DEVICES',
    text: 'Bilingual Kotlin automation for Rakuten Link, run on real devices through Jenkins and AWS Device Farm.', tools: ['Kotlin', 'Appium', 'AWS Device Farm'] },
  { icon: 'zap', title: 'Web E2E & CI Acceleration', sub: 'Builds 2 h → 45 min', tag: 'PARALLEL',
    text: 'Robot Framework Browser Library with parallel Jenkins runs and AI-assisted scripting.', tools: ['Robot Framework', 'Playwright', 'Jenkins', 'Claude AI'] },
]

/** Splits a line into words that rise in one after another */
function Words({ text, start = 0, wordClass = '' }: { text: string; start?: number; wordClass?: string }) {
  return (
    <span>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <span className={`word ${wordClass}`} style={{ ['--d' as string]: `${start + i * 70}ms` }}>{w}&nbsp;</span>
        </span>
      ))}
    </span>
  )
}

export default function Hero() {
  const current = employers.find((e) => !e.end)
  const codes = istqb.map((c) => c.code)
  const logos = [...clientOrgs.map((o) => o.id), ...employers.map((e) => e.orgId)].filter((v, i, a) => a.indexOf(v) === i)
  return (
    <section id="overview" aria-labelledby="overview-heading" className="theme-dark relative overflow-hidden bg-paper pb-16 pt-32 md:pb-20 md:pt-40">
      {/* Layered background: aurora glow, particle network, grid, film grain */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="aurora left-[-10%] top-[-20%] h-[38rem] w-[38rem] bg-[radial-gradient(closest-side,rgb(136_203_0/.32),transparent)]" />
        <div className="aurora b right-[-15%] top-[10%] h-[34rem] w-[46rem] bg-[radial-gradient(closest-side,rgb(46_120_40/.38),transparent)]" />
        <div className="aurora bottom-[-25%] left-[30%] h-[30rem] w-[40rem] bg-[radial-gradient(closest-side,rgb(184_224_102/.14),transparent)]" />
        <div className="hero-grid absolute inset-0" />
        <ParticleField className="opacity-80" />
        <div className="grain absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#050806]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
        <div>
          <p className="hero-in kicker">Test automation · AI testing · QA leadership</p>

          <p className="hero-in mt-5 inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-muted backdrop-blur" style={{ ['--d' as string]: '60ms' }}>
            <span className="relative flex h-2.5 w-2.5" aria-hidden>
              <span className="ping-soft absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <span className="font-medium text-ink">Open to Senior &amp; Lead QA roles</span>
            <span className="text-faint" aria-hidden>|</span>
            <span className="inline-flex items-center gap-1 text-label"><Icon name="map-pin" className="h-3.5 w-3.5" />Porbandar, India · open to relocation</span>
          </p>

          <h1 id="overview-heading" className="mt-7 text-[2.2rem] font-bold leading-[1.08] sm:text-[3rem] lg:text-[2.45rem] xl:text-[2.85rem]">
            <span className="sr-only">{profile.name}: Releases you can trust. Automation &amp; AI Testing.</span>
            <span aria-hidden>
              <Words text="Releases you can trust." start={120} /><br />
              <Words text="Automation & AI Testing." start={480} wordClass="lime-text shimmer" />
            </span>
          </h1>

          <p className="hero-in mt-5 text-lg font-medium text-ink-2 sm:text-xl" style={{ ['--d' as string]: '700ms' }}>
            Specialising in <RoleRotator phrases={ROLES} />
          </p>

          <p className="hero-in mt-5 max-w-2xl text-[1.08rem] font-light italic leading-relaxed text-ink-2" style={{ ['--d' as string]: '800ms' }}>
            “{profile.tagline}”
          </p>

          <p className="hero-in mt-4 max-w-2xl text-[1rem] text-muted" style={{ ['--d' as string]: '880ms' }}>
            I'm <strong className="font-semibold text-ink">{profile.name}</strong>, a {profile.title} at <strong className="font-semibold text-ink">{current?.company.replace(/ India Pvt\. Ltd\./, '')}</strong> with
            8+ years in test automation and quality leadership, and {istqb.length}× ISTQB certified (<strong className="font-semibold text-ink">{codes.join(', ')}</strong>).
            I lead a team of 5 testers and deliver <strong className="font-semibold text-ink">automation for web, mobile, API and AI chatbots</strong> for banks, telecoms and AI products.
          </p>

          <ul className="hero-in mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3" style={{ ['--d' as string]: '960ms' }}>
            {STATS.map((s) => (
              <li key={s.label} className="card card-hover spotlight tilt p-4">
                <p className="flex items-center gap-1.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-label">
                  <Icon name={s.icon} className="h-3.5 w-3.5" />{s.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-ink"><CountUp value={s.value} suffix={s.suffix} /></p>
                <p className="mt-0.5 text-xs text-muted">{s.caption}</p>
              </li>
            ))}
          </ul>

          <ul className="hero-in mt-6 flex flex-wrap gap-2" style={{ ['--d' as string]: '1040ms' }} aria-label="Focus areas">
            {FOCUS.map((f) => (
              <li key={f.text} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[0.8rem] text-ink-2 transition-colors hover:border-accent/50 hover:text-ink">
                <Icon name={f.icon} className="h-3.5 w-3.5 text-accent" />{f.text}
              </li>
            ))}
          </ul>

          <div className="hero-in mt-8 flex flex-wrap gap-3" style={{ ['--d' as string]: '1120ms' }}>
            <a href={asset(profile.resumes[0].file)} download className="btn btn-lime"><Icon name="download" />Get My CV</a>
            <a href="#projects" className="btn btn-outline">Explore Projects <span className="arrow" aria-hidden>↗</span></a>
            <a href="#contact" className="btn btn-ghost"><Icon name="mail" />Get in Touch</a>
          </div>
        </div>

        <aside aria-label="Quality delivery matrix" className="hero-in card ring-spin float self-start p-5 sm:p-6" style={{ ['--d' as string]: '400ms' }}>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-4">
            <p className="flex items-center gap-2 font-mono text-[0.72rem] font-bold uppercase tracking-wider text-ink">
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_#88cb00]" aria-hidden />Quality delivery matrix
            </p>
            <span className="chip chip-lime !text-[0.62rem]">ISTQB • {codes.filter((c) => c?.startsWith('CTAL')).join(' • ')}</span>
          </div>
          <ul className="mt-4 space-y-3">
            {MATRIX.map((m, i) => (
              <li key={m.title} className="spotlight rounded-2xl border border-line bg-card-hover p-4 transition-colors hover:border-accent/40">
                <div className="flex items-start gap-3">
                  <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${i === 1 ? 'border border-accent/40 bg-accent/10 text-accent' : 'bg-accent text-black'}`}>
                    <Icon name={m.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-[0.95rem] font-semibold leading-snug">{m.title}</p>
                      <span className="chip !px-2 !py-0.5 !text-[0.58rem] tracking-wider">{m.tag}</span>
                    </div>
                    <p className="font-mono text-[0.72rem] font-bold text-accent-ink">{m.sub}</p>
                  </div>
                </div>
                <p className="mt-2.5 text-[0.85rem] leading-relaxed text-muted">{m.text}</p>
                <p className="mt-2.5 flex flex-wrap gap-1.5">{m.tools.map((t) => <span key={t} className="chip !py-0.5 !text-[0.64rem]">{t}</span>)}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4 font-mono text-[0.7rem] text-muted">
            <span className="inline-flex items-center gap-1.5"><Icon name="shield-check" className="h-3.5 w-3.5 text-accent" />{istqb.length}× ISTQB® certified</span>
            <span className="inline-flex items-center gap-1.5"><Icon name="globe" className="h-3.5 w-3.5 text-accent" />7+ global clients</span>
          </p>
        </aside>
      </div>

      <div className="relative mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <p className="text-center font-mono text-[0.72rem] font-bold uppercase tracking-[0.18em] text-muted">Trusted by teams at</p>
        <div className="marquee mt-5" aria-label="Clients and employers">
          <ul className="marquee-track">
            {[0, 1].map((copy) => logos.map((id) => (
              <li key={`${copy}-${id}`} data-copy={copy ? '' : undefined} aria-hidden={copy ? true : undefined}
                className="flex h-16 items-center rounded-2xl border border-white/10 bg-white px-4 shadow-[0_8px_30px_-12px_rgb(0_0_0/.6)]">
                <OrgLogo id={id} size="md" eager className="!border-0 !p-0" />
              </li>
            )))}
          </ul>
        </div>
      </div>
    </section>
  )
}
