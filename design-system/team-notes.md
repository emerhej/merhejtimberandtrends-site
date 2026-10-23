# Website

- **Code:** GitHub repo `emerhej/merhejtimberandtrends-site`, branch `main`. Plain static HTML and CSS in `public/`, no build step.
- **Hosting:** GitHub Pages. `.github/workflows/pages.yml` runs `scripts/check-site.mjs`, then deploys `public/` on every push to `main`. Custom domain merhejtimberandtrends.com (DNS at GoDaddy), `www` included, over HTTPS.
- **Languages on separate pages:** English at `/`, `/products/`, `/products/hydraulic-hinge/`; Arabic at `/ar/`, `/ar/products/`, `/ar/products/hydraulic-hinge/` (right to left). Each page links to its twin. English pages carry no Arabic. `404.html` holds both languages.
- **Brand book difference:** the brand book says Arabic product names go under the English ones. That still applies to social posts, which pair both languages. On the website, Arabic is on its own pages instead.
- **Phone first:** every page is checked at 320, 360, 390, 414 and 768px wide. On phones the header is two rows (logo and language switch, then full-width menu tabs). Product pages show the name first, then photo, description, quote button, features, diagram and specs. Two columns from 720px.
- **How the site uses the design system:** colours and sizes are CSS variables named as in `tokens.json` (`var(--forest)`), type styles are classes prefixed `t-` (`t-h2`), and components are plain HTML with `mtt-` classes.
- **Products:** the Product Catalogue sheet in Drive (02 Products) is the source of truth. The site does not read it automatically; product pages are updated by hand when it changes. Only rows with "Show on website" = Yes appear. Specs are never invented.
- **No online selling yet** (planned in about two years): calls to action ask for contact ("Request a quote", "Ask on WhatsApp", "Visit us"). No cart or prices.
- **Still missing from the owner:** phone and WhatsApp number, email, address, Instagram handle, product photos, any official Arabic company name. Contact sections say details are being added. The Arabic copy has not yet been reviewed by a native speaker.
- **Working rules for Claude sessions:** `CLAUDE.md` and the skills in `.claude/skills/` (site-page, site-product, site-design-sync, site-publish).

# Google Drive folder

The working folder is "Merhej Timber and Trends" in Google Drive. It is private: only people it is shared with can open these links.

| Folder | What goes there | Link |
| --- | --- | --- |
| Merhej Timber and Trends | Root, with a "READ ME — How this folder works" doc | [open](https://drive.google.com/drive/folders/1bS4fVjMerE31IbGl6zzqc31PwCuh_96O) |
| 01 Brand | Brand files and this brand pack; Logo subfolder holds `merhej-logo-ivory.png` | [open](https://drive.google.com/drive/folders/13X-6gjF1-LCM54GKsfT9abTBBmuvop_I) |
| 01 Brand / Logo | The logo files | [open](https://drive.google.com/drive/folders/1DuMvBGFdmGFBjjLLovrejUxg_K667vFE) |
| 02 Products | Product Catalogue sheet and one folder per product | [open](https://drive.google.com/drive/folders/1TJiV-G6-J1XifNEDNV0JhiH7GR74hffY) |
| 02 Products / Hinges / Hydraulic Hinge | Hydraulic Hinge files (no photos yet) | [open](https://drive.google.com/drive/folders/1X75-Qc3NeONGvjN9S2RVgB8otBg9gTo2) |
| 03 Website | Website material | [open](https://drive.google.com/drive/folders/11HiiZrPFcbbIVkEgch9OKXnWL6cXG3cb) |
| 04 Marketing | Marketing material | [open](https://drive.google.com/drive/folders/1iKu2E0eKhZd19q4sGUTl7ZYNpQO-iAEP) |
| 05 Social Media / Instagram | One folder per post, named "YYYY-MM Topic" (first: "2026-09 Hydraulic Hinge carousel") | [open](https://drive.google.com/drive/folders/11tT6Im-HFpUJ5l0kRVyzkzA4cMpMNy54) |

- **Product Catalogue sheet:** [open](https://docs.google.com/spreadsheets/d/1V62I7uqkPpWDLCijkyvWxU_I7jsxgfrgEjPiKjujK7M). The source of truth for products. The Hydraulic Hinge row (MTT-HNG-001) is still a Draft with specs taken from the Instagram carousel, pending the supplier sheet. The sheet has no Arabic description column yet.
- A few original files at the root (the first logo and the first Instagram carousel images) belong to another account and could not be moved; copies live in the new folders.
