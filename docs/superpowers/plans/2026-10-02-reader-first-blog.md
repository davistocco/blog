# Reader-first blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe the blog for readers: promise on the home page, no tags, unlisted posts, read-next link, RSS.

**Architecture:** Keep the Astro static site. Add an `unlisted` flag to the content schema; `getPosts()` returns listed posts only, `getAllPosts()` returns everything (used to build post pages). Home, read-next and RSS use `getPosts()`.

**Tech Stack:** Astro 7, `@astrojs/rss`, pnpm. No test framework exists; verification is `pnpm build` plus inspecting `dist/`.

**Spec:** `docs/superpowers/specs/2026-10-02-reader-first-blog-design.md`

## Global Constraints

- Site is served under base `/blog` (`astro.config.mjs`); all internal links go through `url()` from `src/lib/url.ts`.
- UI strings are PT-BR; post `lang` defaults to `pt-br`.
- No new visual redesign; reuse existing CSS variables (`--muted`, `--line`, `--text-sm`, `--text-xs`).
- Commit messages end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Review Focus

- The unlisted post must still build and be reachable at its URL (since `getStaticPaths` must not use the filtered list).
- A listed post must never get a "read next" link to itself.
- With a single listed post (or none), the home page and post pages still render without errors, and no read-next appears.
- An unlisted post's own page: read-next points to a listed post (or is omitted), never to itself.
- RSS item links include the `/blog` base and titles with special characters (`&`, accents) are escaped.

---

### Task 1: Unlisted posts

**Files:**
- Modify: `src/content.config.ts`
- Modify: `src/lib/posts.ts`
- Modify: `src/pages/posts/[slug].astro` (getStaticPaths only)
- Modify: `src/content/posts/gerando-handlers-com-openai-function-calling-e-nodejs.md` (frontmatter)

**Interfaces:**
- Produces: `getPosts(lang?): Promise<Post[]>` (listed only, newest first); `getAllPosts(lang?): Promise<Post[]>` (including unlisted, newest first).

- [ ] **Step 1: Add the schema field**

In `src/content.config.ts`, after the `description` line add:

```ts
    unlisted: z.boolean().default(false),
```

- [ ] **Step 2: Split the post getters**

In `src/lib/posts.ts` replace the `getPosts` function with:

```ts
export async function getAllPosts(lang: Lang = 'pt-br') {
  const posts = await getCollection('posts', (p) => p.data.lang === lang);
  return posts.sort((a, b) => b.data.createdAt.getTime() - a.data.createdAt.getTime());
}

// Unlisted posts keep their URL but stay out of the home list, read-next and RSS.
export async function getPosts(lang: Lang = 'pt-br') {
  return (await getAllPosts(lang)).filter((p) => !p.data.unlisted);
}
```

- [ ] **Step 3: Build post pages from all posts**

In `src/pages/posts/[slug].astro` change the import to `import { getAllPosts, readingTime, description, type Post } from '../../lib/posts';` and `getStaticPaths` to call `await getAllPosts()`.

- [ ] **Step 4: Unlist the technical post**

In the OpenAI post's frontmatter add `unlisted: true` after the `tags` line.

- [ ] **Step 5: Verify**

Run: `pnpm build && ls dist/posts/ && grep -c "openai-function-calling" dist/index.html`
Expected: build succeeds; `dist/posts/` has all three post folders; grep prints `0`.

- [ ] **Step 6: Commit**

```bash
git add -A src && git commit -m "feat: unlisted posts" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

### Task 2: Home promise, no tags, read-next

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/posts/[slug].astro`
- Modify: `src/lib/posts.ts` (add `readNext`)
- Modify: `src/lib/i18n.ts` (add `readNext` label)
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `getPosts`, `getAllPosts` from Task 1.
- Produces: `readNext(post: Post, listed: Post[]): Post | null` — the next older listed post other than `post`; if none is older, the newest listed post other than `post`; `null` if there is no other listed post.

- [ ] **Step 1: Add `readNext`**

Append to `src/lib/posts.ts`:

```ts
export function readNext(post: Post, listed: Post[]): Post | null {
  const others = listed.filter((p) => p.id !== post.id);
  const older = others.find((p) => p.data.createdAt < post.data.createdAt);
  return older ?? others[0] ?? null;
}
```

- [ ] **Step 2: Add the label**

In `src/lib/i18n.ts`, add `readNext: 'Continue lendo',` to the `pt-br` object and `readNext: 'Keep reading',` to `en`.

- [ ] **Step 3: Home page**

Replace the body of `src/pages/index.astro` (keep the frontmatter, remove the `Tags` import) so the markup is:

