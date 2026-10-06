# Migrating to Next.js (App Router)

The static site was built so that it can move to Next.js without a redesign:

- **Content is data.** Everything repeated lives in `assets/data/site-data.js` as one structured object.
- **Components are pure functions.** Each function in `assets/js/components.js` has the signature `(props, data) => htmlString`, with no DOM access. Each maps 1:1 to a React Server Component.
- **Behaviour is isolated.** `assets/js/main.js` holds the small amount of interactivity. Each part becomes a client component or hook.
- **Styles are tokenized.** `styles.css` uses CSS custom properties and BEM-ish class names that move directly into CSS Modules or a global stylesheet.

## 1. Recommended App Router structure

```
markets-decoded/
├── app/
│   ├── layout.tsx                 <html>, fonts (next/font), <SiteHeader/>, <SiteFooter/>, default metadata
│   ├── page.tsx                   Home
│   ├── services/page.tsx
│   ├── industries/page.tsx
│   ├── results/page.tsx
│   ├── results/[slug]/page.tsx    (optional) one page per case study, generateStaticParams
│   ├── insights/page.tsx
│   ├── insights/[slug]/page.tsx   Article pages from MDX once content is published
│   ├── about/page.tsx
│   ├── locations/page.tsx
│   ├── careers/page.tsx
│   ├── contact/page.tsx
│   ├── contact/actions.ts         Server Action for the form (replaces Formspree, optional)
│   ├── not-found.tsx              ← 404.html
│   ├── sitemap.ts                 Generated from routes + content
│   ├── robots.ts
│   └── opengraph-image.tsx        (optional) dynamic OG images; or keep public/og-image.png
├── components/
│   ├── layout/   SiteHeader.tsx, MegaMenu.tsx, MobileDrawer.tsx ('use client'), SiteFooter.tsx
│   ├── ui/       Logo.tsx, Icon.tsx, Button.tsx, TextLink.tsx, Art.tsx, Media.tsx
│   └── sections/ ResultsBand.tsx, PracticesGrid.tsx, PracticeCard.tsx, PracticeDetail.tsx,
│                 OfferLadder.tsx, CaseStudyCard.tsx, CaseStudyGrid.tsx,
│                 CaseStudyDetail.tsx, InsightCard.tsx, InsightsGrid.tsx, InsightFilters.tsx ('use client'),
│                 FeaturedInsight.tsx, NewsletterPanel.tsx, IndustryCard.tsx, IndustriesGrid.tsx,
│                 TriggerGrid.tsx, SponsorList.tsx, PillarsList.tsx, ApproachSteps.tsx, TeamCard.tsx,
│                 TeamGrid.tsx, ExpertNetwork.tsx, LocationsMap.tsx, LocationsList.tsx, OpenRoles.tsx,
│                 ValuesList.tsx, CTABanner.tsx, ContactForm.tsx ('use client')
├── content/                       ← site-data.js split into files (see §3)
├── lib/
│   ├── content.ts                 Typed loaders: getPractices(), getCaseStudies(), …
│   └── hooks/useReveal.ts, useCountUp.ts
├── styles/
│   ├── tokens.css                 :root variables from styles.css §1
│   └── globals.css                (or one CSS Module per component)
└── public/
    └── assets/img/                favicon.svg, logo.svg, og-image.png, real photography
```

## 2. Component-to-file mapping

