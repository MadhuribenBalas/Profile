import { useState } from 'react'
import { asset, orgById } from '../lib/content'

const SIZES = { sm: 'h-9 w-9 text-[0.62rem]', md: 'h-12 w-12 text-xs', lg: 'h-16 w-16 text-sm' }
// Image logos keep the same height but may be wider, so wordmarks stay readable
const IMG_SIZES = { sm: 'h-9 min-w-9 max-w-[7rem]', md: 'h-12 min-w-12 max-w-[10rem]', lg: 'h-16 min-w-16 max-w-[13rem]' }

/**
 * Logo for an employer or client:
 * 1. `logo`: a file in public/logos/ (most reliable)
 * 2. `logoUrl`: the logo on the company's own website
 * 3. otherwise, or if the image fails to load, a neutral initials badge
 */
export default function OrgLogo({ id, size = 'md', className = '', eager = false }: { id: string; size?: keyof typeof SIZES; className?: string; eager?: boolean }) {
  const org = orgById(id)
  const [failed, setFailed] = useState(false)
  if (!org) return null
  const src = org.logo ? asset(`logos/${org.logo}`) : org.logoUrl
  if (src && !failed) {
    return (
      <span className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-white p-1 ${IMG_SIZES[size]} ${className}`}
        style={org.logoBg ? { backgroundColor: org.logoBg, borderColor: org.logoBg } : undefined}>
        <img src={src} alt={`${org.name} logo`} className="h-auto max-h-full w-auto max-w-full object-contain" loading={eager ? 'eager' : 'lazy'}
          referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      </span>
    )
  }
  return (
    <span role="img" aria-label={org.name} title={org.name}
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-md border border-line bg-label-bg font-bold tracking-wide text-label ${SIZES[size]} ${className}`}>
      {org.initials}
    </span>
  )
}
