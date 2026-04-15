# Enterprisebrain.eu

Marketing website for **Enterprisebrain.eu** — an enterprise AI product with native SAP integration, developed by [vconsult Gruppe](https://vconsult.at).

## Tech Stack

| | |
|---|---|
| Framework | [Astro 6](https://astro.build) with View Transitions |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first config) |
| Components | Astro + React (contact form) |
| Forms | React Hook Form + Zod |
| Sitemap | `@astrojs/sitemap` (auto-generated on build) |
| Deployment | Vercel |

## Getting Started

**Requirements:** Node.js >= 22.12

```bash
cp .env.example .env   # set SITE_URL
npm install
npm run dev            # http://localhost:4321
npm run build          # production build → dist/
npm run preview        # preview production build locally
```

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `SITE_URL` | Canonical site URL — used for OG tags, sitemap, and JSON-LD | `https://enterprisebrain.eu` |

Copy `.env.example` to `.env` and set `SITE_URL` to your current deployment URL.  
On Vercel, add `SITE_URL` in **Project Settings → Environment Variables**.

`.env` is gitignored. Never commit real values.

## Project Structure

```
src/
├── components/
│   ├── Navbar.astro              # Fixed header with animated mobile menu
│   ├── Footer.astro
│   ├── HeroSection.astro
│   ├── VideoSection.astro        # Click-to-play demo video
│   ├── HowItWorksSection.astro   # 4-step process
│   ├── ProductSection.astro
│   ├── UseCasesPreview.astro     # 6 use case cards (homepage)
│   ├── UseCaseCard.astro         # Individual use case on /use-cases
│   ├── TestimonialsSection.astro
│   ├── SecuritySection.astro     # DSGVO / data security
│   ├── PartnersSection.astro
│   ├── MotivationSection.astro
│   ├── FAQSection.astro          # Animated accordion
│   ├── ContactSection.astro
│   └── ContactForm.tsx           # React form with validation
├── layouts/
│   └── BaseLayout.astro          # HTML shell, SEO meta, JSON-LD, scroll animations
├── pages/
│   ├── index.astro
│   ├── use-cases.astro
│   ├── impressum.astro           # noindex
│   ├── datenschutz.astro         # noindex
│   └── 404.astro
└── styles/
    └── globals.css               # Tailwind @theme, @utility, global styles
public/
├── logo.png
├── og-image.jpg                  # Must be 1200x630px
├── robots.txt
├── partners/                     # Partner/client logos
└── usecases/
    └── ProfitabilityAnalyst.mov  # UC01 demo video
```

## Design System

Defined in `src/styles/globals.css` via Tailwind `@theme`:

| Token | Value |
|---|---|
| `--color-primary` | `#f29202` |
| `--color-secondary` | `#ed9f7b` |
| `--color-carbon` | `#1a1a1a` |
| `--color-ash` | `#6b6b6b` |
| `--color-snow` | `#f8f7f5` |
| `--color-parchment` | `#f0ece6` |
| `--font-display` | Syne |
| `--font-body` | DM Sans |

Key utility classes: `gradient-text`, `gradient-bg`, `btn-primary`, `btn-outline-light`, `section-label`, `section-divider`, `hero-grid`, `dot-grid`

Scroll animations: add `data-animate` to any element. Optional stagger via `data-animate-delay="1"` through `"6"`.

## SEO

- JSON-LD schemas (`Organization` + `WebSite`) in `BaseLayout.astro`
- Open Graph + Twitter Card meta on all pages
- Canonical URL and sitemap derived from `SITE_URL`
- Sitemap auto-generated to `/sitemap-index.xml` on build
- Legal pages (`/impressum`, `/datenschutz`) are `noindex`

## Docker

Build and run the production image:

```bash
docker build -t enterprisebrain .
docker run -p 8080:80 enterprisebrain
# → http://localhost:8080
```

The image is a two-stage build — Node 22 Alpine builds the static site, Nginx Alpine serves it. The `nginx.conf` handles SPA-style routing, static asset caching (1 year, immutable), gzip compression, and the custom 404 page.

## Updating Content

**Partners** — add image to `public/partners/`, add entry to the `partners` array in `PartnersSection.astro` with native `width`/`height` dimensions.

**FAQ** — add entries to the `faqs` array in `FAQSection.astro`.

**Testimonials** — update the `testimonials` array in `TestimonialsSection.astro`.

**New use case** — add `<UseCaseCard>` in `use-cases.astro` (the `num` prop auto-generates the anchor id, e.g. `num="07"` → `id="uc-07"`), then add the matching entry to the `useCases` array in `UseCasesPreview.astro`.

## Contact Form

Posts to `https://api.enterprisebrain.eu/contact`. Validated with Zod, handled by React Hook Form.
