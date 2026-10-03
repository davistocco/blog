# Visual Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the blog's typography, spacing and page details (Young Serif titles, 38rem measure, 8px spacing scale, mobile list/cover, 404 guidance) without changing its identity.

**Architecture:** One stylesheet (`src/styles/global.css`) is rewritten around tokens (type scale, `--space-*`, `--font-display`); markup changes are small edits in the Astro layout and pages. The only logic change is `formatDateTime` omitting an unrecorded 00:00 time, covered by a node:test.

**Tech Stack:** Astro 7, plain CSS (`light-dark()`), Fontsource (`@fontsource/young-serif`), node:test (Node 24 runs `.ts` directly), pnpm.

**Spec:** `docs/superpowers/specs/2026-10-03-refinamento-visual-design.md`

## Global Constraints

- Colors unchanged: `--bg`, `--fg`, `--strong`, `--muted`, `--accent`, `--line`, `--code-bg`, `--code-bar` keep their current values.
- Body face Figtree, code face IBM Plex Mono, display face Young Serif (weight 400 only, `font-synthesis: none`).
- Column `max-width: 38rem`; body 16px below 40rem, 17px at ≥ 40rem; body `line-height: 1.65`.
- Type scale: title 28px (< 40rem) / 36px; h2 24px; h3 17px; list titles 18px; meta 14px; fine print 13px; 404 number 96px.
- Spacing tokens `--space-1`..`--space-7` = 0.5, 1, 1.5, 2, 3, 4, 6rem. Margins/paddings/gaps use tokens, or `em` inside `.post-content` prose.
- Single breakpoint: `40rem`.
- Copy: 404 pt-br "Esta página não existe ou mudou de endereço." + "Ver os posts"; en "This page doesn't exist or has moved." + "See the posts".
- Commits on `main`, `feat:` / `fix:` / `chore:` style, **no push**.

## Review Focus

- A post created at exactly 00:00 São Paulo time in a non-pt locale (`en`) must also drop the time (en renders midnight as "12:00 AM", so the check cannot compare formatted strings in the target locale). Pinned by the `en` assertion in Task 1.
- A post at 00:00 UTC (21:00 the previous day in São Paulo) must keep its time; the midnight check uses America/Sao_Paulo, not UTC. Pinned in Task 1.
- Very long post title on a 390px phone: full title visible, wraps, no horizontal scroll. Checked in Task 6 screenshots.
- Keyboard-only visitor on tool pages: every checkbox, number input, button and text input shows a visible focus ring. Checked in Task 6.
- Young Serif failing to load: headings fall back to Georgia at weight 400, never faux-bold. Ensured by `--font-display` fallback + `font-synthesis: none` in Task 2.

---

### Task 1: `formatDateTime` omits an unrecorded 00:00

**Files:**
- Modify: `src/lib/i18n.ts`
- Test: `src/lib/i18n.test.ts` (create)

**Interfaces:**
- Produces: `formatDateTime(date: Date, lang?: Lang): string` — unchanged signature; returns `formatDate(...)` alone when the São Paulo time is 00:00.

- [ ] **Step 1: Write the failing test**

Create `src/lib/i18n.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDate, formatDateTime } from './i18n.ts';

test('formatDateTime: date and time when time was recorded', () => {
  assert.equal(formatDateTime(new Date('2025-01-03T00:48:00-03:00')), '03/01/2025 00:48');
  assert.equal(formatDateTime(new Date('2025-01-03T14:05:00-03:00')), '03/01/2025 14:05');
});

test('formatDateTime: midnight in São Paulo means no time recorded, date only', () => {
  const midnight = new Date('2024-01-10T00:00:00-03:00');
  assert.equal(formatDateTime(midnight), '10/01/2024');
  assert.equal(formatDateTime(midnight, 'en'), formatDate(midnight, 'en'));
});

test('formatDateTime: midnight UTC is not midnight in São Paulo, keeps the time', () => {
  assert.equal(formatDateTime(new Date('2024-01-10T00:00:00Z')), '09/01/2024 21:00');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: the "midnight in São Paulo" test FAILS (`'10/01/2024 00:00' !== '10/01/2024'`); the other i18n tests and the existing cpf/password tests pass.

- [ ] **Step 3: Write minimal implementation**

In `src/lib/i18n.ts`, replace `formatDateTime` with:

```ts
// Posts without a recorded time were saved at 00:00; show only the date for those.
function isMidnight(date: Date) {
  const time = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: TIME_ZONE });
  return time === '00:00';
}

