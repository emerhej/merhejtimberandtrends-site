#!/usr/bin/env python3
"""Screenshot the site from public/ at phone and desktop width, in English and Arabic.

    python3 .claude/skills/site-publish/scripts/screenshot.py [OUT_DIR] [PAGE ...]

PAGE is a site path such as "/" or "/ar/products/" (default: every page in public/, plus the
404 page in both languages). Writes OUT_DIR/<page>-<width>.png (default OUT_DIR: ./screenshots,
which is ignored by git) and prints any page that scrolls sideways.

Needs Playwright with Chromium (pip install playwright && playwright install chromium).
Google Fonts is often unreachable from sandboxes, so the brand fonts are installed once from
npm (@fontsource) into ~/.cache/mtt-fonts and served to the page in place of Google's CSS.
"""
import functools, http.server, json, os, pathlib, re, socketserver, subprocess, sys, threading

REPO = pathlib.Path(__file__).resolve().parents[4]
PUBLIC = REPO / "public"
FONT_CACHE = pathlib.Path.home() / ".cache" / "mtt-fonts"
PKGS = {"IBM Plex Sans Arabic": "ibm-plex-sans-arabic", "IBM Plex Sans": "ibm-plex-sans",
        "Zilla Slab": "zilla-slab", "IBM Plex Mono": "ibm-plex-mono"}
WEIGHTS = ["400", "500", "600", "700"]
WIDTHS = [390, 1280]


def ensure_fonts():
    mods = FONT_CACHE / "node_modules" / "@fontsource"
    if all((mods / p).exists() for p in PKGS.values()):
        return mods
    FONT_CACHE.mkdir(parents=True, exist_ok=True)
    subprocess.run(["npm", "init", "-y"], cwd=FONT_CACHE, check=True, capture_output=True)
    subprocess.run(["npm", "i", "--silent", *[f"@fontsource/{p}" for p in PKGS.values()]],
                   cwd=FONT_CACHE, check=True)
    return mods


def font_css(mods):
    out = []
    for pkg in PKGS.values():
        for w in WEIGHTS:
            f = mods / pkg / f"{w}.css"
            if f.exists():
                css = f.read_text()
                out.append(re.sub(r"url\(\./files/", f"url(https://fonts.local/{pkg}/files/", css))
    return "\n".join(out)


def pages():
    found = []
    for f in sorted(PUBLIC.rglob("index.html")):
        rel = f.relative_to(PUBLIC).as_posix()
        found.append("/" + rel[: -len("index.html")])
    return found + ["/missing-page", "/ar/missing-page"]


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def send_error(self, code, message=None, explain=None):
        # Serve 404.html like GitHub Pages does
        if code == 404 and (PUBLIC / "404.html").exists():
            body = (PUBLIC / "404.html").read_bytes()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().send_error(code, message, explain)


def main():
    from playwright.sync_api import sync_playwright

    out = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "screenshots").resolve()
    targets = sys.argv[2:] or pages()
    out.mkdir(parents=True, exist_ok=True)
    mods = ensure_fonts()
    css = font_css(mods)

    handler = functools.partial(Handler, directory=str(PUBLIC))
    srv = socketserver.TCPServer(("127.0.0.1", 0), handler)
    port = srv.server_address[1]
    threading.Thread(target=srv.serve_forever, daemon=True).start()

    def fonts(route):
        url = route.request.url
        if "fonts.googleapis.com" in url:
            return route.fulfill(status=200, content_type="text/css", body=css)
        pkg, name = re.search(r"fonts\.local/([^/]+)/files/(.+)$", url).groups()
        route.fulfill(status=200, content_type="font/woff2", body=(mods / pkg / "files" / name).read_bytes())

    wide = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for width in WIDTHS:
            ctx = browser.new_context(viewport={"width": width, "height": 900}, color_scheme="light")
            ctx.route("https://fonts.googleapis.com/**", fonts)
            ctx.route("https://fonts.local/**", fonts)
            page = ctx.new_page()
            for t in targets:
                page.goto(f"http://127.0.0.1:{port}{t}", wait_until="networkidle")
                page.evaluate("document.fonts.ready")
                name = (t.strip("/").replace("/", "_") or "home") + f"-{width}.png"
                page.screenshot(path=str(out / name), full_page=True)
                sw = page.evaluate("document.documentElement.scrollWidth")
                if sw > width:
                    wide.append(f"{t} at {width}px scrolls sideways ({sw}px wide)")
            ctx.close()
        browser.close()
    srv.shutdown()
    print(json.dumps({"screenshots": str(out), "pages": targets, "sideways_scroll": wide}, indent=2))
    sys.exit(1 if wide else 0)


if __name__ == "__main__":
    main()
