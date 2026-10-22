import { expect, test } from '@playwright/test'
import profile from '../../src/content/profile.json' with { type: 'json' }

const SECTIONS = ['overview', 'impact', 'experience', 'projects', 'skills', 'certifications', 'recognition', 'contact']

test('page has one h1, every section, and no images without alt text', async ({ page }) => {
  await page.goto('./')
  await expect(page).toHaveTitle(/Madhuriben Balas/)
  await expect(page.locator('h1')).toHaveCount(1)
  await expect(page.locator('h1')).toContainText('Releases you can trust.')
  for (const id of SECTIONS) await expect(page.locator(`section#${id}`), id).toHaveCount(1)
  await expect(page.locator('img:not([alt])')).toHaveCount(0)
})

test('header CV button downloads a real PDF', async ({ page, request }) => {
  await page.goto('./')
  const cv = page.getByRole('banner').getByRole('link', { name: /Get My CV/ })
  const href = await cv.getAttribute('href')
  const res = await request.get(href!)
  expect(res.status()).toBe(200)
  expect(res.headers()['content-type']).toContain('pdf')
})

test('every CV in the Contact section downloads', async ({ page, request }) => {
  await page.goto('./#contact')
  for (const r of profile.resumes) {
    const link = page.locator('#contact').getByRole('link', { name: new RegExp(r.label.replace(/[()]/g, '\\$&')) })
    await expect(link, r.label).toBeVisible()
    const res = await request.get((await link.getAttribute('href'))!)
    expect(res.status(), r.file).toBe(200)
  }
})

test('counters show the real figures', async ({ page }) => {
  await page.goto('./')
  const stats = page.locator('#overview ul').first()
  await stats.scrollIntoViewIfNeeded()
  await expect(stats).toContainText('4,500+', { timeout: 5000 })
  await expect(stats).toContainText('62%')
})

test('project sector tabs filter the cards', async ({ page }) => {
  await page.goto('./#projects')
  const cards = page.locator('#projects article')
  const all = await cards.count()
  expect(all).toBeGreaterThan(4)
  await page.getByRole('button', { name: 'AI & GenAI' }).click()
  await expect(page.getByRole('button', { name: 'AI & GenAI' })).toHaveAttribute('aria-pressed', 'true')
  await expect(cards).toHaveCount(2)
  await expect(cards.first()).toContainText('Comviva')
  await page.getByRole('button', { name: 'All', exact: true }).click()
  await expect(cards).toHaveCount(all)
})

test('project card expands to show every point', async ({ page }) => {
  await page.goto('./#projects')
  const card = page.locator('#projects article').filter({ hasText: 'Shop Reservation System' })
  const more = card.getByRole('button', { name: /more point/ })
  await more.click()
  await expect(card.getByRole('button', { name: /show less/ })).toHaveAttribute('aria-expanded', 'true')
  await expect(card.locator('li')).toHaveCount(3)
})

test('"How I did it" reveals the case study', async ({ page }) => {
  await page.goto('./#impact')
  const details = page.locator('#impact details').first()
  await details.locator('summary').click()
  await expect(details).toContainText('Problem:')
  await expect(details).toContainText('Result')
})

test('certifications link to the issuer proof pages', async ({ page }) => {
  await page.goto('./#certifications')
  const proofs = page.locator('#certifications').getByRole('link', { name: /Inspect proof/ })
  expect(await proofs.count()).toBeGreaterThanOrEqual(5)
  for (const href of await proofs.evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href))) expect(href).toMatch(/^https:\/\//)
  await expect(page.locator('#certifications')).toContainText('97.82%')
})

test('contact form explains each missing field', async ({ page }) => {
  await page.goto('./#contact')
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByText('Enter your name.')).toBeVisible()
  await expect(page.getByLabel('Your name')).toBeFocused()
})

test('header highlights the section on screen', async ({ page, isMobile }) => {
  test.skip(isMobile, 'section pills are in the mobile menu')
  await page.goto('./')
  await page.locator('#skills').scrollIntoViewIfNeeded()
  await page.evaluate(() => document.getElementById('skills')!.scrollIntoView())
  await expect(page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Skills' })).toHaveAttribute('aria-current', 'true')
})

test('mobile menu opens, closes with Escape and navigates', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only')
  await page.goto('./')
  const toggle = page.getByRole('button', { name: 'Open menu' })
  await toggle.click()
  const menu = page.locator('#mobile-nav')
  await expect(menu).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
  await toggle.click()
  await menu.getByRole('link', { name: 'Certifications' }).click()
  await expect(menu).toBeHidden()
  await expect(page.locator('#certifications-heading')).toBeInViewport()
})

