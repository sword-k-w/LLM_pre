# Design Tokens — 4 Themes

> Loaded during **Phase 4 (Select Theme)**. Replace `/*THEME_TOKENS*/` in `base_template.html` with the chosen theme block.

---

## Theme 1 — `warm` (default)

Academic / humanities. Warm parchment tones, terracotta accent.

```css
:root {
  --bg: #f4efe5;
  --bg-strong: #e5d6bf;
  --surface: rgba(255, 250, 242, 0.82);
  --surface-strong: rgba(255, 248, 236, 0.94);
  --ink: #20170f;
  --muted: #6f6154;
  --accent: #b6542e;
  --accent-strong: #8e3412;
  --forest: #2d5a4f;
  --line: rgba(32, 23, 15, 0.12);
  --shadow: 0 22px 48px rgba(65, 36, 15, 0.12);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  --sans: "Avenir Next", "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", sans-serif;
  --serif: "Iowan Old Style", "Palatino Linotype", "Songti SC", serif;
}

/* warm: body gradient */
body {
  background:
    radial-gradient(circle at top left, rgba(255, 219, 178, 0.7), transparent 32%),
    radial-gradient(circle at 85% 15%, rgba(111, 179, 158, 0.25), transparent 24%),
    linear-gradient(135deg, #fbf6ee 0%, #efe3d0 52%, #efe7dc 100%);
}

/* warm: slide card */
.slide {
  background: linear-gradient(160deg, rgba(255, 251, 245, 0.9), rgba(252, 244, 233, 0.8));
}

/* warm: progress bar */
.progress-fill {
  background: linear-gradient(90deg, var(--accent), #d89d61, var(--forest));
}
```

---

## Theme 2 — `tech`

Developer / technical talk. Dark background, electric blue accent.

```css
:root {
  --bg: #0f1117;
  --bg-strong: #1a1d27;
  --surface: rgba(26, 30, 44, 0.88);
  --surface-strong: rgba(30, 35, 52, 0.96);
  --ink: #e8eaf0;
  --muted: #8890a8;
  --accent: #4f8ef7;
  --accent-strong: #2b6be0;
  --forest: #34c78a;
  --line: rgba(232, 234, 240, 0.1);
  --shadow: 0 22px 48px rgba(0, 0, 0, 0.45);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  --sans: "Inter", "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", sans-serif;
  --serif: "Georgia", "Songti SC", serif;
}

body {
  background:
    radial-gradient(circle at top left, rgba(79, 142, 247, 0.12), transparent 35%),
    radial-gradient(circle at 80% 20%, rgba(52, 199, 138, 0.08), transparent 28%),
    linear-gradient(135deg, #0f1117 0%, #141820 60%, #0f1117 100%);
}

.slide {
  background: linear-gradient(160deg, rgba(26, 30, 44, 0.92), rgba(20, 24, 38, 0.88));
}

.progress-fill {
  background: linear-gradient(90deg, var(--accent), #6ab0ff, var(--forest));
}
```

---

## Theme 3 — `minimal`

Business / clean. Pure white, charcoal ink, no decorative gradients.

```css
:root {
  --bg: #ffffff;
  --bg-strong: #f5f5f5;
  --surface: rgba(255, 255, 255, 0.95);
  --surface-strong: rgba(255, 255, 255, 0.99);
  --ink: #1a1a1a;
  --muted: #666666;
  --accent: #1a1a1a;
  --accent-strong: #000000;
  --forest: #2a7a5a;
  --line: rgba(0, 0, 0, 0.1);
  --shadow: 0 8px 24px rgba(0, 0, 0, 0.07);
  --radius-xl: 16px;
  --radius-lg: 12px;
  --radius-md: 8px;
  --sans: "Helvetica Neue", "Arial", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", sans-serif;
  --serif: "Georgia", "Times New Roman", "Songti SC", serif;
}

body {
  background: #f8f8f8;
}

.slide {
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.06);
}

.progress-fill {
  background: linear-gradient(90deg, #1a1a1a, #444444);
}
```

---

## Theme 4 — `forest`

Nature / environmental. Deep forest green, mint accent.

```css
:root {
  --bg: #0e1f1a;
  --bg-strong: #162b24;
  --surface: rgba(18, 38, 32, 0.88);
  --surface-strong: rgba(22, 44, 36, 0.96);
  --ink: #d8ede6;
  --muted: #7aad97;
  --accent: #52c4a0;
  --accent-strong: #35a882;
  --forest: #f0c060;
  --line: rgba(216, 237, 230, 0.1);
  --shadow: 0 22px 48px rgba(0, 0, 0, 0.4);
  --radius-xl: 28px;
  --radius-lg: 20px;
  --radius-md: 14px;
  --sans: "Avenir Next", "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", sans-serif;
  --serif: "Iowan Old Style", "Palatino Linotype", "Songti SC", serif;
}

body {
  background:
    radial-gradient(circle at top left, rgba(82, 196, 160, 0.14), transparent 32%),
    radial-gradient(circle at 80% 15%, rgba(240, 192, 96, 0.08), transparent 24%),
    linear-gradient(135deg, #0e1f1a 0%, #132820 55%, #0e1f1a 100%);
}

.slide {
  background: linear-gradient(160deg, rgba(20, 42, 36, 0.92), rgba(14, 30, 24, 0.88));
}

.progress-fill {
  background: linear-gradient(90deg, var(--accent), #80d4b8, var(--forest));
}
```
