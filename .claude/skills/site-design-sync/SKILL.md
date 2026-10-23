---
name: site-design-sync
description: Use when the Merhej Timber & Trends design system (colours, type, spacing, component styles, logo) has changed and the website must pick up the change, or to check the site still matches it.
---

# Sync the design system into the site

Source of truth: the Claude artifact "Merhej Timber & Trends" (Design System), https://claude.ai/artifact/GcdcUnbKB4fUmmYyLgXnSW.

1. Read the changed files with the Artifact tool (`action: "read"`, that url):
   - `path: "project/tokens.json"` → copy unchanged to `design-system/tokens.json`
   - `path: "project/components/bundle.css"` → copy unchanged to `design-system/components.css`
   - `path: "project/README.md"` → copy unchanged to `design-system/brand-book.md`
   - a new logo → `design-system/assets/logo/` (exactly as supplied)
2. `node scripts/sync-design-system.mjs` — regenerates `public/assets/css/tokens.css` and `components.css` and copies the logo. Never edit those generated files by hand.
3. If a token was renamed or removed, `grep -rn "var(--old-name)" public` and update `site.css` and the pages. Arabic rules in `site.css` (`:lang(ar)` at the end) may need the same.
4. If the README's voice, colour or type rules changed, update `CLAUDE.md` and `.claude/skills/site-page/arabic.md` to match.
5. `node scripts/build-brand-pack.mjs` — rebuilds `design-system/BRAND-PACK.md` (the one-file brand pack for teammates and other AI tools). `check-site.mjs` fails while it is out of date.
6. Publish with the `site-publish` skill and look at both languages: font or spacing changes often affect Arabic line heights.

## Keep the brand pack current

`design-system/BRAND-PACK.md` is the master copy. It is built from `tokens.json`, `brand-book.md` and `team-notes.md`. Rebuild it (`node scripts/build-brand-pack.mjs`) and commit whenever any of those change, including when pages, hosting or Drive folders change: those facts live in `team-notes.md`.

After each rebuild that is pushed, refresh the Google Drive copy:

- Drive copy: Google Doc "Brand pack — Merhej Timber & Trends" in Drive 01 Brand (folder `13X-6gjF1-LCM54GKsfT9abTBBmuvop_I`), currently https://docs.google.com/document/d/1wTeG0Kft2NadpvsdbK1tMOQ0VCYaiYn7Z11fm0eKUB8/edit
- If the Google Docs connector is on, replace the doc's content with the new `BRAND-PACK.md` in place, so the link stays the same.
- Otherwise (Google Drive connector only, which cannot edit a file's content): create a new Google Doc in 01 Brand with Drive `create_file` (`contentMimeType: "text/markdown"`, `parentId` above), with the same title and this first line: `> Copy of design-system/BRAND-PACK.md in the website repo, made YYYY-MM-DD. If the two differ, the repo is right.` Read it back with `read_file_content` to check it is complete. Ask the owner before trashing the old copy, then update the link above and in the Project doc `claude/brand-and-drive.md`.
