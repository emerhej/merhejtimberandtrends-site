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
6. Run `node scripts/check-site.mjs` and fix everything it reports. It checks the pairing, metadata, Arabic leaking into English pages, degree signs in Arabic, header/footer consistency, links and anchors, colours and the sitemap.
7. Publish with the `site-publish` skill (screenshots of both languages, commit, push, check the live site).

## Don't

- Don't invent product facts or contact details; the owner has not given a phone, WhatsApp, email, address or Instagram handle yet. Contact blocks say the details are being added.
- Don't add prices, a cart or "Buy" buttons. Calls to action: Request a quote / اطلب عرض سعر, Ask on WhatsApp / اسألونا على واتساب, Visit us / زورونا.
- Don't add a framework or build step; pages are plain HTML.
