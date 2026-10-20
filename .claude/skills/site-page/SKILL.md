---
name: site-page
description: Use for any change to a page of merhejtimberandtrends.com — wording, sections, a new page, the header, footer or navigation — so the English and Arabic versions stay in step.
---

# Changing or adding a page

The site has two parallel sets of pages with the same structure:

| English | Arabic |
| --- | --- |
| `public/index.html` → `/` | `public/ar/index.html` → `/ar/` |
| `public/products/index.html` | `public/ar/products/index.html` |
| `public/products/<slug>/index.html` | `public/ar/products/<slug>/index.html` |
| `public/404.html` (one file, both languages: `lang-en` and `lang-ar` blocks, chosen by the address) | |

English pages contain only English. Arabic pages are written in Arabic, keeping in Latin only the brand name (`Merhej Timber & Trends`), the domain and measurement values. Never put an Arabic line back on an English page.

## Steps

1. Read `CLAUDE.md`. For anything visual, also read the design system's `project/README.md` (Artifact tool, `action: "read"`, url in `CLAUDE.md`, `path: "project/README.md"`).
2. Make the change in **both** files of the pair, in the same commit. Same sections, same element ids, same links (each in its own language), same numbers. Write the Arabic fresh, following `arabic.md` in this folder; reuse its glossary so terms stay the same across pages.
3. A change to the header or footer goes on **every** page of that language (and in both blocks of `404.html`). Find them with `grep -l 'site-header' -r public`.
4. For a new page, copy the nearest page at the same folder depth in each language, then update in both:
   - `<title>`, `<meta name="description">`, `og:title`, `og:description`
   - `canonical` and `og:url` (its own address), the three `hreflang` links (`en`, `ar`, `x-default` = English), `og:locale` (`en_US` / `ar_LB`)
   - the header's language link `<a class="nav-lang">` → the twin page, relative path
   - `aria-current="page"` in the nav, and the breadcrumb
   - add both addresses to `public/sitemap.xml`, each `<url>` carrying both `xhtml:link` alternates (copy an existing pair)
5. Relative links only (except `404.html`, which uses absolute `/...` links because it is served at any depth). Layout CSS goes in `public/assets/css/site.css`, design-system variables only; Arabic-specific rules sit at the end of that file under `:lang(ar)`.
6. Design for phones first (most visitors in Lebanon browse on a phone) — see "Phones" below.
7. Run `node scripts/check-site.mjs` and fix everything it reports. It checks the pairing, metadata, Arabic leaking into English pages, degree signs in Arabic, header/footer consistency, links and anchors, colours and the sitemap.
8. Publish with the `site-publish` skill (phone check, screenshots of both languages, commit, push, check the live site).

## Phones

The layout is phone-first: base CSS is for a 320px-wide phone, and `@media (min-width: …)` adds columns. Breakpoints in use: 360px (brand name appears), 600px (two-column grids), 720px (one-row header, two-column product page), 900px (wide hero, three-column grids).

- **Header**: brand, then `<nav class="nav">` with the page links, then `<a class="nav-lang">` *after* `</nav>`. Under 720px the nav becomes a row of full-width tabs under the logo, with the language link beside the logo. Keep the nav to three or four short links; anything more needs a menu design first.
- **Tap targets** (links, buttons) are at least 44 × 44px and 8px apart, unless they are links inside a sentence. Use `mtt-btn` for actions; standalone links in lists get `display: inline-flex; min-height: 44px` (see footer and breadcrumb rules in `site.css`).
- **No fixed widths**: use `max-width`, `%`, grid or flex. Nothing may make the page scroll sideways at 320px. Long values (measurements) keep units with `&nbsp;` (`3.0&nbsp;mm`, `Ø&nbsp;22.8`) so they break in sensible places.
- **Text** at least 12px, and inputs 16px (iPhones zoom into smaller fields). Never block zooming in the viewport tag.
- **Images** carry `width` and `height` attributes; large photos get `loading="lazy"` unless they are the first thing on screen.
- **Product pages**: under 720px the order is name → photo → description and "Request a quote" → features → diagram → specs, set in `site.css` with `display: contents` and `order`. A new product page uses the same markup so it gets the same order.
- **Diagrams** keep text out of the drawing where possible (use a legend under it, `.dg-legend`), and numbers in the drawing use `.dg-text`, which `site.css` enlarges on phones.
- Primary buttons go full width on phones (`.hero-actions`, `.product-actions`).

## Don't

- Don't invent product facts or contact details; the owner has not given a phone, WhatsApp, email, address or Instagram handle yet. Contact blocks say the details are being added.
- Don't add prices, a cart or "Buy" buttons. Calls to action: Request a quote / اطلب عرض سعر, Ask on WhatsApp / اسألونا على واتساب, Visit us / زورونا.
- Don't add a framework or build step; pages are plain HTML.
