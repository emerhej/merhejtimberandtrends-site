#!/usr/bin/env node
// Builds the website's CSS from the design system sources.
//   design-system/tokens.json      -> public/assets/css/tokens.css
//   design-system/components.css   -> public/assets/css/components.css
//   design-system/assets/logo/*    -> public/assets/img/
// Run after any change in design-system/:  node scripts/sync-design-system.mjs
// No dependencies; the generated files are committed so hosts need no build step.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ds = join(root, 'design-system');
const out = join(root, 'public', 'assets');
const t = JSON.parse(readFileSync(join(ds, 'tokens.json'), 'utf8'));

const themes = t.color.themes.map((x) => x.id);
const first = themes[0];
const ref = (v) => (/^\{(.+)\}$/.test(v) ? `var(--${v.slice(1, -1)})` : v);
const valueFor = (tok, theme) => {
  const v = typeof tok.value === 'string' ? { [first]: tok.value } : tok.value;
  return ref(v[theme] ?? v[first]);
};
const themed = [...t.color.tokens, ...(t.shadow?.tokens ?? [])];
const decls = (theme, onlyChanged) =>
  themed
    .filter((tok) => !onlyChanged || (typeof tok.value === 'object' && tok.value[theme] !== undefined))
    .map((tok) => `  --${tok.name}: ${valueFor(tok, theme)};`)
    .join('\n');

const plain = ['spacing', 'radius', 'layout']
  .flatMap((fam) => t[fam]?.tokens ?? [])
  .map((tok) => `  --${tok.name}: ${tok.value};`);
const fonts = Object.entries(t.type.families).map(([k, v]) => `  --font-${k}: ${v};`);

const px = (v) => (typeof v === 'number' ? `${v}px` : v);
const styles = t.type.groups.flatMap((g) =>
  g.styles.map((s) => {
    const fam = s.family ?? g.family;
    const lines = [
      `  font-family: var(--font-${fam});`,
      `  font-size: ${px(s.fontSize)};`,
      s.lineHeight !== undefined && `  line-height: ${px(s.lineHeight)};`,
      s.fontWeight !== undefined && `  font-weight: ${s.fontWeight};`,
      s.letterSpacing !== undefined && `  letter-spacing: ${px(s.letterSpacing)};`,
      s.name === 'eyebrow' && '  text-transform: uppercase;',
    ].filter(Boolean);
    return `/* ${s.usage ?? ''} */\n.t-${s.name} {\n${lines.join('\n')}\n}`;
  })
);

const others = themes.slice(1);
const css = `/* ${t.name} — generated from design-system/tokens.json by scripts/sync-design-system.mjs. Do not edit by hand. */

:root, [data-theme="${first}"] {
${decls(first, false)}
}
${others
  .map(
    (th) => `
[data-theme="${th}"] {
${decls(th, true)}
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="${first}"]) {
${decls(th, true).replace(/^/gm, '  ')}
  }
}`
  )
  .join('\n')}

:root {
${[...plain, ...fonts].join('\n')}
}

${styles.join('\n\n')}
`;

mkdirSync(join(out, 'css'), { recursive: true });
mkdirSync(join(out, 'img'), { recursive: true });
writeFileSync(join(out, 'css', 'tokens.css'), css);
copyFileSync(join(ds, 'components.css'), join(out, 'css', 'components.css'));
for (const f of readdirSync(join(ds, 'assets', 'logo'))) copyFileSync(join(ds, 'assets', 'logo', f), join(out, 'img', f));
console.log(`tokens.css: ${themed.length} colour/shadow tokens × ${themes.length} themes, ${plain.length} scale tokens, ${styles.length} type styles`);
