# Writing the Arabic pages

## Voice
- Modern Standard Arabic, plain and practical, like a good hardware counter. Lead with what the product does, then the numbers.
- Address customers in the plural (تواصلوا، اسألونا، لتختاروا); the company is "we" (نستورد، نضيف). Buttons use the singular imperative as is usual on Arabic sites (اطلب عرض سعر، تصفّح المنتجات).
- Write the Arabic fresh from the meaning of the English, not word for word. Keep it about the same length.
- No emoji, no exclamation marks, no superlatives (الأفضل، رقم 1).
- Arabic punctuation: comma ، question mark ؟ semicolon ؛. Use a shadda or tanween where it aids reading (مباشرةً، قريباً, النجّارين); no full vowelling.

## Numbers, units and names
- Western digits (0–9) everywhere, metric units, exactly the same values as the English page. `check-site.mjs` compares the numbers in every spec table and card.
- Measurement cells keep the English notation and `dir="ltr"`: `<td dir="ltr">140 × 34 × 3.0 mm, Ø 22.8</td>`. A cell that mixes words and a value is Arabic: `<td>بعد <span dir="ltr">85°</span></td>`.
- **Degree signs inside Arabic text must be wrapped**: `<span dir="ltr">170°</span>`, or the sign jumps to the wrong side ("°170"). In `<title>`/`<meta>` text, where tags are not allowed, put U+200E before and after: `‎85°‎`.
- The brand stays in Latin: `<span lang="en" dir="ltr">Merhej Timber &amp; Trends</span>`, or `<bdi lang="en" dir="ltr">…</bdi>` inside a sentence. s.a.r.l. = ش.م.م.
- Product names come from the "Product name (AR)" column of the Product Catalogue; use them exactly.

## Glossary (terms already on the site — reuse them)

| English | Arabic |
| --- | --- |
| Carpentry hardware | إكسسوارات النجارة / إكسسوارات نجارة |
| Hinges | مفصلات |
| Hydraulic Hinge | مفصلة باب هيدروليك |
| Products | المنتجات |
| Catalogue | الكتالوج |
| About / About us | من نحن |
| Contact (nav) / Contact (eyebrow) | تواصل / تواصل معنا |
| Get in touch | تواصلوا معنا |
| Home (breadcrumb) | الرئيسية |
| Explore (footer) | تصفّح |
| Featured | مختارات |
| New arrival | وصل حديثاً |
| Photo coming soon | الصورة قريباً |
| View details | عرض التفاصيل |
| View products | تصفّح المنتجات |
| Request a quote | اطلب عرض سعر |
| See specifications | اطّلع على المواصفات |
| Ask on WhatsApp (not used yet) | اسألونا على واتساب |
| Visit us (not used yet) | زورونا |
| Features | المزايا |
| Specifications | المواصفات |
| Size | المقاس |
| Load / Capacity | الحمولة |
| Opening / Maximum opening | زاوية الفتح / أقصى زاوية فتح |
| Hold-open | البقاء مفتوحاً |
| Colours | الألوان |
| Black, Silver | أسود، فضي |
| Hinge width | عرض المفصلة |
| up to / beyond | حتى / بعد |
| per hinge | للمفصلة الواحدة |
| carpenters, contractors and homeowners | النجّارين والمقاولين وأصحاب البيوت |
| Skip to content | انتقل إلى المحتوى |

Add new terms here when you introduce them.

## Layout
- Arabic pages have `<html lang="ar" dir="rtl">`. The layout mirrors by itself because `site.css` and `components.css` use logical properties (start/end). Use `margin-inline-start`, `inset-inline-end`, `text-align: start` — never left/right — in new CSS.
- Diagrams (SVG) keep `direction="ltr"` on the `<svg>`; only their text labels change. Centre labels with `text-anchor="middle"`.
- Eyebrows, badges and category labels are not uppercased or letter-spaced in Arabic (handled in `site.css` under `:lang(ar)`).
