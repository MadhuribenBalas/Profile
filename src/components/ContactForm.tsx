import { useState } from 'react'
import { FORM_ENDPOINT } from '../config'
import { profile } from '../lib/content'

import { validateContact as validate, type ContactFields as Fields } from '../lib/validate'

type Status = 'idle' | 'sending' | 'sent' | 'error'
const empty: Fields = { name: '', email: '', company: '', message: '' }

export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFields({ ...fields, [k]: e.target.value })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const found = validate(fields)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus()
      return
    }
    // No form service configured: open the visitor's email app with the message filled in
    if (!FORM_ENDPOINT) {
      const subject = encodeURIComponent(`Opportunity${fields.company ? ` at ${fields.company}` : ''}: ${fields.name}`)
      const body = encodeURIComponent(`${fields.message}\n\n${fields.name}\n${fields.email}${fields.company ? `\n${fields.company}` : ''}`)
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(fields) })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('sent')
      setFields(empty)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="rounded-xl border border-accent/40 bg-label-bg p-6">
        <p className="font-bold text-label">Message sent</p>
        <p className="mt-1">Thank you. Your message has been sent to {profile.name}.</p>
        <button type="button" onClick={() => setStatus('idle')} className="mt-4 font-bold text-accent-ink underline underline-offset-2">Send another message</button>
      </div>
    )
  }

  const input = 'mt-1.5 w-full rounded-xl border bg-card-hover px-3.5 py-2.5 text-ink transition-colors focus:border-accent focus:bg-card focus:outline-none'
  const field = (k: keyof Fields, label: string, type = 'text', required = true, autoComplete?: string) => (
    <div>
      <label htmlFor={`contact-${k}`} className="text-sm font-bold">{label}{!required && <span className="font-normal text-muted"> (optional)</span>}</label>
      {k === 'message' ? (
        <textarea id={`contact-${k}`} rows={5} value={fields[k]} onChange={set(k)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `err-${k}` : undefined}
          className={`${input} ${errors[k] ? 'border-accent' : 'border-line'}`} />
      ) : (
        <input id={`contact-${k}`} type={type} value={fields[k]} onChange={set(k)} autoComplete={autoComplete} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `err-${k}` : undefined}
          className={`${input} ${errors[k] ? 'border-accent' : 'border-line'}`} />
      )}
      {errors[k] && <p id={`err-${k}`} className="mt-1 text-sm text-accent-ink">{errors[k]}</p>}
    </div>
  )

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      {field('name', 'Your name', 'text', true, 'name')}
      {field('email', 'Email', 'email', true, 'email')}
      {field('company', 'Company', 'text', false, 'organization')}
      <div className="sm:col-span-2">{field('message', 'Message')}</div>
      {status === 'error' && (
        <p role="alert" className="text-accent-ink sm:col-span-2">The message could not be sent. Check your connection and try again, or email <a href={`mailto:${profile.email}`}>{profile.email}</a>.</p>
      )}
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
      <button type="submit" disabled={status === 'sending'} className="btn btn-lime disabled:opacity-60">
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      {!FORM_ENDPOINT && <p className="text-sm text-muted">This opens your email app with the message filled in.</p>}
      </div>
    </form>
  )
}