export function formatDateTime(date: Date, lang: Lang = 'pt-br') {
  if (isMidnight(date)) return formatDate(date, lang);
  const time = date.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', timeZone: TIME_ZONE });
  return `${formatDate(date, lang)} ${time}`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test`
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/i18n.ts src/lib/i18n.test.ts
git commit -m "fix: post date hides an unrecorded 00:00 time"
```

---

### Task 2: Foundations: Young Serif, tokens, stylesheet, header signature

**Files:**
- Modify: `package.json` / `pnpm-lock.yaml` (via `pnpm add`)
- Modify: `src/layouts/Base.astro` (font import + preload, brand crumb class)
- Rewrite: `src/styles/global.css`

**Interfaces:**
- Produces CSS classes later tasks use: `.sr-only`, `.item-list` (plain), `.item-list.dated` (date + title rows), `.home-list`, `.read-next` with `.read-next .label`, `.not-found` (with `h1`, `p`, `img`), `.crumbs .brand`.
- Removes: `.item-list.bulleted` (Task 3 drops its use).

- [ ] **Step 1: Install the font**

Run: `pnpm add @fontsource/young-serif`
Then: `ls node_modules/@fontsource/young-serif/files/ | grep latin-400-normal.woff2`
Expected: `young-serif-latin-400-normal.woff2` (use the exact name printed in Step 2 if it differs).

- [ ] **Step 2: Import and preload it in `Base.astro`**

In the frontmatter, after `import '@fontsource/ibm-plex-mono/500.css';` add:

```ts
import '@fontsource/young-serif';
```

and after the `figtreeLatin` import add:

```ts
import youngSerifLatin from '@fontsource/young-serif/files/young-serif-latin-400-normal.woff2?url';
```

In `<head>`, after the Figtree preload line add:

```astro
<link rel="preload" href={youngSerifLatin} as="font" type="font/woff2" crossorigin />
```

- [ ] **Step 3: Mark the brand crumb in `Base.astro`**

Replace the `<li>` opening inside `trail.map` so the first crumb carries the `brand` class:

```astro
{trail.map((crumb, i) => (
  <li class={i === 0 ? 'brand' : undefined}>
    {crumb.href && !(i === trail.length - 1 && (i > 0 || isHome))
      ? <a href={crumb.href}>{crumb.label}</a>
      : <span aria-current="page">{crumb.label}</span>}
  </li>
))}
```

- [ ] **Step 4: Rewrite `src/styles/global.css`**

Replace the whole file with:

```css
/* ── Tokens ────────────────────────────────────────────────── */
/* Dark is the blog's identity. Light follows the system preference,
   unless the theme button set data-theme on <html>.
   Colors use light-dark(light, dark). */
:root {
  --font-body: 'Figtree Variable', system-ui, sans-serif;
  --font-display: 'Young Serif', Georgia, serif;
  --font-code: 'IBM Plex Mono', ui-monospace, monospace;

  /* Type scale, from The Elements of Typographic Style (16, 18, 24, 36...) */
  --text-xs: 0.8125rem;   /* 13px: copy buttons */
  --text-sm: 0.875rem;    /* 14px: meta, dates, crumbs, footer */
  --text-body: 1rem;      /* 16px on phones, 17px from 40rem */
  --text-lg: 1.125rem;    /* 18px: list titles, signature */
  --text-xl: 1.5rem;      /* 24px: h2 */
  --text-title: 1.75rem;  /* 28px on phones, 36px from 40rem */
  --text-display: 6rem;   /* 96px: the 404 number */

  /* Spacing: 8px steps. Use these instead of loose numbers. */
  --space-1: 0.5rem;  /* 8 */
  --space-2: 1rem;    /* 16 */
  --space-3: 1.5rem;  /* 24 */
  --space-4: 2rem;    /* 32 */
  --space-5: 3rem;    /* 48 */
  --space-6: 4rem;    /* 64 */
  --space-7: 6rem;    /* 96 */

  color-scheme: dark;
}

@media (min-width: 40rem) {
  :root {
    --text-body: 1.0625rem; /* 17px */
    --text-title: 2.25rem;  /* 36px */
  }
}

@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) { color-scheme: light; }
}
:root[data-theme="light"] { color-scheme: light; }

/* Neutral newspaper palette. Body is not pure black/white, to ease long reads. */
:root {
  --bg: light-dark(#FFFFFF, #121212);
  --fg: light-dark(#121212, #E2E2E2);
  --strong: light-dark(#000000, #F5F5F5);
  --muted: light-dark(#5A5A5A, #A0A0A0);
  --accent: light-dark(#326891, #7FB2DE);
  --line: light-dark(#DFDFDF, #333333);
  --code-bg: light-dark(#F7F7F7, #1A1A1A);
  --code-bar: light-dark(#EDEDED, #242424);
}

/* ── Base ──────────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; }

html { overflow-x: clip; overflow-y: scroll; scroll-padding-top: var(--space-6); }

body {
  margin: 0;
  padding: 0 var(--space-2) var(--space-3);
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: var(--text-body);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  color: var(--strong);
  line-height: 1.2;
  text-wrap: balance;
}

/* Young Serif has a single weight: never let the browser fake a bold one */
h1, h2, h3, .crumbs .brand, .item-list a, .read-next a {
  font-family: var(--font-display);
  font-weight: 400;
  font-synthesis: none;
}

h4, h5, h6 { font-weight: 600; }

h1 { font-size: var(--text-title); letter-spacing: -0.01em; line-height: 1.15; margin: 0; }
h2 { font-size: var(--text-xl); }
h3 { font-size: var(--text-body); }

strong, b { font-weight: 600; color: var(--strong); }

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
.post-content a { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 0.2em; }
.post-content a:hover { text-decoration-thickness: 2px; }
:is(a, button, input, select):focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

img { max-width: 100%; }

/* Visible only to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

/* ── Layout ────────────────────────────────────────────────── */
/* 38rem = 608px: about 70 characters per line at 17px */
.wrapper {
  width: 100%;
  max-width: 38rem;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.wrapper > main { flex: 1; }

/* ── Header ────────────────────────────────────────────────── */
/* Not pinned for now. To pin it again: position: sticky; top: 0; z-index: 10; and restore the
   scroll-fade script in Base.astro (git history has it). */
.menu {
  position: relative;
  padding: var(--space-1) 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Tinted glass layer, full viewport width (the bar itself is only as wide as the column).
   Its opacity can follow the scroll through --menu-fade (unset = hidden: the plain top-of-page look). */
.menu::before {
  content: '';
  position: absolute;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 100vw;
  transform: translateX(-50%);
  opacity: var(--menu-fade, 0);
  background: linear-gradient(
    60deg,
    light-dark(var(--code-bar), rgb(30 30 30)),
    light-dark(var(--code-bar), rgb(22 22 22))
  );
  box-shadow: 0 6px 16px -4px rgb(0 0 0 / 0.5);
  pointer-events: none;
}

.theme-toggle {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  margin-left: auto;
  padding: 0;
  color: var(--muted);
  background: none;
  border: 0;
  cursor: pointer;
}

.theme-toggle svg {
  width: 1.125rem;
  height: 1.125rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Show the icon of the theme the button switches to. Pure CSS, so the right icon
   is there on first paint (no waiting for the script at the end of the page). */
.theme-toggle .icon-moon { display: none; }
@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) .theme-toggle .icon-sun { display: none; }
  :root:not([data-theme="dark"]) .theme-toggle .icon-moon { display: block; }
}
:root[data-theme="light"] .theme-toggle .icon-sun { display: none; }
:root[data-theme="light"] .theme-toggle .icon-moon { display: block; }

.theme-toggle:hover { color: var(--accent); }

/* Breadcrumb: the site signature first, then the trail in small muted text */
.crumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: var(--text-sm);
  color: var(--muted);
}
.crumbs li + li::before { content: '/'; margin: 0 var(--space-1); }
.crumbs a { color: inherit; }
.crumbs a:hover { color: var(--accent); }
.crumbs [aria-current] { color: var(--fg); }

.crumbs .brand { font-size: var(--text-lg); }
.crumbs .brand > * { color: var(--strong); }
.crumbs .brand a:hover { color: var(--accent); text-decoration: none; }

/* ── Cover ─────────────────────────────────────────────────── */
/* Wide rectangle between the menu and the page title; taller on phones so the photo still reads */
.cover {
  aspect-ratio: 5 / 2;
  margin-top: var(--space-3);
  background: var(--code-bar);
  border-radius: 4px;
  overflow: hidden;
}
@media (min-width: 40rem) {
  .cover { aspect-ratio: 4 / 1; }
}
.cover img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* ── Page title ────────────────────────────────────────────── */
/* Every page title (post, tool) sits at the same spot below the menu or cover */
.page-title { margin: var(--space-4) 0 var(--space-5); }
.page-title .meta { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 var(--space-2); margin-top: var(--space-1); }

.date {
  font-size: var(--text-sm);
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

/* ── Item list (home posts, tools index) ───────────────────── */
.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--space-3);
}

.item-list li { display: grid; line-height: 1.3; }
.item-list a { font-size: var(--text-lg); color: var(--strong); }
.item-list a:hover { color: var(--accent); }

/* Phones: date on its own line, full title below. Wider: date column + title column,
   a long title wraps inside its own column. */
@media (min-width: 40rem) {
  .item-list.dated li {
    grid-template-columns: 5.5rem minmax(0, 1fr);
    column-gap: var(--space-3);
    align-items: baseline;
  }
}

.home-list { margin-top: var(--space-4); }

/* ── Read next (end of post) ───────────────────────────────── */
.read-next {
  margin: var(--space-6) 0 0;
  padding-top: var(--space-3);
  border-top: 1px solid var(--line);
  line-height: 1.3;
}
.read-next .label { display: block; margin-bottom: var(--space-1); font-size: var(--text-sm); color: var(--muted); }
.read-next a { font-size: var(--text-lg); color: var(--strong); }
.read-next a:hover { color: var(--accent); }

/* ── Tools ─────────────────────────────────────────────────── */
/* Buttons, inputs and selects share one 40px height */
.tool + .tool { margin-top: var(--space-5); }
.tool h2 { margin: 0 0 var(--space-2); }
.tool-form { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2) var(--space-3); }
.tool-form label { display: inline-flex; align-items: center; gap: var(--space-1); font-size: var(--text-sm); }

.tool input[type="checkbox"] { accent-color: var(--accent); width: 1rem; height: 1rem; margin: 0; }

.tool input[type="number"], .tool select, .tool-input {
  height: 2.5rem;
  font: inherit;
  font-size: var(--text-sm);
  color: var(--fg);
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 0 var(--space-1);
}
.tool input[type="number"] { width: 4.5rem; }
.tool-input { width: 100%; font-family: var(--font-code); font-size: var(--text-body); padding: 0 var(--space-2); }

.tool button {
  height: 2.5rem;
  font: inherit;
  font-size: var(--text-sm);
  color: var(--bg);
  background: var(--strong);
  border: 0;
  border-radius: 4px;
  padding: 0 var(--space-2);
  cursor: pointer;
}
.tool button:hover { background: var(--accent); }

.tool-field { position: relative; margin-top: var(--space-2); }
.tool-field .tool-input { padding-right: 5.5rem; }
.tool .tool-field .copy {
  position: absolute;
  top: 50%;
  right: var(--space-1);
  transform: translateY(-50%);
  height: 1.75rem;
  font-size: var(--text-xs);
  color: var(--muted);
  background: none;
  border: 1px solid var(--line);
  padding: 0 var(--space-1);
}
.tool .tool-field .copy:hover { color: var(--accent); background: none; border-color: var(--accent); }

.tool-status { margin: var(--space-1) 0 0; min-height: 1.75rem; font-weight: 500; }
.tool-status.ok { color: light-dark(#1a7f37, #56d364); }
.tool-status.bad { color: light-dark(#b42318, #ff8a80); }
.tool-status.warn { color: light-dark(#9a6700, #e3b341); }

/* ── Post page ─────────────────────────────────────────────── */
/* Prose rhythm in em, so it scales with the body size. Headings get more space
   above than below, so they stick to the text they introduce. */
.post-content p { margin: 1.25em 0; text-wrap: pretty; }
.post-content > :first-child { margin-top: 0; }
.post-content h2 { margin: 2em 0 0.5em; line-height: 1.25; }
.post-content h3 { margin: 2em 0 0.5em; line-height: 1.3; }
.post-content h2 + *, .post-content h3 + * { margin-top: 0; }
.post-content ul, .post-content ol { margin: 1.25em 0; padding-left: 1.625em; }
.post-content li { margin: 0.5em 0; padding-left: 0.375em; }
.post-content li::marker { color: var(--muted); }

.post-content blockquote {
  margin: 1.6em 0;
  padding-left: 1em;
  border-left: 2px solid var(--muted);
  font-style: italic;
  font-size: 1.0625em;
}

.post-content code {
  font-family: var(--font-code);
  font-size: var(--text-sm);
}

.post-content :not(pre) > code {
  background: var(--code-bg);
  padding: 0.15em 0.35em;
  border-radius: 4px;
}

/* Code blocks: editor window (bar with dots + copy button), added by the
   Shiki transformer in astro.config.mjs */
.code-window {
  margin: 1.75em 0;
  border: 1px solid var(--line);
  border-radius: 8px;
  overflow: hidden;
  background: var(--code-bg);
}

.code-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-1) var(--space-2);
  background: var(--code-bar);
  border-bottom: 1px solid var(--line);
}

.code-bar .dots { display: flex; gap: var(--space-1); }
.code-bar .dots i { width: 10px; height: 10px; border-radius: 50%; background: var(--line); }

.code-bar .copy {
  height: 1.75rem;
  font: inherit;
  font-size: var(--text-xs);
  color: var(--muted);
  background: none;
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 0 var(--space-1);
  cursor: pointer;
}

.code-bar .copy:hover { color: var(--accent); border-color: var(--accent); }

.post-content pre {
  margin: 0;
  padding: 1em 1.25em;
  overflow-x: auto;
  font-size: var(--text-sm);
  line-height: 1.7;
}

.post-content pre code { font-size: inherit; }

/* Shiki dual themes: pick the palette matching the current color scheme */
.astro-code, .astro-code span {
  color: var(--shiki-dark);
  font-style: var(--shiki-dark-font-style);
}
.astro-code { background-color: transparent !important; }

@media (prefers-color-scheme: light) {
  :root:not([data-theme="dark"]) :is(.astro-code, .astro-code span) {
    color: var(--shiki-light);
    font-style: var(--shiki-light-font-style);
  }
}

:root[data-theme="light"] :is(.astro-code, .astro-code span) {
  color: var(--shiki-light);
  font-style: var(--shiki-light-font-style);
}

.post-content table { width: 100%; border-collapse: collapse; display: block; overflow-x: auto; }
.post-content th, .post-content td { border: 1px solid var(--line); padding: 0.3em; }

/* ── Footer ────────────────────────────────────────────────── */
footer {
  margin-top: var(--space-6);
  padding-top: var(--space-2);
  border-top: 1px solid var(--line);
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-1) var(--space-3);
  font-size: var(--text-sm);
  color: var(--muted);
}

footer p { margin: 0; }
footer a { color: inherit; }
footer a:hover { color: var(--accent); }

footer ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0 var(--space-3);
}

/* ── 404 ───────────────────────────────────────────────────── */
.not-found { text-align: center; padding-top: var(--space-5); }
.not-found h1 { font-size: var(--text-display); line-height: 1; letter-spacing: -0.02em; }
.not-found p { margin: var(--space-2) 0 var(--space-1); }

.not-found img {
  max-width: 30rem;
  width: 100%;
  margin: var(--space-4) auto 0;
  display: block;
}
```

- [ ] **Step 5: Build**

Run: `pnpm build`
Expected: `7 page(s) built`, no errors.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml src/layouts/Base.astro src/styles/global.css
git commit -m "feat: Young Serif titles, 38rem measure, type scale and 8px spacing tokens"
```

---

### Task 3: Home and tools lists

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/tools/index.astro`

**Interfaces:**
- Consumes: `.sr-only`, `.item-list`, `.item-list.dated`, `.home-list` from Task 2.

- [ ] **Step 1: Home markup**

Replace the body of `src/pages/index.astro` (everything after the frontmatter) with:

```astro
<Base>
  <h1 class="sr-only">Posts</h1>

  <ul class="item-list dated home-list">
    {posts.map((post) => (
      <li>
        <span class="date">{formatDate(post.data.createdAt)}</span>
        <a href={url(`posts/${post.id}/`)}>{post.data.title}</a>
      </li>
    ))}
  </ul>
</Base>
```

and remove the now-unused `import PageTitle from '../components/PageTitle.astro';` line.

- [ ] **Step 2: Tools index markup**

In `src/pages/tools/index.astro`, change `<ul class="item-list bulleted">` to `<ul class="item-list">`.

- [ ] **Step 3: Build**

Run: `pnpm build`
Expected: `7 page(s) built`, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro src/pages/tools/index.astro
git commit -m "feat: home list without ellipsis (date above title on phones), tools list matches"
```

---

### Task 4: "Continue lendo" block

**Files:**
- Modify: `src/pages/posts/[slug].astro`

**Interfaces:**
- Consumes: `.read-next`, `.read-next .label` from Task 2; `ui[lang].readNext` (existing).

- [ ] **Step 1: Markup**

Replace the read-next block with:

```astro
{next && (
  <p class="read-next">
    <span class="label">{t.readNext}</span>
    <a href={url(`posts/${next.id}/`)}>{next.data.title}</a>
  </p>
)}
```

- [ ] **Step 2: Build**

Run: `pnpm build`
Expected: `7 page(s) built`, no errors.

- [ ] **Step 3: Commit**

```bash
git add "src/pages/posts/[slug].astro"
git commit -m "feat: read-next block with divider, next title in the list style"
```

---

### Task 5: 404 that points the way

**Files:**
- Modify: `src/lib/i18n.ts` (strings)
- Modify: `src/pages/404.astro`

**Interfaces:**
- Produces: `ui[lang].notFound` (new text), `ui[lang].seePosts` (new key).
- Consumes: `.not-found` styles from Task 2.

- [ ] **Step 1: Strings**

In `src/lib/i18n.ts`, in `'pt-br'` replace `notFound: 'Página não encontrada',` with:

```ts
    notFound: 'Esta página não existe ou mudou de endereço.',
    seePosts: 'Ver os posts',
```

and in `en` replace `notFound: 'Page not found',` with:

```ts
    notFound: "This page doesn't exist or has moved.",
    seePosts: 'See the posts',
```

- [ ] **Step 2: Markup**

Replace the body of `src/pages/404.astro` (after the frontmatter) with:

```astro
<Base title="404" cover={false}>
  <div class="not-found">
    <h1>404</h1>
    <p>{ui['pt-br'].notFound}</p>
    <a href={url()}>{ui['pt-br'].seePosts}</a>
    <a href={url()} tabindex="-1" aria-hidden="true">
      <img src={url('images/not-found.gif')} alt="" />
    </a>
  </div>
</Base>
```

(The gif link is a duplicate of "Ver os posts", so it is hidden from keyboard and screen readers.)

- [ ] **Step 3: Tests and build**

Run: `pnpm test && pnpm build`
Expected: all tests PASS; `7 page(s) built`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/i18n.ts src/pages/404.astro
git commit -m "feat: 404 with a big number, a clear message and a way back"
```

---

### Task 6: Visual verification and housekeeping

**Files:**
- Modify: `IDEAS.md`

- [ ] **Step 1: IDEAS.md**

Delete the line `- Voltar com uma fonte de personalidade nos títulos (a Comic Shanns saiu em 30/09/2026; por enquanto é Figtree em tudo).` and, if the `## Visual` section is then empty, delete its heading too.

- [ ] **Step 2: Build and serve**

```bash
pnpm build
cd dist && python3 -m http.server 4411 &
```

- [ ] **Step 3: Screenshots (light/dark × 1280/390)**

```bash
S=<scratchpad>/shots-after; mkdir -p $S
shot(){ google-chrome --headless=new --disable-gpu --hide-scrollbars --force-color-profile=srgb --virtual-time-budget=3000 --blink-settings=preferredColorScheme=$3 --window-size=$2 --screenshot=$S/$1.png "$4" >/dev/null 2>&1; }
B=http://localhost:4411
for p in "home:/" "post-bistro:/posts/bistro-dogueria-uma-analise-contemplativa/" "post-tech:/posts/gerando-handlers-com-openai-function-calling-e-nodejs/" "tools:/tools/" "cpf:/tools/cpf/" "password:/tools/password/" "404:/404.html"; do
  n=${p%%:*}; u=${p#*:}
  shot $n-desk-light 1280,1400 1 $B$u; shot $n-desk-dark 1280,1400 0 $B$u
  shot $n-mob-light 390,1600 1 $B$u;   shot $n-mob-dark 390,1600 0 $B$u
done
```

Review every image against the spec: Young Serif on titles/signature/list; no ellipsis; date above title on 390px; cover 5:2 on 390px; tech post meta shows `10/01/2024` without `00:00`; 404 big number + message + link; tool controls same height, checkbox in accent blue; no content cut at the right edge on 390px.

- [ ] **Step 4: Horizontal overflow and focus check**

`html` has `overflow-x: clip`, so overflow shows up as content cut at the right edge in the 390px screenshots rather than as a scrollbar: confirm no text, input or code-window border is cut in the `*-mob-*` images (code inside `pre` scrolling on its own is expected).

Focus: confirm `:is(a, button, input, select):focus-visible` in `global.css` covers every control on `/tools/cpf/` and `/tools/password/` (checkboxes and number inputs are `input`), then ask Davi to press Tab through `/tools/password/` once in his browser. Fix any failure in `global.css` before committing.

- [ ] **Step 5: Stop the server and commit**

```bash
kill %1
git add IDEAS.md
git commit -m "chore: display font in titles is done, drop it from IDEAS"
```
