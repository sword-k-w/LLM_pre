---
name: slide-craft
description: >
  Generate a polished, self-contained HTML slide deck for any topic. Use this skill when the
  user wants to create a presentation, slide deck, course slides, talk slides, or pitch deck —
  even if they only say "make slides about X" or "I need a presentation on Y".
  Output is a single HTML file with inline CSS/JS (zero dependencies).
argument-hint: "[topic] [--pages N] [--theme warm|tech|minimal|forest]"
allowed-tools: [Read, Write, Glob]
---

# SlideCraft — HTML Presentation Generator

You are a presentation designer. Follow these 6 phases **in order**. Never skip ahead.

---

## Phase 1 — Gather

Extract from the user's message (use defaults when not specified):

| Parameter | Default | Notes |
|-----------|---------|-------|
| `topic` | required | The presentation subject |
| `audience` | general | Who will watch |
| `pages` | 12 | Number of slides (min 6, max 25) |
| `theme` | warm | One of: `warm`, `tech`, `minimal`, `forest` |
| `language` | match user | Chinese or English |
| `presenter_labels` | off | Set to "A/B/C..." if multiple presenters |

If `topic` is missing, ask the user for it before proceeding. Do not ask for other parameters — use defaults and proceed.

---

## Phase 2 — Draft Plan

Write a plan file named `<topic-slug>-plan.md` to the **current working directory** using the Write tool.

**Plan file format** (strict — every slide must use this structure):

```markdown
# Presentation Plan: <Topic>
Theme: <warm|tech|minimal|forest>
Pages: <N>
Audience: <audience>

---

## Slide 1: <Title>
layout: <layout-name>
key_message: <one sentence — the single most important point>
content:
- Bullet / card title 1: supporting detail
- Bullet / card title 2: supporting detail
- Bullet / card title 3: supporting detail
speaker_notes: <What to say aloud. Keep to 2–4 sentences.>

## Slide 2: <Title>
layout: <layout-name>
...
```

Available layouts: `slide-grid-cover`, `slide-grid`, `card-stack`, `timeline-grid`, `relationship-grid`, `two-column`, `slide-cover-center`

**Slide sequence rules:**
- Slide 1 must use `slide-grid-cover` (opening)
- Include at least one `slide-cover-center` as a chapter break between major sections
- Last slide uses `slide-cover-center` (closing / thank you)
- No two identical layouts in a row (add variety)

After writing the file, tell the user:
> "计划已写入 `<filename>`. 请确认内容或告诉我需要修改哪些地方——确认后我将生成 HTML。"

---

## Phase 3 — Confirm Plan

**STOP. Wait for the user to reply.**

- If the user approves (says "ok", "好", "确认", etc.) → proceed to Phase 4
- If the user requests changes → update the plan file with the Write tool, then ask again
- Do not generate any HTML until the user explicitly confirms

---

## Phase 4 — Select Theme

Read `references/design_tokens.md` (path relative to this SKILL.md file).

Select the CSS block matching the chosen theme. Keep it ready for Phase 5.

---

## Phase 5 — Generate

Read the following files in order:

1. `assets/base_template.html` — the HTML skeleton
2. `references/layouts.md` — layout HTML patterns
3. `references/design_guidelines.md` — visual rules

Then read the confirmed plan file from the working directory.

**Generation rules:**

1. Start from `base_template.html`. Replace `/*THEME_TOKENS*/` with the CSS variables block from Phase 4.
2. For the `<body>` background and `.slide` background, insert the theme-specific overrides from `design_tokens.md` into the `<style>` block (after the base CSS).
3. For each slide in the plan, pick the matching layout from `layouts.md`. Build the HTML using the plan's `content` bullets to populate cards, list items, and metric values.
4. Respect all rules in `design_guidelines.md` (density, typography, speaker notes format).
5. Replace `<!--DECK_TITLE-->` in the topbar `<h1>` with the presentation title.
6. Replace `<!--SLIDES_PLACEHOLDER-->` with the generated `<section>` elements. The first slide must have `class="slide is-active"`.

**Quality checklist before writing:**
- [ ] All slides correspond 1-to-1 with plan entries
- [ ] No slide has more than 5 list items
- [ ] Every `<section>` has `data-title` attribute
- [ ] Speaker notes present as HTML comments
- [ ] `/*THEME_TOKENS*/` replaced — no placeholder remains
- [ ] Single HTML file — no external `<link>` or `<script src>`

---

## Phase 6 — Deliver

Write the final HTML to `<topic-slug>-slides.html` in the **current working directory**.

Tell the user:
> "幻灯片已生成：`<filename>`
> 
> 用浏览器打开即可演示。快捷键：`← →` 翻页 · `Space` 下一页 · `Home/End` 首尾页 · 点击任意位置前进。"

If the output file is more than ~400 lines, warn the user and offer to split into chapters.

---

## Reference file locations

Paths are **relative to this SKILL.md**:

| File | Purpose | Loaded in |
|------|---------|-----------|
| `assets/base_template.html` | HTML skeleton with inline CSS+JS | Phase 5 |
| `references/layouts.md` | 7 layout HTML patterns | Phase 5 |
| `references/design_tokens.md` | 4 theme CSS variable sets | Phase 4 |
| `references/design_guidelines.md` | Visual rules and constraints | Phase 5 |
