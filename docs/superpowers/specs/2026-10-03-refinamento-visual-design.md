# Visual refinement (design)

## Intent
Davi likes the current look and its personality; he wants it refined with design
fundamentals he lacks as a backend dev. Not a new identity. Success: he opens the
site, recognizes his blog, and it reads as better finished; every change has a
plain reason.

Kept as is: neutral newspaper palette and link blues, Figtree body, IBM Plex Mono
code, code-window blocks, light/dark toggle, photo covers, breadcrumb header,
"Criado:" date with time, Travolta 404 gif, footer links. No new features.

## Foundations (`src/styles/global.css`)

### Measure and body
- Column `max-width` 42rem → **38rem** (~70 characters per line).
- Body 16px → **17px** at ≥ 40rem viewport; 16px below.
- Body `line-height` 1.75 → **1.65**.

### Display face
- **Young Serif** (`@fontsource/young-serif`, self-hosted, weight 400 only) for
  h1–h3, the header signature, list titles and the 404 number.
  Token `--font-display: 'Young Serif', Georgia, serif`.
- Headings set `font-weight: 400` and `font-synthesis: none` (no faux bold).
- Preload its latin woff2 in `Base.astro`, like Figtree.

### Type scale (Elements of Typographic Style)
| Role | Size | Face |
|---|---|---|
| h1 (post / page title) | 36px; 28px below 40rem | Young Serif |
| h2 | 24px | Young Serif |
| h3 | 17px (body size) | Young Serif |
| list titles (home, tools, read-next) | 18px | Young Serif |
| body | 17px / 16px | Figtree |
| meta, date, footer, crumbs | 14px | Figtree |
| fine print (copy buttons) | 13px | Figtree |

### Spacing
- 8px base. Tokens `--space-1`..`--space-7` = 8, 16, 24, 32, 48, 64, 96px (in rem).
- Every margin/padding/gap in the stylesheet uses a token (or an `em` value inside
  `.post-content` prose rhythm). No loose numbers.
- Remove the duplicated `.tool-field` / `.copy` block.

## Pages

### Header (`Base.astro`)
- First crumb `davistocco` is the signature: Young Serif 18px, `--strong`, no
  underline, identical on every page (link on all pages except home).
- Following crumbs: Figtree 14px, `--muted`; current page not a link; `/` separators.
- Theme toggle unchanged.

### Home (`src/pages/index.astro`)
- Visible "Posts" title removed; `<h1>` kept, visually hidden (`.sr-only`).
- List (shared `.item-list`):
  - ≥ 40rem: two columns, fixed date column + title column; long titles wrap inside
    the title column (no ellipsis).
  - < 40rem: date on its own line, full title below.
  - Title: Young Serif 18px, `--strong`, hover `--accent`. Items `--space-3` apart.

### Cover (`Cover.astro` CSS)
- 4:1 at ≥ 40rem; **5:2** below. Radius 4px stays.

### Post (`src/pages/posts/[slug].astro`)
- Spacing: cover → title `--space-4`; title → meta `--space-1`; meta → content `--space-5`.
- Meta format unchanged, except `formatDateTime` omits the time when it is exactly
  00:00 in America/Sao_Paulo (time not recorded).
- Prose h2 24px: more space above than below (`2em` / `0.5em`); h3 likewise.
- "Continue lendo": top border (`--line`), `--space-6` above, label 14px muted on
  its own line, next post title below in the list-title style.

### Tools
- Index (`tools/index.astro`): same list style as home, without dates (no bullets).
- Tool pages: `accent-color: var(--accent)` on checkboxes; buttons, selects and
  inputs share one height (40px); `:focus-visible` outline on every control.

### 404 (`404.astro`, `i18n.ts`)
- "404" in Young Serif ~96px, `--strong`, centered.
- Text: pt-br "Esta página não existe ou mudou de endereço." / en "This page doesn't
  exist or has moved."
- Link: pt-br "Ver os posts" / en "See the posts" → home.
- Gif below, centered, still links home.

### Footer
- Unchanged content; spacing via tokens.

### Housekeeping
- `IDEAS.md`: drop "Voltar com uma fonte de personalidade nos títulos" (done).

## Out of scope
Colors, code-block styling, RSS, post content, tool behavior.

## Verification
- `pnpm test`: new test for `formatDateTime` (midnight → date only; other times →
  date + time), written first and seen failing.
- `pnpm build` clean.
- Before/after screenshots of home, both posts, tools index, CPF tool and 404, in
  light/dark × 1280px/390px, reviewed.
- No horizontal scroll at 390px; Tab shows visible focus on links, buttons, inputs;
  Young Serif loads without visible swap.
- Small commits per area (`feat:` / `fix:`), on `main`, no push unless asked.
