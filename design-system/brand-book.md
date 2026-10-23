Merhej Timber & Trends s.a.r.l. imports carpentry products — hinges, door and cabinet hardware, fittings — from manufacturers in China and sells them in Lebanon, with a wider product range to follow. This system dresses the website (merhejtimberandtrends.com), marketing material and social media. Everything below is derived from the logo: an open door in deep forest green, a heavy slab-serif wordmark, and thin brass rings and rules on ivory.

## The idea: an open door

The logo is a door standing ajar — welcoming, practical, the trade the company serves. Carry that into every layout: generous ivory space (the open doorway), one solid forest element (the door), and a single fine brass line (the frame and rings). Calm, well-made, uncluttered. Never busy.

## Voice and content

- Practical and knowledgeable, like a good hardware counter: lead with what the product does, then the numbers. "Automatic closing from up to 170°" beats "Amazing quality!".
- Bilingual. English is the default; every product has an Arabic name, shown under the English one (Hydraulic Hinge / مفصلة باب هيدروليك). Write Arabic copy fresh rather than translating word for word. Specs stay in Western digits and metric units in both languages.
- Sentence case for headings and buttons ("Hinges built for daily use", "Request a quote"); Title Case only for product names ("Hydraulic Hinge"). Eyebrows and badges are set uppercase by the style, so type them in normal case.
- Speak to the customer as "you", about the company as "we".
- No emoji, no exclamation marks, no superlatives ("best", "No.1") on the site or in post artwork.
- Until online selling launches (planned in about two years), every call to action asks for contact: "Request a quote", "Ask on WhatsApp", "Visit us". Never show a cart.

## Colour

- Proportions: about 60% `surface` (ivory), 30% `forest`, 10% `brass`. Forest and ivory were sampled exactly from the logo (#2d5037, #f8f5eb), as was brass (#96783c).
- `forest` is the brand: headings, primary buttons, links, and full-bleed fields on social slides. Text on forest is `on-forest`.
- `brass` is jewellery: hairline rules, the seal ring, the post frame, dividers and icons. It is too light for small text on ivory — brass text uses `brass-ink`.
- Body text is `ink`, secondary text `ink-muted`. Cards sit on `surface-raised`; alternate page bands use `surface-sunken`.
- Status: In stock = `forest` fill, Out of stock = `rust` on `rust-soft`, always with the word.
- The `dark` theme ("Forest night") is for the website's dark mode only; brand materials and social posts use the ivory theme.

## Type

- Headings: `display`, `h1`–`h3` in Zilla Slab, a slab serif that echoes the logo wordmark. The wordmark itself is never retyped — use the logo file.
- Text: `body`, `body-lg`, `small`, `label`, `caption` in IBM Plex Sans. `eyebrow` is Plex Sans uppercase with 0.16em tracking in `brass-ink`, after the spaced "s.a.r.l." under the logo.
- Arabic: `ar-heading`, `ar-body` in IBM Plex Sans Arabic, the same design family as the Latin text, with taller line heights. Set `lang="ar"` and `dir="rtl"` on Arabic blocks and mirror the layout (start/end, not left/right).
- Specs: `spec` in IBM Plex Mono for measurements, loads and angles.
- All four families are free on Google Fonts; `components/bundle.css` loads them.

## Space, shape and layout

- Spacing steps `space-1`–`space-9` (4 to 96px). Section padding `space-9` desktop, `space-8` mobile; page gutter `space-5` desktop, `space-4` mobile; content capped at `content-max`, running text at `text-max`.
- Corners are near-square, like the door leaf: `radius-sm` for buttons, inputs and badges, `radius-md` for cards and images. `radius-round` only for the circular seal and round crops, after the logo's ring.
- Borders over shadows: cards use a `line` border at rest and `shadow-card` on hover only.
- The brass hairline (`rule-weight`, `brass`) is the signature divider — under section titles, at the top of spec tables, as the inner frame of posts. One per block.
- Focus: a 2px `surface` gap then a solid 2px `focus` ring on every interactive element.

## Logo

- Use `merhej-logo-ivory.png` (Logos) exactly as supplied, on ivory or white. Don't recolour, stretch, crop the ring, add shadows, or place it on photos or on forest.
- Clear space: at least a quarter of the logo's width on all sides. Minimum size 96px on screen, 25mm in print.
- In the website header and in post footers it appears as the round badge.

## Imagery

- Products photographed on ivory or white seamless, soft daylight, a slight top-down angle, the product filling about 70% of the frame. Square 1:1 for the catalogue, 4:5 for feed posts.
- Detail shots (the hinge mechanism, a finish) go in carousels and product pages.
- Supplier photos with foreign text, watermarks or busy backgrounds are not used as they are: re-shoot or cut out onto `surface`.
- Technical diagrams: redraw in `forest` lines on `surface` with `brass` callouts.

## Iconography

- The sources contain no icon set. Use Lucide icons (stroke 1.75, round caps) in `forest` or `ink`, 20px in UI, 24px in content. This is a substitute until the brand has its own icons.
- Icons accompany labels; they don't replace them. No emoji.

## Social media

- Formats: 1080×1080 (feed, carousels), 1080×1350 (feed), 1080×1920 (stories, reel covers). Use `SocialPost`.
- Product carousel: cover with product photo and English + Arabic names → one or two forest feature slides → specs → how to order (WhatsApp, location).
- Caption: product name in English and Arabic, two or three practical lines, then how to order. Hashtags at the end, a handful, in both languages.

## Components

`components/bundle.js` defines `window.MTT` and needs React 18: `Button`, `Badge`, `SectionHeader`, `ProductCard`, `SpecTable`, `Seal`, `SocialPost`. Each has guidelines and a live preview.

## The website

- The website's code is the GitHub repository `emerhej/merhejtimberandtrends-site`: plain static HTML and CSS in `public/`, with no framework, so it can be published on any static host.
- Its `design-system/` folder mirrors this system: `tokens.json` exactly, and `components/bundle.css` as `components.css`. After changing tokens or component styles here, copy both files there unchanged, run `node scripts/sync-design-system.mjs`, and commit — the site reads only the generated `public/assets/css/tokens.css` and `components.css`.
- On the site, tokens are CSS variables with the same names (`var(--forest)`), type styles are classes prefixed `t-` (`t-h2`, `t-body`), and components are plain HTML using the same `mtt-` classes as the previews here.
