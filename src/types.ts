// Data model for all site content. The JSON files in src/content/ must match these types.
// `npm test` checks every JSON entry, so a missing field, broken reference or missing file is caught before deploy.

/** An employer or client. Add a logo by saving the image in public/logos/ and setting `logo` to its file name. */
export interface Organization {
  id: string
  name: string
  initials: string // shown in a badge until a logo file is added
  logo?: string
  /** Badge background behind the logo, for logos designed on a dark background, e.g. "#000000" */
  logoBg?: string
  /** Logo hosted on the company's own website. Used when `logo` is not set; falls back to initials if it fails to load. */
  logoUrl?: string
  url?: string
}

export interface Profile {
  name: string
  title: string // official designation
  headline: string
  tagline: string
  /** Optional portrait: a square JPG in public/photo/. Remove the field to hide the photo. */
  photo?: string
  photoAlt?: string
  /** Roles she is open to, shown on the home and contact pages */
  openTo: string[]
  location: string
  workPermit: string
  email: string
  /** Optional phone number shown on the Contact section; remove it to hide */
  phone?: string
  linkedin: string
  focusAreas: string[]
  summary: string[]
  /** The CI result shown in the home page console */
  highlight: { label: string; beforeMinutes: number; afterMinutes: number; context: string }
  /** Numbers that count up on the home page */
  stats: { value: number; suffix: string; label: string }[]
  /** Lines shown in the home page test-run console */
  testRun: { suite: string; result: string }[]
  /** icon: a Lucide icon name listed in src/lib/icons.ts */
  competencies: { name: string; icon: string }[]
  /** Tool logo tiles, grouped; ids refer to src/content/tech.json */
  toolGroups: { label: string; tools: string[] }[]
  skills: { label: string; items: string }[]
  resumes: { label: string; description: string; file: string }[]
  languages: { language: string; level: string }[]
  /** logo: optional file in public/logos/ */
  education: { dates: string; qualification: string; institution: string; details: string; logo?: string; logoAlt?: string }[]
  achievements: { label: string; items: string[] }[]
}

export interface Employer {
  id: string
  orgId: string // must match an Organization id
  company: string
  title: string
  location: string
  start: string // "YYYY-MM"
  end: string | null // null = present
  summary: string
  clientIds: string[] // Organization ids
  highlights: { label?: string; text: string }[]
}

export interface Project {
  id: string
  name: string
  client: string
  clientId: string // must match an Organization id
  employerId: string // must match an Employer id
  role: string
  start: string | null // "YYYY-MM"; null when only a duration is known
  end: string | null
  duration?: string // e.g. "about 1 year", shown when dates are unknown
  domain: string
  /** Filter tab on the Projects section, e.g. "AI & GenAI" */
  sector: string
  technologies: string[]
  summary: string
  highlights: string[]
  metrics: string[]
  caseStudy?: string // slug of a case study, if one exists
}

export interface CaseStudy {
  slug: string
  title: string
  client: string
  projectId: string
  problem: string
  approach: string[]
  result: string[]
  technologies: string[]
  note?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  status: 'completed' | 'in-progress'
  issued?: string // "YYYY-MM", required when completed
  expected?: string // e.g. "Nov 2026", for in-progress
  credentialId?: string
  score?: string
  details?: string
  verifyUrl?: string
  links?: { label: string; url: string }[]
  badge?: string // file in public/badges/
  /** Short code shown on the card, e.g. "CTAL-TAE" */
  code?: string
  /** One or two sentences on what the certification covers */
  about?: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  context: string
  date: string // shown as written, e.g. "Q4 2025" or "Jun 2024"
  featured?: boolean // shown on the home page
}

export interface Award {
  id: string
  title: string
  date: string // shown as written
  org: string
  context: string
  testimonialIds: string[]
}

/** A tool or technology. Logo file lives in public/tech/; without one, `initials` are shown. */
export interface Tech {
  id: string
  name: string
  initials: string
  logo?: string
}