| `components.js` function | Next.js file | Server/Client | Notes |
|---|---|---|---|
| `Icon` | `components/ui/Icon.tsx` | Server | Or swap for an icon library |
| `Logo` | `components/ui/Logo.tsx` | Server | Keep as inline SVG |
| `Art` | `components/ui/Art.tsx` | Server | Deterministic from `seed`; replace the module-level `uid` counter with `useId()` |
| `Media` | `components/ui/Media.tsx` | Server | Render `next/image` when `media[slot].src` exists, otherwise `<Art/>` |
| `Button`, `TextLink` | `components/ui/Button.tsx`, `TextLink.tsx` | Server | Use `next/link` |
| `SiteHeader` | `components/layout/SiteHeader.tsx` | Server shell | `active` comes from `usePathname()` inside a small client `NavLink` |
| `MegaMenu` | `components/layout/MegaMenu.tsx` | **Client** | Port `initMegaMenu()` (hover intent, Escape, outside click) |
| `MobileDrawer` | `components/layout/MobileDrawer.tsx` | **Client** | Port `initDrawer()` (focus trap, scroll lock); consider Radix Dialog |
| `SiteFooter` | `components/layout/SiteFooter.tsx` | Server | |
| `ResultsBand` | `components/sections/ResultsBand.tsx` | Server + client `CountUp` | Port `countUp()` into `useCountUp` |
| `PracticeCard` / `PracticesGrid` | `sections/PracticeCard.tsx` / `PracticesGrid.tsx` | Server | |
| `PracticeDetail` / `PracticeDetails` | `sections/PracticeDetail.tsx` | Server | |
| `OfferLadder` | `sections/OfferLadder.tsx` | Server | `compact` prop is unchanged |
| `CaseStudyCard`, `CaseStudyGrid`, `CaseStudyDetail`, `CaseStudyList` | `sections/CaseStudy*.tsx` | Server | `CaseStudyDetail` can become `results/[slug]/page.tsx` |
| `InsightCard`, `InsightsGrid`, `FeaturedInsight`, `NewsletterPanel` | `sections/Insight*.tsx` etc. | Server | |
| `InsightFilters` | `sections/InsightFilters.tsx` | **Client** | Port `initFilters()`; hold filter state in the URL (`?type=`) |
| `IndustryCard`, `IndustriesGrid`, `TriggerGrid`, `SponsorList` | `sections/*.tsx` | Server | |
| `PillarsList`, `ApproachSteps` | `sections/*.tsx` | Server | |
| `TeamCard`, `TeamGrid`, `ExpertNetwork` | `sections/*.tsx` | Server | `next/image` for real portraits |
| `LocationsMap`, `LocationsList` | `sections/*.tsx` | Server | Pure SVG |
| `OpenRoles`, `ValuesList` | `sections/*.tsx` | Server | |
| `CTABanner` | `sections/CTABanner.tsx` | Server | |
| `ContactForm` | `sections/ContactForm.tsx` | **Client** | Port `initContactForm()`; use a Server Action or keep Formspree |
| `main.js → render()` | *(removed)* | n/a | JSX replaces `data-component` slots |
| `main.js → initReveal()` | `lib/hooks/useReveal.ts` + `<Reveal>` wrapper | Client | Or use CSS `animation-timeline: view()` |

**Translating a component.** The template strings convert almost directly to JSX:

```js
// components.js
function PracticeCard(props) {
  var p = props.practice;
  return '<article class="practice-card reveal">' +
    '<h3 class="practice-name"><a href="services.html#' + p.id + '" class="stretched">' + esc(p.name) + '</a></h3>' + …
}
```

```tsx
// components/sections/PracticeCard.tsx
import Link from 'next/link';
import type { Practice } from '@/lib/content';

export function PracticeCard({ practice: p, featured }: { practice: Practice; featured?: boolean }) {
  return (
    <article className={`practice-card reveal${featured ? ' practice-card--featured' : ''}`}>
      <h3 className="practice-name">
        <Link href={`/services#${p.id}`} className="stretched">{p.name}</Link>
      </h3>
      …
    </article>
  );
}
```

The checklist for each component:
- `class=` becomes `className=`
- `esc()` is no longer needed, because React escapes text
- `.html` links become routes (`services.html#x` → `/services#x`)
- the `data` argument becomes an import from `lib/content.ts`.

**Page bodies.** Each `*.html` file's `<main>` becomes `app/<route>/page.tsx`. Static headings stay as JSX, and each `<div data-component="X" data-props='{…}'>` becomes `<X {...props} />`. Each `<head>` block becomes a `metadata` export:

```ts
export const metadata: Metadata = {
  title: 'Services | Markets Decoded Inc.',
  description: '…',
  alternates: { canonical: '/services' },
  openGraph: { images: ['/assets/img/og-image.png'] },
};
```

Set `metadataBase: new URL('https://www.marketsdecoded.com')` once in `app/layout.tsx`.

## 3. From `site-data.js` to content

