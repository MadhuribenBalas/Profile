# Madhuriben Balas – portfolio

My personal portfolio as a single scrolling page: overview, measurable outcomes, experience, projects with sector filters, skills, certifications with proof links, recognition and contact.

Design: colours follow sourcefuse.com (near-black with a green tint, lime #88CB00, white and light-grey bands), Poppins type and pill buttons. Sections alternate dark and light: each `<section>` has `theme-dark` or `theme-light`, and the colour sets live in `src/styles/index.css`.

Motion: an animated particle network and drifting glow behind the hero, words rising into the headline, a typing line of specialities, numbers that count up, blur-to-sharp scroll reveals, a cursor spotlight and gentle 3D tilt on cards, a rotating lime border on the hero card, and a scroll progress bar. All of it switches off for visitors who prefer reduced motion, and the hero animation pauses when it is off screen.

Built with Vite, React, TypeScript and Tailwind CSS, tested with Vitest and Playwright (desktop and mobile), and deployed to GitHub Pages by GitHub Actions only when every test passes. All content lives in JSON files, so updating the site never requires touching code.

## Run it on your computer

You need Node.js 20 or newer (nodejs.org).

```bash
npm install
npm run dev        # opens http://localhost:5173 and reloads as you edit
npm test           # checks all content files and the filter and form logic
npm run build      # makes the production site in dist/
```

## Update the content

Everything is in `src/content/`. After any change, run `npm test`: it reports exactly which entry has a missing field, wrong date format, duplicate id or missing file.

| What | File |
|---|---|
| Name, headline, roles open to (`openTo`), phone (optional), summary, skills, CV downloads, languages, education, achievements | `profile.json` |
| Employers and clients (names, initials, logos) | `organizations.json` |
| Employers (role, highlights, clients) | `experience.json` |
| Awards (titles, dates, which quotes belong to each) | `awards.json` |
| Projects (Projects page and filters) | `projects.json` |
| Case studies | `case-studies.json` |
| Certifications | `certifications.json` |
| Testimonials | `testimonials.json` |

Dates are always written `"YYYY-MM"`, for example `"2026-11"`.

### Add a certification

Add an entry anywhere in `certifications.json`; the page sorts newest first automatically. `code` is the short label on the card and `about` is a one-line description.

```json
{
  "id": "istqb-ctal-tm",
  "name": "ISTQB® Certified Tester Advanced Level – Test Management (CTAL-TM) v3.0",
  "issuer": "GASQ",
  "status": "completed",
  "issued": "2027-03",
  "credentialId": "27-123456",
  "score": "88%",
  "verifyUrl": "https://…the verification page…",
  "badge": "istqb-ctal-tm.png",
  "code": "CTAL-TM",
  "about": "What the certification covers, in one or two sentences."
}
```

`credentialId`, `score`, `verifyUrl` and `badge` are optional. Badges with a transparent background (Databricks, New Relic, AWS) are shown large without a frame; ISTQB badges and `.svg` logos get a white tile. To show a badge, put the PNG in `public/badges/` with the same name. Square-ish images about 300 px wide work best.

### Add a project

Add an entry to `projects.json`. New companies, technologies and roles appear in the filter menus automatically.

```json
{
  "id": "new-project",
  "name": "Payments platform",
  "client": "Client name",
  "clientId": "client-org-id",
  "employerId": "sourcefuse",
  "role": "Senior Tester – Automation",
  "start": "2027-01",
  "end": null,
  "domain": "FinTech",
  "sector": "Banking & FinTech",
  "technologies": ["Playwright", "TypeScript", "Jenkins"],
  "summary": "One or two sentences on what the product is and what you tested.",
  "highlights": ["What you did, one point per line."],
  "metrics": ["Measurable results, e.g. Regression 2 days → 4 hours"]
}
```

- `sector` decides which filter tab the project appears under. A new sector name creates a new tab automatically.
- `employerId` must match an `id` in `experience.json`, and `clientId` an `id` in `organizations.json`. For a new client, add it to `organizations.json` first.
- `"end": null` means "present". If you only know a duration, set `"start": null` and add `"duration": "about 1 year"`.
- Case studies (`case-studies.json`) appear as the "How I did it" panels in the Measurable Outcomes section.

### Add a client or employer logo

Each employer and client is listed once in `organizations.json`. Until a logo is added, the site shows a neutral initials badge (for example **RM** for Rakuten Mobile).

1. Save the logo as a PNG or SVG in `public/logos/`, for example `public/logos/rakuten-mobile.png`. A transparent or white background, about 200 px wide, works best.
2. In `organizations.json`, add `"logo": "rakuten-mobile.png"` to that organisation:
   ```json
   { "id": "rakuten-mobile", "name": "Rakuten Mobile", "initials": "RM", "logo": "rakuten-mobile.png" }
   ```
3. Run `npm test`. It fails if the file name does not match a file in `public/logos/`.

You can also set `"logoUrl"` to a logo on the company's own website. This is less reliable: if the company moves or renames the file, the site quietly falls back to the initials badge. For a permanent logo, open the `logoUrl` in your browser, save the file into `public/logos/`, and set `"logo"` instead.

The logo then appears everywhere that organisation is shown: the client strip, Experience and Projects.

Only use a client's logo if you are allowed to. Many service contracts restrict showing client logos, so check with your employer first.

### Add a tool logo or competency

- **Tools** (logo rows in the Skills section) are listed in `src/content/tech.json` and grouped in `profile.json` under `toolGroups`. Save the logo as an SVG or PNG in `public/tech/` and set `"logo"`; without a logo the tile shows `initials`. Logos should be dark or coloured, because the tiles are white. `npm run test:e2e` fails if a logo is missing or draws nothing visible on white.
- **Competencies** use line icons from Lucide (lucide.dev). Set `"icon"` to an icon name; if it is not yet in `src/lib/icons.ts`, copy its `<path>` lines there from the Lucide website.

### Add a certification that is in progress

Add it with `"status": "in-progress"` and `"expected": "Nov 2026"`. When you pass, change the status to `"completed"` and add `issued`, `credentialId`, `score` and `verifyUrl`.

### Replace the CV files

Overwrite the PDFs in `public/resume/` and keep the same file names, or change the `file` paths in `profile.json`.

## Publish on GitHub Pages (free)

1. Create a free account at github.com and a new **public** repository, for example `portfolio`.
2. Upload this folder to it. Either drag the files into the repository page on github.com, or run:
   ```bash
   git init && git add . && git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/portfolio.git
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages**, and under **Source** choose **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` runs the tests, builds the site and publishes it. After 2–3 minutes it is live at
   `https://<your-username>.github.io/portfolio/`
5. Every later push to `main` re-tests and republishes automatically. If a test fails, the old site stays online.

Tip: name the repository `<your-username>.github.io` and the address becomes `https://<your-username>.github.io/`.

## Contact form

Without any setup, **Send message** opens the visitor's email app with the message filled in.

To receive messages directly in your inbox:

1. Sign up at formspree.io (free plan) and create a form. Copy its endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
2. In GitHub: **Settings → Secrets and variables → Actions → Variables → New repository variable**. Name: `VITE_FORM_ENDPOINT`, value: the endpoint.
3. Re-run the workflow (Actions tab → Test and deploy → Run workflow).

For local testing, copy `.env.example` to `.env` and fill in the same value.

## Tests

| Command | What it checks |
|---|---|
| `npm test` | Every content entry (required fields, dates, ids, links between files, badge and CV files exist), filter logic, form validation |
| `npm run test:e2e` | Real browser, desktop and mobile: every section present, CV downloads, sector tabs, expandable project cards and case studies, proof links, form errors, header highlighting, mobile menu, copy buttons, reduced motion, no sideways scrolling |

| `npm run test:logos` | Every employer and client with a logo file shows a real, loaded image (not the initials badge). Also runs in CI. |
| `npm run test:logos:all` | Same check for **all** organisations; fails for any that still have no logo file. Use it after adding logos to confirm all are visible. |

The first time you run the browser tests locally, install the browser with `npx playwright install chromium`.
