# Markets Decoded Inc. website

A static marketing site for Markets Decoded Inc. It uses plain HTML, CSS and vanilla JavaScript, with no build step and no dependencies apart from Google Fonts. The positioning, practices, offer ladder, case studies and proof metrics come from `../00_Strategy/STRATEGY.md`.

## Preview locally

```bash
cd "02_Website"
python3 -m http.server 8765
# open http://localhost:8765
```

You can also open `index.html` straight from disk, because all scripts are classic `<script>` tags. Using a local server is closer to production, though, since it gives you query strings and clean relative paths.

## Project structure

```
02_Website/
├── index.html            Home
├── services.html         5 practices + offer ladder (durations, no fees)
├── industries.html       Sponsors served, lead/secondary sectors, trigger events
├── results.html          5 anonymized case studies (Focus/Industry/Challenge/Approach/Impact)
├── insights.html         Featured playbook, filterable article cards, newsletter
├── insight-*.html        Seven article pages (static text for SEO), linked from site-data.js → insights:
│     insight-100-day-cash-playbook.html,
│     insight-100-day-plans-day-45.html, insight-sales-comp-ebitda-lever.html,
│     insight-sales-comp-redesign-8-weeks.html, insight-post-merger-culture-checklist.html,
│     insight-portfolio-cyber-hygiene.html
├── about.html            Mission, approach pillars, leadership, expert network, locations
├── locations.html        Toronto HQ + coverage hubs map
├── careers.html          Open roles + "Join our expert network"
├── contact.html          Contact form (placeholder endpoint + mailto fallback)
├── 404.html              Not-found page (wire up in your host)
├── assets/
│   ├── data/site-data.js     ← ALL repeated content lives here
│   ├── js/components.js      Pure render functions (future React components)
│   ├── js/main.js            Renders components + behaviour (menu, drawer, reveal, form)
│   ├── css/styles.css        Design tokens and all styles
│   └── img/                  favicon.svg, logo.svg, og-image.png (1200×630)
├── MIGRATION_TO_NEXTJS.md
└── README.md
```

## Where to edit content

| What | Where |
|---|---|
| Practices, sub-services, outcomes | `assets/data/site-data.js` → `practices` |
| Offer ladder (tiers, durations) | `site-data.js` → `offers` |
| Results band numbers (22% / 15% / 20% / 14%) | `site-data.js` → `metrics` |
| Case studies | `site-data.js` → `caseStudies` |
| Insight cards and "Coming soon" status | `site-data.js` → `insights` (`status: 'coming-soon'` or `'available'` + `href`) |
| Article text | The `insight-*.html` page itself (copy one as a template; article styles are in `styles.css` → section 16) |
| Industries, triggers, sponsor types | `site-data.js` → `industries`, `triggers`, `sponsorTypes` |
| Leadership cards | `site-data.js` → `team` (add `photo: 'assets/img/team/name.jpg'` to replace the placeholder) |
| Locations (footer, map, lists) | `site-data.js` → `locations` |
| Open roles | `site-data.js` → `careers.roles` |
| Navigation and mega menus | `site-data.js` → `navigation` |
| Contact email, LinkedIn URL, domain | `site-data.js` → `site` |
| Page headlines, intros, SEO/OpenGraph tags | The HTML file for that page (kept static for SEO) |
| Colors, fonts, spacing | `assets/css/styles.css` → `:root` tokens |

### Swapping in real photography

Every hero and card image is a named **media slot**. Each slot is rendered as `<div class="media" data-media-slot="…">`, and by default it shows generated SVG art (navy and green square grids that echo the logo). To use a photo instead:

1. Add the image, for example `assets/img/hero-home.jpg`. Use licensed images only.
2. In `site-data.js` → `media`, set the slot: `'home-hero': { src: 'assets/img/hero-home.jpg', alt: 'Describe the image' }`.

Hero slots are `home-hero`, `services-hero`, `industries-hero`, `results-hero`, `insights-hero`, `about-hero`, `locations-hero`, `careers-hero` and `contact-hero`. Card slots follow the patterns `case-<id>`, `insight-<id>`, `industry-<id>` and `team-<id>`. You can add any of these keys to `media` in the same way.

### Contact form

The contact form never posts anywhere until you configure it. In `assets/js/main.js`:

```js
var FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
```

- While `YOUR_FORM_ID` is still in the URL, submitting the form opens the visitor's email app with a pre-filled message to `site.email` (the mailto fallback).
- To go live, create a form on Formspree (or Basin, Getform or similar) and replace the URL. The form then posts `FormData` with `Accept: application/json`. If the request fails, it falls back to mailto.
- A hidden honeypot field (`_gotcha`) filters basic spam bots.
- CTAs can preselect the interest dropdown with `contact.html?interest=<value>`. The values are listed in `site-data.js` → `contact.interests`.

## Deploy

The site is a folder of static files, so any static host will serve it.

**Netlify.** Drag the `02_Website` folder onto app.netlify.com/drop, or connect a repo with the publish directory set to `02_Website` and no build command. Netlify serves `404.html` automatically.

**Vercel.** Run `vercel` inside `02_Website`, or import the repo with Framework preset "Other", no build command and output directory `02_Website`.

**AWS S3 (+ CloudFront).** Create a bucket, enable static website hosting with index document `index.html` and error document `404.html`, then drag and drop the folder contents in the S3 console (or run `aws s3 sync . s3://your-bucket`). Put CloudFront in front for HTTPS.

After deploying:
- Replace `https://www.marketsdecoded.com` in the canonical and OpenGraph tags if the production domain is different. Run a find-and-replace across the `*.html` files and `site-data.js`.
- Set the real `site.email` and `site.linkedin` in `site-data.js`.
- Configure `FORM_ENDPOINT`.
- Add a privacy policy page (and a cookie notice if you add analytics) before collecting form data.

## Quality notes

- **Accessibility.** The site uses semantic landmarks, a skip link and visible focus states (green outline plus navy halo). The mega menu is built from disclosure buttons (`aria-expanded`, Escape closes it). The mobile drawer is a modal dialog with focus trapping. Form errors are linked with `aria-describedby`, and the status region is a live region. Brand green `#6CC24A` is used only for fills, large type and text on dark backgrounds. Small green text on light backgrounds uses `--green-ink #2F7019`, which gives 6.1:1 contrast on white.
- **Motion.** Scroll reveals and count-up numbers are switched off under `prefers-reduced-motion`.
- **Responsive.** Pages were checked at 375px with no horizontal scroll, and on desktop.
- **SEO.** Each page has its own title, description, canonical, OpenGraph and Twitter tags. The home page has `ProfessionalService` JSON-LD. Page headlines and intros are static HTML, and repeated sections are rendered by JavaScript. Google renders JavaScript, but a Next.js migration would make everything server-rendered.
