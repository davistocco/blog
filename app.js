// ── Posts data (equivalent to posts.service.ts) ───────────────────────────
const POSTS = [
  {
    title: 'Gerando Handlers com OpenAI Function Calling e NodeJS',
    createdAt: new Date(2024, 0, 10),
  },
  {
    title: 'Breve Relato de Um Pai',
    createdAt: new Date(2024, 6, 21),
  },
  {
    title: 'Bistrô Dogueria - Uma Análise Contemplativa',
    createdAt: new Date(2025, 0, 3),
  },
];

// ── Slug helper (mirrors slugify with lower:true) ──────────────────────────
function slugify(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')      // remove special chars
    .replace(/\s+/g, '-')              // spaces → hyphens
    .replace(/-+/g, '-');              // collapse multiple hyphens
}

function getPostSlug(title) {
  return slugify(title);
}

function getPosts() {
  return [...POSTS].sort((a, b) => b.createdAt - a.createdAt);
}

function getPostBySlug(slug) {
  return POSTS.find(p => getPostSlug(p.title) === slug) || null;
}

// ── Date formatting ────────────────────────────────────────────────────────
function formatDate(date, showDay = true) {
  const opts = { year: 'numeric', month: '2-digit' };
  if (showDay) opts.day = '2-digit';
  return date.toLocaleDateString('pt-BR', opts);
}

// ── Footer year ───────────────────────────────────────────────────────────
function renderFooterYear() {
  const el = document.getElementById('footer-years');
  if (el) el.textContent = '2023-' + new Date().getFullYear();
}

// ── Home page: render post list ────────────────────────────────────────────
function renderHome() {
  const list = document.getElementById('post-list');
  if (!list) return;

  const posts = getPosts();
  list.innerHTML = posts
    .map(post => {
      const slug = getPostSlug(post.title);
      const date = formatDate(post.createdAt, true);
      return `<li>
        <span>${date}</span>
        <a href="posts/post.html#${encodeURIComponent(slug)}">${post.title}</a>
      </li>`;
    })
    .join('');
}

// ── Post page: fetch markdown and render ───────────────────────────────────
async function renderPost() {
  const postBody = document.getElementById('post-body');
  if (!postBody) return;

  const params = new URLSearchParams(window.location.search);
  const slug = decodeURIComponent(window.location.hash.slice(1));
  
  const post = slug ? getPostBySlug(slug) : null;

  if (!post) {
    document.title = '404 | Davi Stocco';
    postBody.innerHTML = `
      <div class="not-found">
        <h2>404</h2>
        <p>Post não encontrado</p>
        <a href="../index.html">
          <img src="../images/not-found.gif" alt="confused travolta" />
        </a>
      </div>`;
    return;
  }

  // Set page title and header
  document.title = post.title + ' | Davi Stocco';
  const titleEl = document.getElementById('post-title');
  const dateEl  = document.getElementById('post-date');
  if (titleEl) titleEl.textContent = post.title;
  if (dateEl)  dateEl.textContent  = 'Criado: ' + formatDate(post.createdAt, true);

  // Fetch the markdown file (title must match filename exactly)
  try {
    const url = `${encodeURIComponent(post.title)}.md`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('not found');
    const md = await res.text();

    // Configure marked with highlight.js
    marked.setOptions({
      highlight(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
      },
      gfm: true,
      breaks: false,
    });

    postBody.innerHTML = marked.parse(md);

    // Re-run hljs on any code blocks marked didn't highlight inline
    postBody.querySelectorAll('pre code').forEach(block => {
      hljs.highlightElement(block);
    });
  } catch {
    postBody.innerHTML = `<p>Erro ao carregar o post.</p>`;
  }
}

// ── Router ─────────────────────────────────────────────────────────────────
(function init() {
  renderFooterYear();
  renderHome();
  renderPost();
})();
