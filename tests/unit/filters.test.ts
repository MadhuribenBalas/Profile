import { describe, expect, it } from 'vitest'
import { employers, organizations, projects } from '../../src/lib/content'
import { emptyFilter, filterFromParams, filterOptions, filterProjects, filterToParams, sortProjects } from '../../src/lib/filters'

describe('filterProjects', () => {
  it('returns everything with no filters', () => {
    expect(filterProjects(projects, emptyFilter)).toHaveLength(projects.length)
  })
  it('filters by company', () => {
    const r = filterProjects(projects, { ...emptyFilter, company: 'tcs' })
    expect(r.length).toBeGreaterThan(0)
    expect(r.every((p) => p.employerId === 'tcs')).toBe(true)
  })
  it('filters by technology', () => {
    const r = filterProjects(projects, { ...emptyFilter, technology: 'Appium' })
    expect(r.map((p) => p.id).sort()).toEqual(['axis-siddhi', 'itomixer'])
  })
  it('combines filters with AND', () => {
    const r = filterProjects(projects, { ...emptyFilter, company: 'sourcefuse', technology: 'Appium' })
    expect(r.map((p) => p.id)).toEqual(['itomixer'])
  })
  it('filters by client', () => {
    const r = filterProjects(projects, { ...emptyFilter, client: 'comviva' })
    expect(r.map((p) => p.id).sort()).toEqual(['bluemarble', 'neuratalk'])
  })
  it('searches text case-insensitively', () => {
    expect(filterProjects(projects, { ...emptyFilter, query: 'CHATBOT' }).map((p) => p.id)).toContain('neuratalk')
  })
  it('returns an empty list when nothing matches', () => {
    expect(filterProjects(projects, { ...emptyFilter, query: 'no-such-thing' })).toEqual([])
  })
})

describe('filterOptions', () => {
  it('lists each technology once, sorted', () => {
    const { technologies, clients } = filterOptions(projects, employers, organizations)
    expect(clients.every((c) => c.label !== c.value)).toBe(true)
    expect(new Set(technologies).size).toBe(technologies.length)
    expect(technologies).toEqual([...technologies].sort((a, b) => a.localeCompare(b)))
  })
})

describe('sortProjects', () => {
  it('puts newest first and undated projects last', () => {
    const sorted = sortProjects(projects)
    expect(sorted[0].start).toBe('2026-08')
    expect(sorted.at(-1)?.start).toBeNull()
  })
})

describe('URL round trip', () => {
  it('keeps filters when shared as a link', () => {
    const f = { company: 'sourcefuse', client: 'rakuten-mobile', technology: 'Kotlin', role: 'Senior Tester – Automation, Team Lead', query: 'mobile' }
    expect(filterFromParams(filterToParams(f))).toEqual(f)
  })
})

import { filterBySector, sectorTabs } from '../../src/lib/filters'

describe('sector tabs', () => {
  it('start with All and list each sector once', () => {
    const tabs = sectorTabs(projects)
    expect(tabs[0]).toBe('All')
    expect(new Set(tabs).size).toBe(tabs.length)
    expect(tabs).toContain('AI & GenAI')
  })
  it('All shows every project; a sector shows only its projects', () => {
    expect(filterBySector(projects, 'All')).toHaveLength(projects.length)
    const ai = filterBySector(projects, 'AI & GenAI')
    expect(ai.length).toBeGreaterThan(0)
    expect(ai.every((p) => p.sector === 'AI & GenAI')).toBe(true)
  })
  it('every sector tab has at least one project, and every project has a sector', () => {
    for (const p of projects) expect(p.sector, p.id).toBeTruthy()
    for (const t of sectorTabs(projects).slice(1)) expect(filterBySector(projects, t).length, t).toBeGreaterThan(0)
  })
})
