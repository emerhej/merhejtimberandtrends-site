#!/usr/bin/env python3
"""Check every page of the site on phone and tablet screens, in English and Arabic.

    python3 .claude/skills/site-publish/scripts/mobile_check.py [--shots OUT_DIR] [/path/ ...]

Loads each page from public/ in Chromium as a touch phone at 320, 360, 390, 414 and 768 px
wide, and reports:
  - sideways scrolling, and any element sticking out past the screen edge
  - tap targets (links, buttons) smaller than 44 x 44 px, except links inside running text,
    which need at least 24 px of height
  - text smaller than 12 px, and inputs smaller than 16 px (iOS zooms into those)
  - a tap target under 44 x 44 px closer than 8 px to another one, or two targets overlapping
  - a missing viewport tag, or one that blocks zooming
  - the hero or page title pushed below the first screen
With --shots, also saves a screenshot of every page at every width.
Exits non-zero if anything fails. Uses the same local server and fonts as screenshot.py.
"""
import json, pathlib, sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from screenshot import PUBLIC, ensure_fonts, font_css, pages, serve, route_fonts  # noqa: E402

WIDTHS = [320, 360, 390, 414, 768]
HEIGHT = {320: 568, 360: 740, 390: 844, 414: 896, 768: 1024}

AUDIT_JS = r"""
() => {
  const vw = document.documentElement.clientWidth;
  const out = { overflow: [], small_targets: [], small_text: [], crowded: [], inputs: [], fold: null,
                scroll_width: document.documentElement.scrollWidth, viewport: null };
  const vp = document.querySelector('meta[name="viewport"]');
  out.viewport = vp ? vp.content : null;
  const visible = (el) => {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false;
    if (el.closest('.sr-only, .skip, [aria-hidden="true"] *')) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const label = (el) => {
    const t = (el.innerText || el.getAttribute('aria-label') || el.tagName).trim().replace(/\s+/g, ' ');
    const cls = el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : '';
    return `${el.tagName.toLowerCase()}${cls} "${t.slice(0, 40)}"`;
  };
  // 1. elements past the screen edge
  for (const el of document.body.querySelectorAll('*')) {
    if (!visible(el) || el.closest('svg')) continue;
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 || r.left < -1) {
      // report only the outermost offender
      const p = el.parentElement; const pr = p && p.getBoundingClientRect();
      if (!pr || (pr.right <= vw + 1 && pr.left >= -1)) out.overflow.push(`${label(el)} spans ${Math.round(r.left)}–${Math.round(r.right)}px`);
    }
  }
  // 2. tap targets
  const targets = [...document.querySelectorAll('a[href], button, input, select, textarea, summary')].filter(visible);
  for (const el of targets) {
    const r = el.getBoundingClientRect();
    const inText = el.tagName === 'A' && getComputedStyle(el).display === 'inline' &&
      el.parentElement && /^(P|LI|SPAN|TD|DD|FIGCAPTION)$/.test(el.parentElement.tagName) &&
      el.parentElement.innerText.trim().length > el.innerText.trim().length + 2;
    const minH = inText ? 24 : 44, minW = inText ? 0 : 44;
    if (r.height < minH - 0.5 || r.width < minW - 0.5) out.small_targets.push(`${label(el)} is ${Math.round(r.width)}×${Math.round(r.height)}px (needs ${minW ? minW + '×' : 'height '}${minH})`);
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) && parseFloat(getComputedStyle(el).fontSize) < 16) out.inputs.push(`${label(el)} text is ${getComputedStyle(el).fontSize} (iOS zooms below 16px)`);
  }
  // 3. targets too close together (only block-level / non-text targets)
  const boxes = targets.map((el) => [el, el.getBoundingClientRect()]).filter(([el]) => getComputedStyle(el).display !== 'inline');
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const [a, ra] = boxes[i], [b, rb] = boxes[j];
    if (a.contains(b) || b.contains(a)) continue;
    const dx = Math.max(0, Math.max(ra.left, rb.left) - Math.min(ra.right, rb.right));
    const dy = Math.max(0, Math.max(ra.top, rb.top) - Math.min(ra.bottom, rb.bottom));
    const gap = Math.hypot(dx, dy);
    // Spacing only matters when a target is under 44x44 (tab bars of full-size targets may touch).
    const small = (r) => r.width < 44 || r.height < 44;
    if (dx === 0 && dy === 0 && Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left) > 1 && Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top) > 1) out.crowded.push(`${label(a)} overlaps ${label(b)}`);
    else if (gap < 8 && (small(ra) || small(rb))) out.crowded.push(`${label(a)} and ${label(b)} are ${Math.round(gap)}px apart (keep 8px)`);
  }
  // 4. small text
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const n = walker.currentNode; if (!n.textContent.trim()) continue;
    const el = n.parentElement; if (!el || !visible(el) || el.closest('svg')) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < 12 && !seen.has(el)) { seen.add(el); out.small_text.push(`${label(el)} is ${fs}px`); }
  }
  // 5. first screen: where does the main heading sit?
  const h1 = [...document.querySelectorAll('main h1, h1')].find(visible);
  if (h1 && visible(h1)) out.fold = { h1_top: Math.round(h1.getBoundingClientRect().top + scrollY), h1_bottom: Math.round(h1.getBoundingClientRect().bottom + scrollY) };
  const hdr = [...document.querySelectorAll('.site-header')].find(visible);
  if (hdr) out.header_height = Math.round(hdr.getBoundingClientRect().height);
  return out;
}
"""


