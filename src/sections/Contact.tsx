import { useState } from 'react'
import ContactForm from '../components/ContactForm'
import Icon from '../components/Icon'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import { asset, profile } from '../lib/content'

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try { await navigator.clipboard.writeText(value) } catch { /* clipboard blocked: the value is still visible to select */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <button type="button" onClick={copy} aria-label={`Copy ${label}`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-card-hover px-3 py-1.5 font-mono text-xs text-ink-2 transition-colors hover:border-accent hover:text-ink">
      <Icon name={copied ? 'check' : 'copy'} className="h-3.5 w-3.5" />{copied ? 'Copied' : 'Copy'}
    </button>
  )
}

function ContactCard({ icon, title, text, value, href, external, copy }: { icon: string; title: string; text: string; value: string; href: string; external?: boolean; copy?: boolean }) {
  return (
    <div className="card card-hover spotlight tilt flex h-full flex-col p-6 sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-card-hover text-accent-ink shadow-sm"><Icon name={icon} className="h-5 w-5" /></span>
        {copy && <CopyButton value={value} label={title} />}
      </div>
      <h3 className="mt-5 text-lg font-bold">{title}</h3>
      <p className="mt-1 text-sm text-muted">{text}</p>
      <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        className="mt-auto break-all pt-5 font-mono text-[0.92rem] font-bold">{value}</a>
    </div>
  )
}

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="theme-dark relative overflow-hidden border-t border-line bg-paper py-24 sm:py-28">
      <div aria-hidden className="aurora right-[-10%] bottom-[-20%] h-[30rem] w-[40rem] bg-[radial-gradient(closest-side,rgb(136_203_0/.13),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="contact" title="Get in Touch"
          intro={`Open to ${profile.openTo.join(', ')} roles. ${profile.workPermit}`} />

        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Reveal as="li"><ContactCard icon="mail" title="Email" text="The quickest way to reach me about roles and interviews." value={profile.email} href={`mailto:${profile.email}`} copy /></Reveal>
          {profile.phone && (
            <Reveal as="li" delay={80}><ContactCard icon="phone" title="Phone" text="For interview scheduling and calls (IST, UTC+5:30)." value={profile.phone} href={`tel:${profile.phone.replace(/\s/g, '')}`} copy /></Reveal>
          )}
          <Reveal as="li" delay={160}><ContactCard icon="linkedin" title="LinkedIn" text="Recommendations, certifications and my professional network." value={profile.linkedin.replace(/^https?:\/\//, '')} href={profile.linkedin} external /></Reveal>
        </ul>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.6fr]">
          <Reveal className="card flex flex-col p-6 sm:p-7">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-card-hover text-accent-ink shadow-sm"><Icon name="file-text" className="h-5 w-5" /></span>
            <h3 className="mt-5 text-lg font-bold">Official CV (PDF)</h3>
            <p className="mt-1 text-sm text-muted">ATS-friendly versions for different markets.</p>
            <ul className="mt-4 space-y-2.5">
              {profile.resumes.map((r, i) => (
                <li key={r.file}>
                  <a href={asset(r.file)} download className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 no-underline transition-colors ${i === 0 ? 'border-accent bg-accent text-black hover:bg-accent-hover hover:text-black' : 'border-line bg-card-hover text-ink hover:border-accent/40 hover:text-ink'}`}>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold">{r.label}</span>
                      <span className={`block text-xs ${i === 0 ? 'text-black/70' : 'text-muted'}`}>{r.description}</span>
                    </span>
                    <Icon name="download" className="h-4 w-4 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 flex items-start gap-2 border-t border-line-soft pt-4 text-sm text-ink-2"><Icon name="map-pin" className="mt-0.5 h-4 w-4 shrink-0 text-label" />{profile.location}. {profile.workPermit}</p>
          </Reveal>
          <Reveal delay={100} className="card p-6 sm:p-8">
            <h3 className="text-lg font-bold">Send a message</h3>
            <p className="mb-5 mt-1 text-sm text-muted">Tell me about the role or project; I usually reply within a day.</p>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
