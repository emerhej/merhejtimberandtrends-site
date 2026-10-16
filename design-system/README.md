# Design system

This folder is the website's copy of the **Merhej Timber & Trends** design system, kept in Claude:
https://claude.ai/artifact/GcdcUnbKB4fUmmYyLgXnSW

The full brand book (voice, colour, type, logo, imagery and social rules) lives there. This folder holds what the website needs from it.

| File | What | Mirrors in the design system |
| --- | --- | --- |
| `tokens.json` | Colours (Ivory and Forest night themes), type, spacing, radius, shadow, layout | `project/tokens.json` |
| `components.css` | Styles for the components (`mtt-btn`, `mtt-badge`, `mtt-sh`, `mtt-card`, `mtt-spec`, `mtt-seal`, `mtt-post`) | `project/components/bundle.css` |
| `assets/logo/merhej-logo-ivory.png` | The logo, 1080×1080 on ivory | Logos group |

## Keeping the two in step

The design system is the source of truth. When it changes:

1. Copy the changed `tokens.json` and `bundle.css` (as `components.css`) here, unchanged.
2. Run `node scripts/sync-design-system.mjs` from the repo root.
3. Commit both this folder and the regenerated files in `public/assets/`.

Never edit `public/assets/css/tokens.css` or `public/assets/css/components.css` by hand — they are generated.

## Using it in pages

Every page loads, in this order:

```html
<link rel="stylesheet" href="/assets/css/tokens.css">
<link rel="stylesheet" href="/assets/css/components.css">
```

- Colours and scales are CSS variables named as in `tokens.json`: `var(--forest)`, `var(--space-5)`, `var(--radius-md)`, `var(--font-slab)`.
- Type styles are classes prefixed `t-`: `t-display`, `t-h1`, `t-h2`, `t-h3`, `t-eyebrow`, `t-body-lg`, `t-body`, `t-label`, `t-small`, `t-caption`, `t-ar-heading`, `t-ar-body`, `t-spec`.
- Components are plain HTML with the `mtt-` classes; their markup matches the React components in the design system (see each component's preview there).
- Dark mode follows the visitor's system setting. Put `data-theme="light"` on `<html>` to force the ivory theme.
- Arabic blocks get `lang="ar" dir="rtl"`.