def main():
    from playwright.sync_api import sync_playwright

    args = [a for a in sys.argv[1:] if a != "-v"]
    shots = None
    if args[:1] == ["--shots"]:
        shots = pathlib.Path(args[1]).resolve(); shots.mkdir(parents=True, exist_ok=True); args = args[2:]
    targets = args or pages()
    mods = ensure_fonts(); css = font_css(mods)
    srv, port = serve()
    problems, notes = [], []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for w in WIDTHS:
            ctx = browser.new_context(viewport={"width": w, "height": HEIGHT[w]}, device_scale_factor=2,
                                      is_mobile=w < 768, has_touch=True, color_scheme="light")
            route_fonts(ctx, mods, css)
            page = ctx.new_page()
            for t in targets:
                page.goto(f"http://127.0.0.1:{port}{t}", wait_until="networkidle")
                page.evaluate("document.fonts.ready")
                r = page.evaluate(AUDIT_JS)
                where = f"{t} @ {w}px"
                vp = r["viewport"] or ""
                if "width=device-width" not in vp: problems.append(f"{where}: viewport tag missing width=device-width")
                if "user-scalable=no" in vp or "maximum-scale=1" in vp: problems.append(f"{where}: viewport blocks zooming")
                if r["scroll_width"] > w: problems.append(f"{where}: page scrolls sideways ({r['scroll_width']}px wide)")
                for k in ("overflow", "small_targets", "small_text", "crowded", "inputs"):
                    for item in r[k]: problems.append(f"{where}: {k.replace('_', ' ')}: {item}")
                if r.get("fold") and r["fold"]["h1_bottom"] > HEIGHT[w]:
                    problems.append(f"{where}: page title ends at {r['fold']['h1_bottom']}px, below the first screen ({HEIGHT[w]}px)")
                notes.append(f"{where}: header {r.get('header_height')}px, title at {r.get('fold')}")
                if shots:
                    name = (t.strip('/').replace('/', '_') or 'home') + f"-{w}.png"
                    page.screenshot(path=str(shots / name), full_page=True)
            ctx.close()
        browser.close()
    srv.shutdown()
    problems = list(dict.fromkeys(problems))
    if "-v" in sys.argv: print("\n".join(notes))
    if problems:
        print(f"✗ {len(problems)} mobile problem(s):\n" + "\n".join("  - " + x for x in problems))
        sys.exit(1)
    print(f"✓ {len(targets)} pages pass the mobile checks at {', '.join(map(str, WIDTHS))} px.")


if __name__ == "__main__":
    main()
