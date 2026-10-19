---
name: site-design-sync
description: Use when the Merhej Timber & Trends design system (colours, type, spacing, component styles, logo) has changed and the website must pick up the change, or to check the site still matches it.
---

# Sync the design system into the site

Source of truth: the Claude artifact "Merhej Timber & Trends" (Design System), https://claude.ai/artifact/GcdcUnbKB4fUmmYyLgXnSW.

1. Read the changed files with the Artifact tool (`action: "read"`, that url):
   - `path: "project/tokens.json"` → copy unchanged to `design-system/tokens.json`
   - `path: "project/components/bundle.css"` → copy unchanged to `design-system/components.css`
   - a new logo → `design-system/assets/logo/` (exactly as supplied)
2. `node scripts/sync-design-system.mjs` — regenerates `public/assets/css/tokens.css` and `components.css` and copies the logo. Never edit those generated files by hand.
3. If a token was renamed or removed, `grep -rn "var(--old-name)" public` and update `site.css` and the pages. Arabic rules in `site.css` (`:lang(ar)` at the end) may need the same.
4. If the README's voice, colour or type rules changed, update `CLAUDE.md` and `.claude/skills/site-page/arabic.md` to match.
5. Publish with the `site-publish` skill and look at both languages: font or spacing changes often affect Arabic line heights.