### Option A: JSON in the repo (simplest, recommended first)

Split the object by top-level key:

```
content/
  site.json            ← site
  navigation.json      ← navigation, footer
  metrics.json         ← metrics
  practices.json       ← practices
  offers.json          ← offers
  case-studies.json    ← caseStudies
  industries.json      ← industries, triggers, sponsorTypes
  insights.json        ← insights (metadata only)
  about.json           ← pillars, approachSteps, team, expertNetwork
  locations.json       ← locations
  careers.json         ← careers
  contact.json         ← contact
  media.json           ← media slots
```

You can do the split with a short Node script, because `site-data.js` also exports via `module.exports`:

```js
const data = require('./02_Website/assets/data/site-data.js');
const fs = require('fs');
for (const [k, v] of Object.entries(data)) fs.writeFileSync(`content/${k}.json`, JSON.stringify(v, null, 2));
```

Add TypeScript types (or Zod schemas) in `lib/content.ts` and load the files with `import practices from '@/content/practices.json'`.

### Option B: MDX for long-form content

Use MDX for anything with body copy, such as insights articles and, later, full case studies. Each record's metadata moves into frontmatter:

```
content/insights/100-day-cash-playbook.mdx
---
title: The 100-Day Cash Playbook
type: Playbook
practiceId: financial
status: coming-soon
summary: How operating partners can release working capital…
publishedAt: 2027-01-15
---
Article body…
```

Load these with `@next/mdx`, Contentlayer/Velite or `next-mdx-remote`. Generate `app/insights/[slug]/page.tsx` with `generateStaticParams()`. Case studies can follow the same pattern (`content/case-studies/*.mdx`), with `challenge`, `approach[]`, `impact[]` and `metric` in frontmatter and an optional narrative body.

### Option C: Headless CMS (once non-developers edit content)

Each top-level key becomes a CMS model. This works with Sanity, Contentful, Payload or Storyblok.

| site-data key | CMS model | Key fields |
|---|---|---|
| `practices` | Practice | id (slug), name, short, number, summary, description, services[], outcomes[], hero |
| `offers` | Offer | tier, name, label, duration, purpose, items[], highlight |
| `caseStudies` | Case Study | slug, title, focus → ref Practice, industry → ref Industry, metric{value,label}, challenge, approach[], impact[], featured |
| `insights` | Insight | slug, type, title, summary, practice → ref, status, body (rich text), publishedAt |
| `industries` | Industry | slug, name, tier, summary, levers[], case → ref |
| `team` | Person | name, role, location, bio, photo |
| `locations` | Location | city, region, country, type, note, lat, lng, labelPos |
| `careers.roles` | Job | title, location, type, summary |
| `metrics` | Proof Metric | value, suffix, label, context, case → ref |
| `site`, `navigation`, `footer`, `media` | Singletons (Site Settings) | |

Fetch the content in Server Components and use `revalidateTag` from a CMS webhook so publishing goes live without a redeploy.

## 4. Behaviour and styling notes

- **Fonts.** Replace the Google Fonts `<link>` with `next/font/google` (`Fraunces`, `Inter`) and expose them as CSS variables (`--font-serif`, `--font-sans`). The tokens in `styles.css` already read those variables.
- **Images.** `Media` should render `next/image` with `fill` and `sizes`. Keep `<Art/>` as the fallback so empty slots still look designed.
- **Reveal and count-up.** Run these in a `'use client'` `<Reveal>` wrapper using IntersectionObserver, and keep the `prefers-reduced-motion` guard. The `.js .reveal` CSS gate becomes a class that `layout.tsx` adds from a tiny inline script, or you can drop it and animate only after hydration.
- **Contact form.** Keep the `FORM_ENDPOINT` approach, or replace it with a Server Action that validates input (Zod) and sends email through Resend or Postmark. Keep the honeypot. Add rate limiting.
- **SEO.** Add `app/sitemap.ts` and `app/robots.ts`, and move the home page's `ProfessionalService` JSON-LD into `app/page.tsx`.
- **Redirects.** Map the old `.html` URLs to the new routes in `next.config.js` (`/services.html` → `/services` and so on) so existing links and indexed URLs keep working.
