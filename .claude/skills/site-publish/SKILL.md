---
name: site-publish
description: Use to check, preview and publish changes to merhejtimberandtrends.com — run the site and phone checks, screenshot English and Arabic pages, commit, push to main and confirm the live site updated.
---

# Check, preview and publish

Pushing to `main` publishes the site: `.github/workflows/pages.yml` deploys `public/` to GitHub Pages (merhejtimberandtrends.com) within about a minute.

## 1. Check
```
node scripts/check-site.mjs
```
Fix every problem it lists before going further. If you added a rule the checker should know about, extend the script rather than relying on memory.

## 2. Phone check
```
python3 .claude/skills/site-publish/scripts/mobile_check.py [--shots <out-dir>] [/path/ ...]
```
Opens every page (or the ones listed), in both languages, as a touch phone at 320, 360, 390, 414 and 768px, and fails on: sideways scrolling or anything past the screen edge, tap targets under 44 × 44px (24px tall for links inside sentences), undersized targets closer than 8px, text under 12px, inputs under 16px, a viewport tag that blocks zooming, or a page title pushed below the first screen. Fix everything it reports. `--shots` saves a screenshot per page and width. Add `-v` to see header heights and where each title sits.

## 3. Preview
```
python3 .claude/skills/site-publish/scripts/screenshot.py <out-dir> [/path/ ...]
```
- With no paths it shoots every page plus the 404 in both languages, at 390 px (phone) and 1280 px (desktop). It serves `public/` locally, swaps Google Fonts for the same fonts from npm (Google Fonts is usually blocked in the sandbox), and exits non-zero if a page scrolls sideways.
- Needs Playwright + Chromium (`pip install playwright` and `playwright install chromium` if missing).
- **Look at the screenshots** of every page you changed, in both languages and both widths, before committing: Arabic reads right to left, numbers and degree signs sit the right way round ("170°", not "°170"), nothing overlaps, the language link is in the header, and the page matches the design system (ivory space, one forest element, one brass hairline per block).
- Keep screenshots out of the repo (`screenshots/` is git-ignored; a scratch folder is better).

## 4. Commit and push
```
git fetch origin main && git rebase origin/main
git add -A && git commit -m "<what changed, for the owner to read>"
git push origin HEAD:main
```
Commit messages are in plain English and say what visitors will see change ("Add Arabic product page for the Hydraulic Hinge"). Follow the session's attribution instructions for trailers.

## 5. Confirm it is live
- `gh run list -R emerhej/merhejtimberandtrends-site -L 1` until the newest "Deploy site to GitHub Pages" run shows `completed success` (`gh run watch <id>` also works). If it failed, `gh run view <id> --log-failed`, fix and push again.
- Fetch one changed English page and its Arabic twin on https://merhejtimberandtrends.com (WebFetch) and confirm the new text is there. GitHub Pages can serve the old copy for a minute or two after the run.

## 6. Keep the records current
If pages were added or removed, update the page list in the Project doc `claude/brand-and-drive.md` (Projects tool) and in the repo `README.md`.