```astro
<Base>
  <header>
    <h1 class="site-title">Davi Stocco</h1>
    <p class="intro">
      Reflexões sobre a vida, a fé e o que a gente aprende sem perceber.
      Histórias pequenas, com mais perguntas do que respostas.
    </p>
  </header>

  <ul class="posts">
    {posts.map((post) => (
      <li>
        <span class="date">{formatDate(post.data.createdAt)}</span>
        <a href={url(`posts/${post.id}/`)}>{post.data.title}</a>
      </li>
    ))}
  </ul>
</Base>
```

- [ ] **Step 4: Post page read-next and no tags**

In `src/pages/posts/[slug].astro`: remove the `Tags` import and the `<Tags ... />` line; import `getPosts, readNext` and `url` (`import { url } from '../../lib/url';`); in the frontmatter add `const next = readNext(post, await getPosts());`; after `</article>` add:

```astro
  {next && (
    <p class="read-next">
      {t.readNext}: <a href={url(`posts/${next.id}/`)}>{next.data.title}</a>
    </p>
  )}
```

- [ ] **Step 5: CSS**

In `src/styles/global.css` replace the `.caption` rule with:

```css
.intro {
  color: var(--muted);
  margin: 0.5rem 0 2.5rem;
}

.read-next {
  margin-top: 3rem;
  font-size: var(--text-sm);
  color: var(--muted);
}
```

and delete the `.tags` rule. Delete `src/components/Tags.astro`.

- [ ] **Step 6: Verify**

Run: `pnpm build && grep -c "Continue lendo" dist/posts/*/index.html && grep -c "Reflexões" dist/index.html && grep -c "#contemplativo" dist/index.html`
Expected: build succeeds; each post page has a count of 1 for "Continue lendo" (the OpenAI page links to a listed post, the two listed posts link to each other); home shows 1 for "Reflexões"; `#contemplativo` count is 0.

- [ ] **Step 7: Commit**

```bash
git add -A src && git commit -m "feat: reader-first home, read-next, drop visible tags" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

### Task 3: RSS and IDEAS.md

**Files:**
- Create: `src/pages/rss.xml.ts`
- Modify: `src/layouts/Base.astro`
- Modify: `IDEAS.md`
- Modify: `package.json`, `pnpm-lock.yaml` (via pnpm)

**Interfaces:**
- Consumes: `getPosts`, `description` from `src/lib/posts.ts`; `url` from `src/lib/url.ts`.

- [ ] **Step 1: Install**

Run: `pnpm add @astrojs/rss`
Expected: added to dependencies.

- [ ] **Step 2: Feed endpoint**

Create `src/pages/rss.xml.ts`:

```ts
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, description } from '../lib/posts';
import { url } from '../lib/url';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: 'Davi Stocco',
    description: 'Reflexões sobre a vida, a fé e o que a gente aprende sem perceber.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.createdAt,
      description: description(post),
      link: url(`posts/${post.id}/`),
    })),
    customData: '<language>pt-br</language>',
  });
}
```

- [ ] **Step 3: Discovery link and footer link**

In `src/layouts/Base.astro`, after the `<link rel="icon" ...>` line add:

```astro
    <link rel="alternate" type="application/rss+xml" title="Davi Stocco" href={url('rss.xml')} />
```

and in the footer `<ul>` add a last item: `<li><a href={url('rss.xml')}>rss</a></li>`.

- [ ] **Step 4: Rewrite IDEAS.md**

Replace the "Vitrine profissional / portfólio" section with the following placed at the end under a `## Talvez um dia` heading, and add reader-first items. The new file content:

```markdown
# Ideias para o futuro

Backlog de ideias que surgiram mas ficaram para depois. Nada aqui é compromisso.

Direção atual (02/10/2026): blog centrado no leitor. Conteúdo atemporal, reflexões e ensinamentos indiretos, sem foco em tutoriais nem em portfólio.

## Leitor
- Páginas por tema, quando houver posts suficientes para justificar.
- Newsletter por e-mail, quando houver ritmo de escrita.
- Imagem de preview (OG) própria por post; hoje todos usam a foto do rodapé.

## Conteúdo
- Versões em inglês dos posts (a estrutura bilíngue já está preparada).

## Visual
- Voltar com uma fonte de personalidade nos títulos (a Comic Shanns saiu em 30/09/2026; por enquanto é Figtree em tudo).

## Talvez um dia (consequência, não objetivo)
- Página "sobre" curta, mantendo o tom informal.
- Seção de projetos / vitrine profissional.
```

- [ ] **Step 5: Verify**

Run: `pnpm build && head -20 dist/rss.xml && grep -c "openai" dist/rss.xml; grep -c "rss.xml" dist/index.html`
Expected: feed has `<link>https://davistocco.github.io/blog/posts/...` items for the two listed posts; openai count `0`; index has at least 2 `rss.xml` matches (head link + footer).

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: RSS feed, rewrite IDEAS for reader-first direction" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```
