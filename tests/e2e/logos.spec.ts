// Logo visibility check: every employer and client must show a real, loaded logo image,
// not the initials badge.
//   npm run test:logos           -> checks organisations that have a bundled logo file (runs in CI)
//   npm run test:logos:all       -> checks ALL organisations, including ones still missing a logo
import { expect, test } from '@playwright/test'
import orgs from '../../src/content/organizations.json' with { type: 'json' }

const STRICT = !!process.env.LOGO_STRICT

for (const org of orgs as { id: string; name: string; logo?: string; logoUrl?: string }[]) {
  test(`logo visible: ${org.name}`, async ({ page }) => {
    test.skip(!STRICT && !org.logo, 'no bundled logo file yet (run test:logos:all to include)')
    for (const path of ['./']) {
      await page.goto(path)
      const img = page.getByRole('img', { name: `${org.name} logo` }).first()
      // The home page logos scroll continuously, so don't wait for them to stand still
      await img.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {})
      await expect(img, `${org.name}: initials badge shown instead of a logo on ${path}`).toBeVisible({ timeout: 5000 })
      const loaded = await img.evaluate(async (el: HTMLImageElement) => {
        el.loading = 'eager' // lazy images off-screen in the marquee would otherwise never load
        if (!el.complete) await new Promise((r) => { el.onload = r; el.onerror = r })
        return el.naturalWidth > 0
      })
      expect(loaded, `${org.name}: image did not load on ${path}`).toBe(true)
    }
  })
}

import techList from '../../src/content/tech.json' with { type: 'json' }

test('every tool logo in the Skills section loads', async ({ page }) => {
  await page.goto('./#skills')
  const withLogo = (techList as { name: string; logo?: string }[]).filter((t) => t.logo)
  for (const t of withLogo) {
    const img = page.getByRole('img', { name: `${t.name} logo` }).first()
    await img.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {})
    const loaded = await img.evaluate(async (el: HTMLImageElement) => {
      el.loading = 'eager'
      if (!el.complete) await new Promise((r) => { el.onload = r; el.onerror = r })
      if (el.naturalWidth === 0) return 'not loaded'
      // Draw the logo onto white, as it appears on its tile, and count visible (non-white) pixels
      const c = document.createElement('canvas'); c.width = 64; c.height = 64
      const ctx = c.getContext('2d')!
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 64, 64); ctx.drawImage(el, 0, 0, 64, 64)
      const d = ctx.getImageData(0, 0, 64, 64).data
      let ink = 0
      for (let i = 0; i < d.length; i += 4) if (d[i] < 235 || d[i + 1] < 235 || d[i + 2] < 235) ink++
      return ink > 40 ? 'ok' : 'blank on white'
    })
    expect(loaded, `${t.name} logo: ${loaded}`).toBe('ok')
  }
  expect(withLogo.length).toBeGreaterThan(25)
})
