import { ICONS } from '../lib/icons'

/** Lucide line icon by name (see src/lib/icons.ts). Decorative unless a label is given. */
export default function Icon({ name, className = 'h-4 w-4', label }: { name: string; className?: string; label?: string }) {
  if (name === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
        <rect x="2" y="2" width="20" height="20" rx="4.5" fill="currentColor" />
        <text x="12" y="17.2" textAnchor="middle" fontFamily="Tajawal, Arial, sans-serif" fontWeight="700" fontSize="12.5" fill="#fff">in</text>
      </svg>
    )
  }
  const inner = ICONS[name]
  if (!inner) return null
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
      className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: inner }} />
  )
}
