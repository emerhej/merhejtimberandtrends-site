# merhejtimberandtrends-site

Website for **Merhej Timber & Trends s.a.r.l.** — carpentry hardware and fittings imported for Lebanon — at merhejtimberandtrends.com.

## Structure

```
public/                    The website. This folder is what gets published.
  index.html               Home page
  products/                Products list and one folder per product page
  404.html, robots.txt, sitemap.xml
  assets/css/tokens.css    Generated from the design system — do not edit
  assets/css/components.css  Copied from the design system — do not edit
  assets/css/site.css      Site layout (header, footer, grids, page sections), tokens only
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

The site is published with **GitHub Pages**. `.github/workflows/pages.yml` uploads `public/` and deploys it on every push to `main` (or run it by hand from the Actions tab).

One-time setup in the repository settings:

1. The repository must be **public**, or the account must be on GitHub Pro — GitHub Pages is not available for private repositories on GitHub Free.
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. Settings → Pages → Custom domain: `merhejtimberandtrends.com`, then configure DNS at GoDaddy, then tick **Enforce HTTPS** once it becomes available.

Because the deployment runs from a workflow, no `CNAME` file is needed in the repo.

## Changing the design

Change the design system first, then follow `design-system/README.md` to sync it here.