test('copy button confirms the copy', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium')
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('./#contact')
  await page.getByRole('button', { name: 'Copy Email' }).click()
  await expect(page.getByRole('button', { name: 'Copy Email' })).toContainText('Copied')
})

test('with reduced motion everything is shown at once', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  await page.goto('http://localhost:4173/')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  const hidden = await page.locator('.reveal').evaluateAll((els) => els.filter((e) => getComputedStyle(e).opacity === '0').length)
  expect(hidden).toBe(0)
  await ctx.close()
})

test('a logo that fails to load falls back to the initials badge', async ({ page }) => {
  await page.route('**/logos/comviva.png', (r) => r.abort())
  await page.goto('./#experience')
  await expect(page.locator('#experience').getByRole('img', { name: 'Comviva', exact: true }).first()).toBeVisible()
})

test('no page scrolls sideways', async ({ page }) => {
  await page.goto('./')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test('text keeps its colours even when a host page styles <body>', async ({ page }) => {
  await page.goto('./')
  await page.addStyleTag({ content: 'body { color: #00ff00; background: #000; }' })
  const [color, bg] = await page.locator('body').evaluate((el) => [getComputedStyle(el).color, getComputedStyle(el).backgroundColor])
  expect(color).toBe('rgb(0, 0, 0)')
  expect(bg).toBe('rgb(5, 8, 6)')
})

test('hero particle animation draws and moves', async ({ page }) => {
  await page.goto('./')
  const canvas = page.locator('#overview canvas')
  await expect(canvas).toHaveCount(1)
  const sample = () => canvas.evaluate((c: HTMLCanvasElement) => {
    const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data
    let lit = 0, sum = 0
    for (let i = 3; i < d.length; i += 4 * 7) { if (d[i] > 10) lit++; sum += d[i] * (i % 997) }
    return { lit, sum }
  })
  const a = await sample()
  expect(a.lit, 'canvas is empty').toBeGreaterThan(50)
  await page.waitForTimeout(600)
  const b = await sample()
  expect(b.sum, 'canvas did not change between frames').not.toBe(a.sum)
})

test('every certification badge image loads', async ({ page }) => {
  await page.goto('./#certifications')
  const imgs = page.locator('#certifications img[src*="badges/"]')
  expect(await imgs.count()).toBeGreaterThanOrEqual(8)
  for (const img of await imgs.all()) {
    await img.scrollIntoViewIfNeeded()
    const ok = await img.evaluate(async (el: HTMLImageElement) => {
      el.loading = 'eager'
      if (!el.complete) await new Promise((r) => { el.onload = r; el.onerror = r })
      return el.naturalWidth > 0
    })
    expect(ok, await img.getAttribute('src') ?? '').toBe(true)
  }
})

test('page loads without console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  await page.goto('./')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(800)
  expect(errors).toEqual([])
})

test('every section uses the same dark theme', async ({ page }) => {
  await page.goto('./')
  const light = await page.locator('main section').evaluateAll((els) => els
    .filter((s) => { const [r, g, b] = getComputedStyle(s).backgroundColor.match(/\d+/g)!.map(Number); return r + g + b > 120 })
    .map((s) => s.id))
  expect(light, 'sections with a light background').toEqual([])
})

test('experience labels employers and clients separately', async ({ page }) => {
  await page.goto('./#experience')
  const exp = page.locator('#experience')
  const cards = exp.locator('ol > li')
  await expect(cards).toHaveCount(3)
  // every employer card is tagged Employer and names the company as its heading
  for (const card of await cards.all()) await expect(card.locator('.tag-employer')).toHaveText('Employer')
  await expect(cards.first().locator('h3')).toHaveText('SourceFuse Technologies India Pvt. Ltd.')
  await expect(cards.first()).toContainText('My role: Senior Tester – Automation')
  // every client project is tagged Client and names its client
  const projects = exp.locator('details')
  expect(await projects.count()).toBe(8)
  for (const p of await projects.all()) await expect(p.locator('summary .tag-client')).toHaveText('Client')
  await expect(projects.first().locator('summary')).toContainText('Rakuten Mobile, Japan')
})
