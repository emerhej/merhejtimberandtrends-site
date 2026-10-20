#!/usr/bin/env node
// Checks the site in public/ before it is committed:  node scripts/check-site.mjs
//
// - Every English page has an Arabic twin under public/ar/ at the same path, and the reverse.
// - Each page: right lang/dir, canonical, hreflang en/ar/x-default, og:url, title, description,
//   and a language link (.nav-lang) pointing at its twin.
// - English pages contain no Arabic text (apart from the language link).
// - Twins match: same element ids, same links (in their own language), same number of product
//   cards, and the same numbers in every spec table and card spec list.
// - Header and footer are identical on every page of the same language.
// - Every link and image resolves to a file in public/, and every #anchor exists.
// - No hard-coded colours in site.css or in style attributes; every <img> has alt, width and height.
// - Phone basics: viewport tag that allows zooming, home-screen icon, theme colour, language link
//   outside the main nav, no fixed widths over 320px in style attributes.
//   (The full phone check, in a real browser, is .claude/skills/site-publish/scripts/mobile_check.py.)
// - sitemap.xml lists every page, and nothing else.
// No dependencies. Exits with code 1 and a list of problems if anything fails.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const SITE = 'https://merhejtimberandtrends.com/';
const ARABIC = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const problems = [];
const fail = (page, msg) => problems.push(`${page}: ${msg}`);

// ---------- collect pages ----------
const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});
const files = walk(pub).map((p) => relative(pub, p).split('\\').join('/'));
const pages = files.filter((f) => f.endsWith('.html') && f !== '404.html');
const urlOf = (file) => file.replace(/(^|\/)index\.html$/, '$1'); // "products/index.html" -> "products/"
const isAr = (file) => file.startsWith('ar/');
const twinOf = (file) => (isAr(file) ? file.slice(3) : 'ar/' + file);
const html = Object.fromEntries(pages.map((f) => [f, readFileSync(join(pub, f), 'utf8')]));

