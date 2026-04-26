# Design Guidelines

> Loaded during **Phase 5 (Generate)**. Contains visual and structural rules Claude must follow when writing slide HTML.

---

## 1. CSS Variables — Never hardcode colours

All colours, fonts, radii must reference CSS custom properties defined in `/*THEME_TOKENS*/`.

```css
/* ✅ correct */
color: var(--ink);
background: var(--surface);

/* ❌ wrong */
color: #20170f;
background: white;
```

---

## 2. Typography

- **Headings (`h2`)** — `font-family: var(--serif)` — creates authority and elegance
- **Body / labels** — `font-family: var(--sans)` — readable at small sizes
- **Code / monospace blocks** — `"SFMono-Regular", Consolas, "Liberation Mono", monospace`
- CJK (Chinese) support is built in via font stacks; no extra configuration needed

---

## 3. Slide Density

- Each slide conveys **1–2 core ideas** only
- Bullet lists: **maximum 5 items**; if more content exists, split to another slide
- Long prose paragraphs are forbidden — use `.lead` class for short introductory sentences
- Numbers / metrics go in `.metric-card` elements, not inline text

---

## 4. Section Markers

Use `.eyebrow` above `h2` for chapter / section labels:

```html
<p class="eyebrow">Part II</p>
<h2>Context Engineering</h2>
```

---

## 5. Animations

- The `.slide` element has `animation: slide-in 280ms ease` — this fires on every slide transition automatically
- Do **not** add additional `transition` or `animation` rules to individual slide content
- Hover effects on cards are acceptable (use `transition: transform 180ms ease`)

---

## 6. Navigation (already wired in template JS)

- `← / →` or `PageUp / PageDown` — prev/next
- `Space` — next
- `Home` / `End` — first / last
- Click anywhere (except `<a>` and `<button>`) — next
- URL hash updates automatically: `#slide-1`, `#slide-2`, …

---

## 7. Responsive

All multi-column grids collapse to `1fr` at `max-width: 1100px`.
Slides switch to compact padding at `max-width: 760px`.
Do not introduce `min-width` rules that would break mobile.

---

## 8. Speaker Notes

Include each slide's speaker notes as a hidden HTML comment at the end of the `<section>`:

```html
<section class="slide is-active" data-title="Cover" data-presenter="A">
  <!-- content -->
  <!-- SPEAKER NOTES: Opening 30s. Introduce the three engineers. -->
</section>
```

---

## 9. Accessibility

- Every `<img>` must have a meaningful `alt` attribute
- Colour contrast ratio ≥ 4.5:1 for body text
- Slide sections use `role="region"` automatically via `<section>` semantics

---

## 10. File output

The final output is a **single self-contained `.html` file**. All styles and scripts must be inline — no `<link>` or `<script src>` tags pointing to external resources.
