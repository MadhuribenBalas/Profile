import type { Award, CaseStudy, Certification, Employer, Organization, Profile, Project, Tech, Testimonial } from '../types'
import profileJson from '../content/profile.json'
import organizationsJson from '../content/organizations.json'
import experienceJson from '../content/experience.json'
import projectsJson from '../content/projects.json'
import caseStudiesJson from '../content/case-studies.json'
import certificationsJson from '../content/certifications.json'
import testimonialsJson from '../content/testimonials.json'
import awardsJson from '../content/awards.json'
import techJson from '../content/tech.json'

// All site content comes from src/content/*.json. Edit those files to update the site.
export const profile = profileJson as Profile
export const organizations = organizationsJson as Organization[]
export const employers = experienceJson as Employer[]
export const projects = projectsJson as Project[]
export const caseStudies = caseStudiesJson as CaseStudy[]
const allCerts = certificationsJson as Certification[]
export const certifications = allCerts.filter((c) => c.status === 'completed').sort((a, b) => (b.issued ?? '').localeCompare(a.issued ?? ''))
export const certificationsInProgress = allCerts.filter((c) => c.status === 'in-progress')
export const testimonials = testimonialsJson as Testimonial[]
export const awards = awardsJson as Award[]
export const tech = techJson as Tech[]
export const techById = (id: string) => tech.find((t) => t.id === id)

export const orgById = (id: string) => organizations.find((o) => o.id === id)
export const employerById = (id: string) => employers.find((e) => e.id === id)
export const projectById = (id: string) => projects.find((p) => p.id === id)
export const caseStudyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug)
export const testimonialById = (id: string) => testimonials.find((t) => t.id === id)

/** Every client organisation that appears on at least one project, in work-history order */
export const clientOrgs = [...new Set(projects.map((p) => p.clientId))].map((id) => orgById(id)!).filter(Boolean)

/** Resolve a file in public/ so it works under any GitHub Pages sub-path */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