// ---------- helpers ----------
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
const tags = (src, name) => src.match(new RegExp(`<${name}\\b[^>]*>`, 'g')) || [];
const ids = (src) => new Set([...src.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const text = (src) => src.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '')
  .replace(/<[^>]+>/g, ' ');
const section = (src, open, close) => {
  const i = src.indexOf(open);
  if (i < 0) return '';
  return src.slice(i, src.indexOf(close, i) + close.length);
};
// Resolve a link found on `file` to a site path ("/products/") plus fragment.
const resolve = (file, href) => {
  if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(href)) return null;
  const [path, frag = ''] = href.split('#');
  if (path === '') return { path: '/' + urlOf(file), frag };
  const base = '/' + posix.dirname(file) + '/';
  let abs = path.startsWith('/') ? path : posix.normalize(posix.join(base, path));
  if (path.endsWith('/') && !abs.endsWith('/')) abs += '/';
  return { path: abs.replace(/^\/\.\//, '/'), frag };
};
const fileFor = (sitePath) => {
  const p = sitePath.replace(/^\//, '');
  if (p === '' || p.endsWith('/')) return p + 'index.html';
  return p;
};
const linksOf = (src) => [...src.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
const numbers = (src) => (text(src).match(/\d+(?:\.\d+)?/g) || []).join(' ');

// ---------- per page ----------
for (const f of pages) {
  const s = html[f];
  const ar = isAr(f);
  const url = SITE + urlOf(f);
  const enUrl = SITE + urlOf(ar ? f.slice(3) : f);
  const arUrl = SITE + urlOf(ar ? f : 'ar/' + f);
  const htmlTag = tags(s, 'html')[0] || '';

  if (ar) {
    if (attr(htmlTag, 'lang') !== 'ar' || attr(htmlTag, 'dir') !== 'rtl') fail(f, 'Arabic page needs <html lang="ar" dir="rtl">');
  } else if (attr(htmlTag, 'lang') !== 'en' || attr(htmlTag, 'dir')) fail(f, 'English page needs <html lang="en"> without dir');

  const links = tags(s, 'link');
  const href = (pred) => links.filter(pred).map((t) => attr(t, 'href'));
  const canon = href((t) => attr(t, 'rel') === 'canonical');
  if (canon.length !== 1 || canon[0] !== url) fail(f, `canonical should be ${url} (found ${canon.join(', ') || 'none'})`);
  for (const [lang, want] of [['en', enUrl], ['ar', arUrl], ['x-default', enUrl]]) {
    const got = href((t) => attr(t, 'rel') === 'alternate' && attr(t, 'hreflang') === lang);
    if (got.length !== 1 || got[0] !== want) fail(f, `hreflang="${lang}" should be ${want} (found ${got.join(', ') || 'none'})`);
  }
  const meta = tags(s, 'meta');
  const metaVal = (k, v) => (meta.find((t) => attr(t, k) === v) && attr(meta.find((t) => attr(t, k) === v), 'content')) || '';
  if (metaVal('property', 'og:url') !== url) fail(f, `og:url should be ${url}`);
  if (metaVal('property', 'og:locale') !== (ar ? 'ar_LB' : 'en_US')) fail(f, `og:locale should be ${ar ? 'ar_LB' : 'en_US'}`);
  const title = (s.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = metaVal('name', 'description');
  if (!title.trim()) fail(f, 'missing <title>');
  if (!desc.trim()) fail(f, 'missing meta description');
  if (ar && (!ARABIC.test(title) || !ARABIC.test(desc))) fail(f, 'Arabic page title and description must be in Arabic');
  const h1 = section(s, '<h1', '</h1>');
  if (!h1) fail(f, 'missing <h1>');
  else if (ar && !ARABIC.test(text(h1))) fail(f, 'Arabic page <h1> must be in Arabic');

  // language link
  const langLink = tags(s, 'a').find((t) => /class="[^"]*\bnav-lang\b/.test(t));
  if (!langLink) fail(f, 'missing language link (<a class="nav-lang">) in the header');
  else {
    const r = resolve(f, attr(langLink, 'href'));
    if (!r || fileFor(r.path) !== twinOf(f)) fail(f, `language link should point to ${twinOf(f)} (points to ${attr(langLink, 'href')})`);
    if (attr(langLink, 'lang') !== (ar ? 'en' : 'ar') || attr(langLink, 'hreflang') !== (ar ? 'en' : 'ar')) fail(f, 'language link needs lang and hreflang of the other language');
  }

  // no Arabic on English pages, except the language link
  if (!ar) {
    const stripped = s.replace(/<a[^>]*class="[^"]*\bnav-lang\b[^"]*"[^>]*>[\s\S]*?<\/a>/, '');
    const hit = text(stripped).split(/\s{2,}|\n/).find((line) => ARABIC.test(line));
    if (hit) fail(f, `English page contains Arabic text: "${hit.trim().slice(0, 60)}" — it belongs on ${twinOf(f)}`);
  }

  // phones: the viewport tag must fit the screen and must not block zooming
  const vp = metaVal('name', 'viewport');
  if (!/width=device-width/.test(vp) || !/initial-scale=1/.test(vp)) fail(f, 'needs <meta name="viewport" content="width=device-width, initial-scale=1">');
  if (/user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/.test(vp)) fail(f, 'viewport must not block zooming (no user-scalable=no / maximum-scale=1)');
  if (!links.some((t) => attr(t, 'rel') === 'apple-touch-icon')) fail(f, 'missing <link rel="apple-touch-icon"> (home-screen icon on phones)');
  if (!meta.some((t) => attr(t, 'name') === 'theme-color')) fail(f, 'missing <meta name="theme-color"> (phone browser bar colour)');
  // the language link sits outside the main nav so phones can show it beside the logo
  const navBlock = section(s, '<nav class="nav"', '</nav>');
  if (/class="[^"]*\bnav-lang\b/.test(navBlock)) fail(f, 'the language link (.nav-lang) must come after </nav>, not inside the main nav');

  // Arabic pages: a degree value inside Arabic text flips to "°85" unless it sits in a dir="ltr" element
  if (ar) {
    let body = s.slice(s.indexOf('<body'))
      .replace(/<svg[\s\S]*?<\/svg>/g, '')
      .replace(/<(\w+)\b[^>]*\sdir="ltr"[^>]*>[\s\S]*?<\/\1>/g, '');
    const deg = text(body).match(/[^\s]*\d\s?°[^\s]*/);
    if (deg) fail(f, `"${deg[0]}" in Arabic text needs <span dir="ltr">…°</span> so the degree sign stays after the number`);
  }

  // links, images, anchors, ids, alt, colours
  const seen = new Set();
  for (const m of s.matchAll(/\sid="([^"]+)"/g)) {
    if (seen.has(m[1])) fail(f, `duplicate id "${m[1]}"`);
    seen.add(m[1]);
  }
  for (const l of linksOf(s)) {
    const r = resolve(f, l);
    if (!r) continue;
    const target = fileFor(r.path);
    if (!existsSync(join(pub, target))) { fail(f, `broken link ${l} (no public/${target})`); continue; }
    if (r.frag && target.endsWith('.html')) {
      const tsrc = target === f ? s : readFileSync(join(pub, target), 'utf8');
      if (!ids(tsrc).has(r.frag)) fail(f, `link ${l} points to #${r.frag}, which ${target} does not have`);
    }
  }
  for (const t of tags(s, 'img')) {
    if (attr(t, 'alt') === undefined) fail(f, `<img> without alt: ${t}`);
    if (!attr(t, 'width') || !attr(t, 'height')) fail(f, `<img> needs width and height so the page doesn't jump while loading on phones: ${t}`);
  }
  for (const t of s.match(/\sstyle="[^"]*"/g) || []) {
    const w = t.match(/(?:^|[;"\s])(?:min-)?width:\s*(\d+)px/);
    if (w && +w[1] > 320) fail(f, `fixed width ${w[1]}px in ${t.trim()} is wider than a small phone — use max-width or a CSS class`);
  }
  for (const t of s.match(/\sstyle="[^"]*"/g) || []) {
    if (/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i.test(t)) fail(f, `hard-coded colour in ${t.trim()} — use a design-system variable`);
  }
}

// ---------- twins ----------
for (const f of pages) {
  const twin = twinOf(f);
  if (!html[twin]) { fail(f, `has no ${isAr(f) ? 'English' : 'Arabic'} twin at public/${twin}`); continue; }
  if (isAr(f)) continue; // compare each pair once, from the English side
  const a = html[f], b = html[twin];
  const ia = ids(a), ib = ids(b);
  const onlyA = [...ia].filter((x) => !ib.has(x)), onlyB = [...ib].filter((x) => !ia.has(x));
  if (onlyA.length || onlyB.length) fail(f, `ids differ from ${twin}: only English [${onlyA}] only Arabic [${onlyB}]`);
  const mainLinks = (file, src) => linksOf(section(src, '<main', '</main>'))
    .map((l) => resolve(file, l)).filter(Boolean)
    .map((r) => (r.path.replace(/^\/ar\//, '/') + (r.frag ? '#' + r.frag : '')));
  const la = mainLinks(f, a).join(' '), lb = mainLinks(twin, b).join(' ');
  if (la !== lb) fail(f, `links in <main> differ from ${twin}:\n    en: ${la}\n    ar: ${lb}`);
  const cards = (src) => (src.match(/class="mtt-card"/g) || []).length;
  if (cards(a) !== cards(b)) fail(f, `${cards(a)} product cards but ${twin} has ${cards(b)}`);
  const specs = (src) => [...(src.match(/<table class="mtt-spec[\s\S]*?<\/table>/g) || []),
    ...(src.match(/<dl class="mtt-card-specs[\s\S]*?<\/dl>/g) || [])].map(numbers);
  const sa = specs(a), sb = specs(b);
  if (sa.join(' | ') !== sb.join(' | ')) fail(f, `spec numbers differ from ${twin}:\n    en: ${sa.join(' | ')}\n    ar: ${sb.join(' | ')}`);
}

// ---------- shared header and footer per language ----------
const normalised = (file, src, open, close) => section(src, open, close)
  .replace(/\saria-current="page"/g, '')
  .replace(/\s(href|src)="([^"]+)"/g, (m, k, v) => {
    const r = resolve(file, v);
    return r ? ` ${k}="${r.path}${r.frag ? '#' + r.frag : ''}"` : m;
  })
  .replace(/(<a class="nav-lang" href=")[^"]*/, '$1TWIN')
  .replace(/href="\/[^"]*#contact"/g, 'href="#contact"');
for (const lang of ['en', 'ar']) {
  const group = pages.filter((f) => isAr(f) === (lang === 'ar'));
  for (const [open, close, name] of [['<header class="site-header">', '</header>', 'header'], ['<footer class="site-footer">', '</footer>', 'footer']]) {
    const ref = normalised(group[0], html[group[0]], open, close);
    if (!ref) { fail(group[0], `missing site ${name}`); continue; }
    for (const f of group.slice(1)) {
      if (normalised(f, html[f], open, close) !== ref) fail(f, `site ${name} differs from ${group[0]} — keep it identical on every ${lang} page`);
    }
  }
}

// ---------- 404 ----------
if (!existsSync(join(pub, '404.html'))) problems.push('404.html: missing');
else {
  const s = readFileSync(join(pub, '404.html'), 'utf8');
  if (!s.includes('class="lang-en"') || !s.includes('class="lang-ar"')) problems.push('404.html: needs both the lang-en and lang-ar blocks');
  for (const l of linksOf(s)) {
    if (/^(https?:|#)/.test(l)) continue;
    if (!l.startsWith('/')) problems.push(`404.html: link ${l} must be absolute (the page is served at any depth)`);
    else if (!existsSync(join(pub, fileFor(l.split('#')[0])))) problems.push(`404.html: broken link ${l}`);
  }
}

// ---------- css ----------
const css = readFileSync(join(pub, 'assets/css/site.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
for (const m of css.matchAll(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi)) problems.push(`site.css: hard-coded colour ${m[0]} — use a design-system variable`);

// ---------- sitemap ----------
const sitemap = readFileSync(join(pub, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const f of pages) if (!locs.includes(SITE + urlOf(f))) problems.push(`sitemap.xml: missing ${SITE + urlOf(f)}`);
for (const l of locs) if (!pages.some((f) => SITE + urlOf(f) === l)) problems.push(`sitemap.xml: lists ${l}, which has no page`);

// ---------- report ----------
const unique = [...new Set(problems)];
if (unique.length) {
  console.error(`✗ ${unique.length} problem(s):\n` + unique.map((p) => '  - ' + p).join('\n'));
  process.exit(1);
}
console.log(`✓ ${pages.length} pages (${pages.filter((f) => !isAr(f)).length} English + ${pages.filter(isAr).length} Arabic) and 404.html pass every check.`);
