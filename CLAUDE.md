# Working on this repo

This is the website for Merhej Timber & Trends s.a.r.l. (merhejtimberandtrends.com): carpentry hardware imported from China and sold in Lebanon. All website work happens in this repo.

## Design system
- Every page follows the Merhej Timber & Trends design system: https://claude.ai/artifact/GcdcUnbKB4fUmmYyLgXnSW. Read its `project/README.md` before designing anything.
- Page layout lives in `public/assets/css/site.css`; it may only use design-system variables.
- Use only the tokens in `design-system/tokens.json` (as CSS variables from `public/assets/css/tokens.css`) and the `mtt-` classes from `components.css`. No hard-coded colours, font sizes or spacing.
- Never edit `public/assets/css/tokens.css` or `components.css` by hand. Change `design-system/`, then run `node scripts/sync-design-system.mjs`. If the design system artifact changed, copy its `tokens.json` and `components/bundle.css` here first.
- Use the logo file as supplied; never redraw the mark.

## Site rules
- Plain static HTML/CSS in `public/`; no framework or build step unless the owner agrees to one. Hosted on GitHub Pages: `.github/workflows/pages.yml` deploys `public/` on every push to `main`. Use relative links between pages and assets so the site works on any host. Add every new page to `public/sitemap.xml`.
- Bilingual: English first, Arabic product names under English ones; Arabic blocks use `lang="ar" dir="rtl"`.
- No online selling yet (planned in about two years): calls to action are "Request a quote", "Ask on WhatsApp", "Visit us". No cart or prices unless asked.
- Products come from the Product Catalogue sheet in the "Merhej Timber and Trends" Google Drive folder (02 Products); show only rows with "Show on website" = Yes. Never invent specs.
- Pages must work at phone width first; check contrast stays as the design system specifies.
