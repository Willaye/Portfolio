# Willaye Haider — Studio & Portfolio

A production-grade, single-page business website + portfolio + CV for **Willaye Haider**,
a full-stack developer (websites, web apps, mobile apps, real-time monitoring systems and
AI automation).

Cinematic dark stage, giant metallic wordmark, a live interactive 3D particle hero
(hand-written Canvas 2D), glass/bento cards, scroll reveals, a cursor spotlight, device
mockups, a printable CV page, and four live-switchable accent themes.

## Tech

- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** with design tokens as CSS variables
- **motion** (Framer Motion) is available for reveal animation; the hero particle engine,
  halftone portrait and cursor effects are hand-written Canvas 2D with no animation library
- `next/font` self-hosts Archivo, Instrument Serif, Geist and Geist Mono
- **Vitest** for pure logic, **Playwright** for smoke tests, ESLint + Prettier
- Deploy target: **Vercel**

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build & deploy

```bash
npm run build      # type-checks, lints and builds (content is Zod-validated here)
npm run start      # serve the production build locally
```

Deploy by importing the repo into **Vercel** (zero config) or run `vercel`.
Set your real domain in `site.siteUrl` so canonical URLs, the sitemap, robots and
Open Graph tags are correct.

## Quality checks

```bash
npm test           # Vitest unit tests (shapes, halftone, fit-text, WhatsApp builder, content)
npm run test:e2e   # Playwright smoke tests (shape switcher, contact form, accent persistence)
npm run lint
npm run typecheck
```

## Editing content — one file

Everything the site shows lives in **`src/content/site.ts`**, fully typed and validated
with Zod at build time. Change any text, number, price, project, service, FAQ, stat or CV
entry there and the whole site (home page **and** the `/cv` page) updates — you never touch
components. An invalid edit (e.g. a WhatsApp number with non-digits) fails `npm run build`
with a clear error.

Key fields to make it yours:

- `email`, `whatsapp` (digits only, with country code) and `whatsappLabel`
- `socials` (GitHub / LinkedIn / Instagram links)
- `projects`, `stats`, `plans`, `faq`, and the `cv` block (summary, experience, skills, education)
- `siteUrl` (your live domain)

### Your photo

Drop a portrait photo at **`public/willaye.jpg`** (see `public/README.md`). It is turned into
a live, cursor-reactive **halftone dot portrait** in the hero ("Meet Willaye") and the About
section. If the file is missing, the About section shows your initials instead. Visitors can
also try their own photo with the hero "Add your photo" button — images are processed entirely
in the browser (downscaled and stored in `localStorage`) and **never uploaded anywhere**.

### Accent themes

Four presets (orchid, teal, violet, amber) switch live from the nav swatches and persist in
`localStorage`. Change the default by editing `data-accent="orchid"` in `src/app/layout.tsx`.

## The hero particle engine

A seeded (deterministic) Canvas 2D 3D point cloud that morphs between six developer-themed
shapes — **Web** globe, **Code** `</>`, **Mobile** phone, **Database** cylinder, **Monitor**
bar-chart, and **`{ }` Braces**. Click the canvas or the "Shape" chip to advance; it reacts to
the pointer, auto-advances, pauses when off-screen or when the tab is hidden, caps DPR at 2,
and adaptively lowers the particle count if frames get expensive. With `prefers-reduced-motion`
it renders a single static frame (manual morph still works).

## Contact form (no backend)

The primary button is a `https://wa.me/<number>?text=<brief>` link rebuilt on every input.
Empty name/message is blocked with a toast; "Copy brief" uses the clipboard with a fallback.
To switch to a real API later, replace the send action in
`src/components/sections/ContactForm.tsx` — it is isolated to that one file. (Add a
`/api/contact` route handler with Zod validation, rate limiting and a honeypot.)

## Structure

```
src/
  app/            layout, page, globals.css, cv/, opengraph-image, sitemap, robots
  content/        site.ts (ALL content) + schema.ts (Zod)
  components/     layout/ hero/ sections/ mockups/ ui/
  lib/            particles/ (shapes, engine), halftone, rng, fitText, whatsapp, accent, image
  hooks/          usePointer, useInView, useReducedMotion, useFitText
tests/
  unit/           Vitest
  e2e/            Playwright
```

## Accessibility & SEO

Semantic landmarks, one H1 with an accessible name, visible 2px accent focus rings, keyboard
reachable controls, `aria-label` on the canvas and `aria-hidden` on decorative SVGs, native
`details/summary` FAQ, AA contrast on every accent, plus title/description/canonical,
Open Graph + Twitter cards with a generated OG image, JSON-LD `ProfessionalService`, sitemap
and robots.

## Trade-offs & notes

- **Content is sample data.** Projects, stats, prices, experience and the email/WhatsApp are
  placeholders — replace them in `site.ts`.
- The particle engine starts after first paint and is code-split (`next/dynamic`, client-only)
  so it never blocks the hero's LCP. Home-page first-load JS is ~132 KB (budget 150 KB).
- No real contact backend by design; the WhatsApp hand-off keeps the site fully static and
  free to host, and is a one-file change to upgrade.
- Lighthouse targets (Perf 90+, A11y 100, SEO 100 on mobile) should be run on your Vercel
  deployment; the build is structured to meet them (no layout shift, reserved stage height,
  self-hosted fonts, static export of all routes).
```
