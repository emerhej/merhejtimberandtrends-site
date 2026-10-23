# Working on this repo

This is the website for Merhej Timber & Trends s.a.r.l. (merhejtimberandtrends.com): carpentry hardware imported from China and sold in Lebanon. All website work happens in this repo.

## Design system
- Every page follows the Merhej Timber & Trends design system: https://claude.ai/artifact/GcdcUnbKB4fUmmYyLgXnSW. Read its `project/README.md` before designing anything.
- Page layout lives in `public/assets/css/site.css`; it may only use design-system variables.
- Use only the tokens in `design-system/tokens.json` (as CSS variables from `public/assets/css/tokens.css`) and the `mtt-` classes from `components.css`. No hard-coded colours, font sizes or spacing.
- Never edit `public/assets/css/tokens.css` or `components.css` by hand. Change `design-system/`, then run `node scripts/sync-design-system.mjs`. If the design system artifact changed, copy its `tokens.json` and `components/bundle.css` here first.
- Use the logo file as supplied; never redraw the mark.
- `design-system/BRAND-PACK.md` is the one-file brand pack for teammates and other AI tools, with a copy in Google Drive (01 Brand). It is generated: change `tokens.json`, `brand-book.md` or `team-notes.md`, then run `node scripts/build-brand-pack.mjs`. Update `team-notes.md` when pages, hosting or Drive folders change. See the site-design-sync skill for refreshing the Drive copy.

## Site rules
- Plain static HTML/CSS in `public/`; no framework or build step unless the owner agrees to one. Hosted on GitHub Pages: `.github/workflows/pages.yml` deploys `public/` on every push to `main`. Use relative links between pages and assets so the site works on any host. Add every new page to `public/sitemap.xml` in both languages.
- Two languages on separate pages: English at `public/<path>`, Arabic at `public/ar/<path>` with the same structure, ids, links and numbers. English pages contain no Arabic (apart from the header's language link); Arabic pages have `<html lang="ar" dir="rtl">` and keep only the brand name, domain and measurements in Latin. Every change goes into both languages in the same commit. `404.html` is the one exception: it holds both languages and picks by address.
- No online selling yet (planned in about two years): calls to action are "Request a quote", "Ask on WhatsApp", "Visit us". No cart or prices unless asked.
- Products come from the Product Catalogue sheet in the "Merhej Timber and Trends" Google Drive folder (02 Products); show only rows with "Show on website" = Yes. Never invent specs.
- Phone first: most visitors use phones. Every page must work from 320px wide with 44px tap targets, no sideways scrolling and the page title on the first screen; follow the "Phones" section of `.claude/skills/site-page/SKILL.md`. Check contrast stays as the design system specifies.

## Skills and checks (use them for every website task)
- `.claude/skills/site-page` — any change to a page, the header, footer or nav; `arabic.md` there has the Arabic voice rules and glossary.
- `.claude/skills/site-product` — adding, updating or removing products from the Product Catalogue sheet.
- `.claude/skills/site-design-sync` — bringing design system changes into the site.
- `.claude/skills/site-publish` — checks, screenshots, commit, push and confirming the live site.
- `node scripts/check-site.mjs` and `python3 .claude/skills/site-publish/scripts/mobile_check.py` must pass before every commit. When you add a site rule, add a check for it there too.
