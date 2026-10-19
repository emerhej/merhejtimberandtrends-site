---
name: site-product
description: Use to add, update or remove a product on merhejtimberandtrends.com from the Product Catalogue sheet, in English and Arabic, or to check the site's products against the sheet.
---

# Products from the catalogue

The **Product Catalogue** Google Sheet is the only source of product facts:
file id `1V62I7uqkPpWDLCijkyvWxU_I7jsxgfrgEjPiKjujK7M`, in the "Merhej Timber and Trends" Drive folder → 02 Products.
The site does not read it automatically; this skill copies it across by hand.

## 1. Read the sheet

Use the Google Drive connector (`read_file_content` with the id above). Columns:
SKU · Product name (EN) · Product name (AR) · Category · Short description · Key spec 1–3 · Colours / finishes · Photo folder · Status · Show on website · New arrival · Price (USD) — for later · Notes.

- Only rows with **Show on website = Yes** appear on the site. A row switched to No is removed (step 4).
- Never invent or round a spec. If a value is missing or unclear, leave it out and tell the owner.
- Status = Draft is still shown when Show on website = Yes; mention in your reply that its specs are provisional (the Notes column says why).
- Price is not shown (no online selling yet).
- If the Drive connector is not connected, say so and ask the owner to connect it or paste the row; don't work from memory.

## 2. Where a product appears

| Place | English | Arabic |
| --- | --- | --- |
| Product page | `public/products/<slug>/index.html` | `public/ar/products/<slug>/index.html` |
| Card on the products list, under its category heading | `public/products/index.html` | `public/ar/products/index.html` |
| Card on the home page "Featured" grid (New arrival = Yes, newest first, at most 3) | `public/index.html` | `public/ar/index.html` |
| Footer "Explore" list (Products, then up to 3 product pages) | every English page + `404.html` | every Arabic page + `404.html` |
| Sitemap | both addresses with alternates in `public/sitemap.xml` | |

`<slug>` is the English name in lower-case words joined by hyphens (`hydraulic-hinge`); the Arabic page uses the same slug.
Copy `products/hydraulic-hinge/` (both languages) as the template for a new product page, then follow the `site-page` skill's new-page list.

## 3. Mapping sheet → page

| Sheet | Card (`mtt-card`) | Product page |
| --- | --- | --- |
| Category | `mtt-card-cat`, category `<h2>` on the list | eyebrow, breadcrumb parent |
| Product name (EN) / (AR) | `mtt-card-name` on the matching language | `<h1>`, `<title>`, breadcrumb |
| Short description | `mtt-card-sum` | basis of the lead paragraph and meta description |
| Key spec 1–3 | `mtt-card-specs` (label → `<dt>`, value → `<dd dir="ltr">`) | rows of the `mtt-spec` table |
| Colours / finishes | — | category badge ("Black · Silver") and Colours row |
| New arrival = Yes | `mtt-badge-new` "New arrival" / "وصل حديثاً" | same badge |
| Notes | facts in it (e.g. hinge width) may go in the spec table; the rest is internal | |

- English: product name in Title Case, everything else sentence case.
- Arabic: name exactly as in the AR column; labels from the glossary in `../site-page/arabic.md`; write the Arabic description fresh (the sheet has no Arabic description column yet), and tell the owner in your reply that it is new Arabic copy for them to review.
- Values with a degree sign inside Arabic text: `<span dir="ltr">170°</span>`.
- Card spec labels stay short: Size / المقاس, Load / الحمولة, Opening / زاوية الفتح.

## 4. Removing a product

Delete both product folders, its cards on both list and home pages, its footer links (every page, both languages, and both blocks of `404.html`) and both sitemap entries. If a category is left empty, remove its heading too. Keep the "More products on the way" tile when the grid would otherwise be a single card.

## 5. Photos

Photos live in the row's Photo folder on Drive. Follow the design system's imagery rules (ivory/white seamless, square 1:1, product ~70% of the frame; no supplier photos with foreign text or watermarks). Save web versions to `public/assets/img/products/<slug>/` (WebP or JPEG, about 1200 px square), replace the "Photo coming soon" placeholder on both language pages, and give each image an `alt` in its page's language.

## 6. Finish

`node scripts/check-site.mjs` (it compares spec numbers between the two languages), then the `site-publish` skill. In your reply, list what changed per product and anything in the sheet that looked incomplete.
