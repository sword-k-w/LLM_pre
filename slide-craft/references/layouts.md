# Layouts Reference

> Loaded during **Phase 5 (Generate)**. Choose the appropriate layout class and structure for each slide type.

---

## Layout 1 — `slide-grid-cover` · Cover / Title slide

**Use for:** The opening slide of the deck.

```html
<section class="slide is-active" data-title="Cover" data-presenter="A">
  <div class="slide-grid slide-grid-cover">
    <div>
      <p class="eyebrow">Course / Event Name</p>
      <h2>Main Presentation Title</h2>
      <p class="lead">Subtitle or one-sentence framing of the talk.</p>
    </div>
    <div class="cover-panel">
      <div class="metric-card content-card">
        <span>Metric label</span>
        <strong>Value</strong>
      </div>
      <div class="metric-card content-card">
        <span>Metric label</span>
        <strong>Value</strong>
      </div>
      <div class="metric-card content-card">
        <span>Metric label</span>
        <strong>Value</strong>
      </div>
    </div>
  </div>
  <!-- SPEAKER NOTES: ... -->
</section>
```

---

## Layout 2 — `slide-grid` · Two-column (text + cards)

**Use for:** Concept explanation with supporting evidence cards on the right.

```html
<section class="slide" data-title="Slide Title" data-presenter="B">
  <div class="slide-grid">
    <div>
      <p class="eyebrow">Section Label</p>
      <h2>Slide Heading</h2>
      <p class="lead">One or two sentence framing.</p>
      <ul>
        <li>Key point one</li>
        <li>Key point two</li>
        <li>Key point three</li>
      </ul>
    </div>
    <div class="card-stack">
      <div class="content-card">
        <h3>Card Title</h3>
        <p>Supporting detail or example.</p>
      </div>
      <div class="content-card accent-card">
        <h3>Highlighted Card</h3>
        <p>Most important point — use accent-card for emphasis.</p>
      </div>
    </div>
  </div>
  <!-- SPEAKER NOTES: ... -->
</section>
```

---

## Layout 3 — `card-stack` · Three-point stack

**Use for:** Presenting 2–4 parallel concepts with equal weight.

```html
<section class="slide" data-title="Slide Title">
  <p class="eyebrow">Section</p>
  <h2>Three Key Ideas</h2>
  <div class="card-stack" style="margin-top:1.2rem">
    <div class="content-card">
      <div class="badge">1</div>
      <h3>First Idea</h3>
      <p>Explanation — keep to 1–2 sentences.</p>
    </div>
    <div class="content-card">
      <div class="badge">2</div>
      <h3>Second Idea</h3>
      <p>Explanation.</p>
    </div>
    <div class="content-card">
      <div class="badge">3</div>
      <h3>Third Idea</h3>
      <p>Explanation.</p>
    </div>
  </div>
  <!-- SPEAKER NOTES: ... -->
</section>
```

---

## Layout 4 — `timeline-grid` · Process / timeline (4 steps)

**Use for:** Sequential processes, pipelines, workflows.

```html
<section class="slide" data-title="Process">
  <p class="eyebrow">Workflow</p>
  <h2>Four-Step Process</h2>
  <div class="timeline-grid">
    <div class="timeline-card content-card">
      <div class="badge">①</div>
      <strong>Step One</strong>
      <p>Brief description of what happens in this step.</p>
    </div>
    <div class="timeline-card content-card">
      <div class="badge">②</div>
      <strong>Step Two</strong>
      <p>Brief description.</p>
    </div>
    <div class="timeline-card content-card">
      <div class="badge">③</div>
      <strong>Step Three</strong>
      <p>Brief description.</p>
    </div>
    <div class="timeline-card content-card">
      <div class="badge">④</div>
      <strong>Step Four</strong>
      <p>Brief description.</p>
    </div>
  </div>
  <!-- SPEAKER NOTES: ... -->
</section>
```

---

## Layout 5 — `relationship-grid` · 2×2 concept matrix

**Use for:** Quadrant analysis, feature comparison by two axes.

```html
<section class="slide" data-title="Matrix">
  <p class="eyebrow">Comparison</p>
  <h2>2×2 Matrix Title</h2>
  <div class="relationship-grid">
    <div class="content-card">
      <h3>Quadrant A</h3>
      <p>Description of this quadrant.</p>
    </div>
    <div class="content-card accent-card">
      <h3>Quadrant B</h3>
      <p>Description — accent highlights the preferred quadrant.</p>
    </div>
    <div class="content-card">
      <h3>Quadrant C</h3>
      <p>Description.</p>
    </div>
    <div class="content-card">
      <h3>Quadrant D</h3>
      <p>Description.</p>
    </div>
  </div>
  <!-- SPEAKER NOTES: ... -->
</section>
```

---

## Layout 6 — `two-column` · Side-by-side comparison

**Use for:** Before/after, good/bad, approach A vs approach B.

```html
<section class="slide" data-title="Comparison">
  <p class="eyebrow">Contrast</p>
  <h2>Two Approaches</h2>
  <div class="two-column" style="margin-top:1.2rem">
    <div class="content-card">
      <h3>❌ Without Feature X</h3>
      <ul>
        <li>Problem one</li>
        <li>Problem two</li>
      </ul>
    </div>
    <div class="content-card accent-card">
      <h3>✅ With Feature X</h3>
      <ul>
        <li>Benefit one</li>
        <li>Benefit two</li>
      </ul>
    </div>
  </div>
  <!-- SPEAKER NOTES: ... -->
</section>
```

---

## Layout 7 — `slide-cover-center` · Chapter break / transition

**Use for:** Section dividers between major parts of the talk.

```html
<section class="slide" data-title="Part II" data-presenter="B">
  <div class="slide-cover-center">
    <p class="eyebrow">Part II of IV</p>
    <h2>Context Engineering</h2>
    <p class="lead">
      From "how to say it" to "what information to give and in what order."
    </p>
  </div>
  <!-- SPEAKER NOTES: Brief transition, 15s. Hand off from speaker A. -->
</section>
```

---

## Choosing the Right Layout

| Situation | Layout |
|-----------|--------|
| Opening / closing | `slide-grid-cover` |
| Main concept + supporting evidence | `slide-grid` |
| 2–4 parallel ideas | `card-stack` |
| Steps in a pipeline / process | `timeline-grid` |
| Quadrant / axis analysis | `relationship-grid` |
| Before vs after / A vs B | `two-column` |
| Between major sections | `slide-cover-center` |
