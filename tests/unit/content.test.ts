// Checks every content file. Run `npm test` after adding a project or certification:
// a typo, missing field, duplicate id or missing file fails here instead of on the live site.
import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { ICONS } from '../../src/lib/icons'
import { awards, tech, caseStudies, certifications, certificationsInProgress, employers, organizations, profile, projects, testimonials } from '../../src/lib/content'

const YM = /^\d{4}-(0[1-9]|1[0-2])$/
const unique = (xs: string[]) => new Set(xs).size === xs.length
const publicFile = (p: string) => existsSync(new URL(`../../public/${p}`, import.meta.url))

describe('profile', () => {
  it('has the basics', () => {
    expect(profile.name).toBeTruthy()
    expect(profile.email).toMatch(/@/)
    expect(profile.highlight.afterMinutes).toBeLessThan(profile.highlight.beforeMinutes)
  })
  it('links to CV files that exist in public/', () => {
    for (const r of profile.resumes) expect(publicFile(r.file), r.file).toBe(true)
  })
  it('gives every competency an icon that exists', () => {
    for (const c of profile.competencies) expect(ICONS[c.icon], `${c.name} → ${c.icon}`).toBeTruthy()
  })
  it('lists only known tools, each with an existing logo file or initials', () => {
    expect(unique(tech.map((t) => t.id))).toBe(true)
    for (const g of profile.toolGroups) for (const id of g.tools) expect(tech.some((t) => t.id === id), `${g.label} → ${id}`).toBe(true)
    for (const t of tech) {
      if (t.logo) expect(publicFile(`tech/${t.logo}`), t.logo).toBe(true)
      else expect(t.initials.length, t.id).toBeGreaterThan(0)
    }
  })
  it('has a valid phone number when one is shown', () => {
    if (profile.phone) expect(profile.phone).toMatch(/^\+?[\d\s-]{8,}$/)
  })
  it('gives every certification a short code and description', () => {
    for (const c of [...certifications, ...certificationsInProgress]) {
      expect(c.code, c.id).toBeTruthy()
      expect(c.about, c.id).toBeTruthy()
    }
  })
  it('lists the roles she is open to', () => {
    expect(profile.openTo.length).toBeGreaterThan(0)
  })

  it('uses a photo that exists in public/photo/', () => {
    if (profile.photo) expect(publicFile(`photo/${profile.photo}`), profile.photo).toBe(true)
  })

  it('uses education logos that exist in public/logos/', () => {
    for (const e of profile.education) if (e.logo) expect(publicFile(`logos/${e.logo}`), e.logo).toBe(true)
  })
})

describe('organizations', () => {
  it('have unique ids, initials and existing logo files', () => {
    expect(unique(organizations.map((o) => o.id))).toBe(true)
    for (const o of organizations) {
      expect(o.initials.length, o.id).toBeGreaterThan(0)
      if (o.logo) expect(publicFile(`logos/${o.logo}`), o.logo).toBe(true)
      if (o.logoUrl) expect(o.logoUrl, o.id).toMatch(/^https:\/\//)
    }
  })
})

describe('employers', () => {
  it('have unique ids, valid dates and known organisations', () => {
    expect(unique(employers.map((e) => e.id))).toBe(true)
    for (const e of employers) {
      expect(organizations.some((o) => o.id === e.orgId), e.orgId).toBe(true)
      for (const c of e.clientIds) expect(organizations.some((o) => o.id === c), c).toBe(true)
      expect(e.start, e.id).toMatch(YM)
      if (e.end) expect(e.end, e.id).toMatch(YM)
    }
  })
})

describe('projects', () => {
  it('have unique ids', () => expect(unique(projects.map((p) => p.id))).toBe(true))
  it.each(projects.map((p) => [p.id, p] as const))('%s is complete and consistent', (_id, p) => {
    expect(p.name && p.client && p.role && p.summary).toBeTruthy()
    expect(employers.some((e) => e.id === p.employerId), `employerId "${p.employerId}" not in experience.json`).toBe(true)
    expect(organizations.some((o) => o.id === p.clientId), `clientId "${p.clientId}" not in organizations.json`).toBe(true)
    expect(p.technologies.length).toBeGreaterThan(0)
    if (p.start) expect(p.start).toMatch(YM)
    else expect(p.duration, 'give a duration when start is null').toBeTruthy()
    if (p.end) expect(p.end).toMatch(YM)
    if (p.caseStudy) expect(caseStudies.some((c) => c.slug === p.caseStudy), `case study "${p.caseStudy}" missing`).toBe(true)
  })
})

describe('case studies', () => {
  it('have unique slugs that point at real projects', () => {
    expect(unique(caseStudies.map((c) => c.slug))).toBe(true)
    for (const c of caseStudies) {
      expect(c.slug).toMatch(/^[a-z0-9-]+$/)
      expect(projects.some((p) => p.id === c.projectId), c.slug).toBe(true)
      expect(c.approach.length && c.result.length).toBeTruthy()
    }
  })
})

describe('certifications', () => {
  it('have unique ids; completed ones have dates, https verify links and existing badges', () => {
    const all = [...certifications, ...certificationsInProgress]
    expect(unique(all.map((c) => c.id))).toBe(true)
    for (const c of certifications) {
      expect(c.issued, c.id).toMatch(YM)
      if (c.verifyUrl) expect(c.verifyUrl, c.id).toMatch(/^https:\/\//)
      for (const l of c.links ?? []) expect(l.url, c.id).toMatch(/^https:\/\//)
      if (c.badge) expect(publicFile(`badges/${c.badge}`), c.badge).toBe(true)
    }
    for (const c of certificationsInProgress) expect(c.expected, `${c.id} needs "expected"`).toBeTruthy()
  })
  it('are sorted newest first', () => {
    const dates = certifications.map((c) => c.issued!)
    expect(dates).toEqual([...dates].sort().reverse())
  })
})

describe('awards', () => {
  it('point at testimonials that exist', () => {
    expect(unique(awards.map((a) => a.id))).toBe(true)
    for (const a of awards) for (const id of a.testimonialIds) expect(testimonials.some((t) => t.id === id), `${a.id} → ${id}`).toBe(true)
  })
  it('include every testimonial at least once', () => {
    const used = new Set(awards.flatMap((a) => a.testimonialIds))
    for (const t of testimonials) expect(used.has(t.id), t.id).toBe(true)
  })
})

describe('testimonials', () => {
  it('have unique ids and an author', () => {
    expect(unique(testimonials.map((t) => t.id))).toBe(true)
    for (const t of testimonials) expect(t.quote.length && t.author.length).toBeTruthy()
  })
})
