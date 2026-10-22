import type { Employer, Organization, Project } from '../types'

export interface ProjectFilter {
  company: string // employer id, or '' for all
  client: string // organization id, or '' for all
  technology: string // '' for all
  role: string // '' for all
  query: string // free text
}

export const emptyFilter: ProjectFilter = { company: '', client: '', technology: '', role: '', query: '' }

/** Pure function so it can be unit tested: returns projects matching every active filter */
export function filterProjects(projects: Project[], f: ProjectFilter): Project[] {
  const q = f.query.trim().toLowerCase()
  return projects.filter((p) => {
    if (f.company && p.employerId !== f.company) return false
    if (f.client && p.clientId !== f.client) return false
    if (f.technology && !p.technologies.includes(f.technology)) return false
    if (f.role && p.role !== f.role) return false
    if (q) {
      const haystack = [p.name, p.client, p.role, p.domain, p.summary, ...p.technologies, ...p.highlights].join(' ').toLowerCase()
      if (!haystack.includes(q)) return false
    }
    return true
  })
}

/** Options for the filter menus, built from the data so new projects appear automatically */
export function filterOptions(projects: Project[], employers: Employer[], organizations: Organization[] = []) {
  const uniq = (xs: string[]) => [...new Set(xs)].sort((a, b) => a.localeCompare(b))
  return {
    companies: employers.filter((e) => projects.some((p) => p.employerId === e.id)).map((e) => ({ value: e.id, label: e.company })),
    clients: [...new Set(projects.map((p) => p.clientId))].map((id) => ({ value: id, label: organizations.find((o) => o.id === id)?.name ?? id })),
    technologies: uniq(projects.flatMap((p) => p.technologies)),
    roles: uniq(projects.map((p) => p.role)),
  }
}

/** Newest first; projects with unknown dates go last, in file order */
export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (!a.start && !b.start) return 0
    if (!a.start) return 1
    if (!b.start) return -1
    return b.start.localeCompare(a.start)
  })
}

export function filterFromParams(params: URLSearchParams): ProjectFilter {
  return {
    company: params.get('company') ?? '',
    client: params.get('client') ?? '',
    technology: params.get('tech') ?? '',
    role: params.get('role') ?? '',
    query: params.get('q') ?? '',
  }
}

export function filterToParams(f: ProjectFilter): URLSearchParams {
  const p = new URLSearchParams()
  if (f.company) p.set('company', f.company)
  if (f.client) p.set('client', f.client)
  if (f.technology) p.set('tech', f.technology)
  if (f.role) p.set('role', f.role)
  if (f.query) p.set('q', f.query)
  return p
}

/** Filter tabs for the Projects section: "All" first, then each sector in order of first appearance */
export function sectorTabs(projects: Project[]): string[] {
  return ['All', ...new Set(projects.map((p) => p.sector))]
}

export function filterBySector(projects: Project[], sector: string): Project[] {
  return sector === 'All' ? projects : projects.filter((p) => p.sector === sector)
}
