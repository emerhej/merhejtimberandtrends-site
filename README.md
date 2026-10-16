# merhejtimberandtrends-site

Website for **Merhej Timber & Trends s.a.r.l.** — carpentry hardware and fittings imported for Lebanon — at merhejtimberandtrends.com.

## Structure

```
public/                    The website. This folder is what gets published.
  index.html               Home page (currently a coming-soon page)
  assets/css/tokens.css    Generated from the design system — do not edit
  assets/css/components.css  Copied from the design system — do not edit
  assets/img/              Logo and site images
design-system/             The website's copy of the brand design system (see its README)
scripts/sync-design-system.mjs  Rebuilds public/assets/ from design-system/
```

It is a plain static site: HTML and CSS, no framework and no build step required to publish. Product content comes from the **Product Catalogue** sheet in the "Merhej Timber and Trends" Google Drive folder.

## Preview locally

```
npx serve public
```

## Publishing

Any static host can serve `public/`. The domain is registered at GoDaddy; point its DNS at whichever host is chosen.

- **Cloudflare Pages:** connect this repo, framework preset *None*, build command empty, output directory `public`.
- **Netlify:** connect this repo, build command empty, publish directory `public`.
- **GitHub Pages:** publish `public/` with a Pages workflow (GitHub Actions → *Static HTML*, path `public`).

## Changing the design

Change the design system first, then follow `design-system/README.md` to sync it here.
