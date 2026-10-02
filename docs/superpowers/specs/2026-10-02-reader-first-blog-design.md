# Reader-first blog — design

## Intent
The blog is for the reader, not a showcase of the author. Name stays `davistocco`.
It offers timeless content: reflections and teachings that work indirectly (stories,
questions, scripture in everyday life), not tutorials or hard technical posts.
The author is not a frequent writer yet; the site must work with few posts and no
cadence pressure. Success: a stranger lands on a post, gets something from it, and
can come back (RSS).

Supersedes the earlier "professional showcase / portfolio" goal; that becomes a
possible side effect, not the aim.

## Approach
Reframe in place (keep the Astro structure). Theme pages and newsletter are deferred.

## Changes

### Home (`src/pages/index.astro`)
- Keep title "Davi Stocco"; remove the "blog" caption.
- Add a short reader-facing promise under the title (placeholder PT-BR text, the
  author rewrites it): "Reflexões sobre a vida, a fé e o que a gente aprende sem
  perceber. Histórias pequenas, com mais perguntas do que respostas."
- List shows date + title only; tags are no longer rendered.

### Post page (`src/pages/posts/[slug].astro`)
- End-of-post "read next" link to the neighboring listed post; omitted if none.
- Optional `description` continues to feed the link preview.

### Content model (`src/content.config.ts`, `src/lib/posts.ts`)
- Add `unlisted: z.boolean().default(false)`.
- `getPosts()` excludes unlisted posts (home, read-next, RSS). Post pages still
  build for every post, so unlisted URLs keep working.
- `tags` stays optional in the schema but is not displayed. `Tags.astro` is no longer used on the home page.
- `gerando-handlers-com-openai-function-calling-e-nodejs.md` gets `unlisted: true`.

### RSS
- `src/pages/rss.xml.ts` using `@astrojs/rss`, listed posts only.
- `<link rel="alternate" type="application/rss+xml">` in `Base.astro` head; small
  "RSS" link in the footer.
- Links built with the existing `url()` helper (works under the `/blog` base).

### IDEAS.md
- Rewrite the intro around the reader-first direction.
- Move "Vitrine profissional / portfólio" to a "maybe someday" section.
- Add: theme pages (when enough posts), newsletter.

## Out of scope
Theme pages, newsletter, about page, English translations, visual redesign.

## Verification
`pnpm build`; check home, one post page and `rss.xml`. The unlisted post must be
reachable by URL and absent from the home list and the feed.
