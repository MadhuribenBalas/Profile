import { Monogram } from './Header'
import Icon from './Icon'
import { asset, certifications, profile } from '../lib/content'
import { SECTIONS } from '../lib/nav'

export default function Footer() {
  const RANK = ['CTAL-TAE', 'CTAL-TM', 'CT-GenAI', 'CTFL']
  const istqb = certifications.filter((c) => c.name.startsWith('ISTQB')).map((c) => c.code ?? '').filter(Boolean).sort((a, b) => RANK.indexOf(a) - RANK.indexOf(b))
  return (
    <footer className="theme-dark border-t border-line bg-black py-14 text-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-3">
          <Monogram small />
          <div className="leading-tight">
            <p className="font-display text-base font-bold">{profile.name}</p>
            <p className="text-xs text-muted">{profile.title}</p>
          </div>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
          {SECTIONS.map((s) => <a key={s.id} href={`#${s.id}`} className="text-ink-2 no-underline hover:text-accent">{s.label}</a>)}
        </nav>
        <a href={asset(profile.resumes[0].file)} download className="btn btn-lime self-start !py-2.5 text-sm"><Icon name="download" /> Get My CV</a>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-line px-4 pt-6 text-xs text-muted sm:flex-row sm:justify-between sm:px-6">
        <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        <p className="font-mono">ISTQB® {istqb.join(' • ')} certified</p>
      </div>
    </footer>
  )
}
