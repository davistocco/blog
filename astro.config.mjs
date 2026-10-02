import { defineConfig } from 'astro/config';

const el = (tagName, className, children = [], extra = {}) => ({
  type: 'element',
  tagName,
  properties: { class: className, ...extra },
  children,
});

// Wraps each code block in an editor-like window: a bar with dots and a copy button.
const codeWindow = {
  name: 'code-window',
  root(root) {
    const dots = el('span', 'dots', [el('i'), el('i'), el('i')], { 'aria-hidden': 'true' });
    const copy = el('button', 'copy', [{ type: 'text', value: 'copiar' }], { type: 'button' });
    root.children = [el('div', 'code-window', [el('div', 'code-bar', [dots, copy]), ...root.children])];
  },
};

export default defineConfig({
  site: 'https://davistocco.github.io',
  i18n: {
    defaultLocale: 'pt-br',
    locales: ['pt-br', 'en'],
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      defaultColor: false,
      transformers: [codeWindow],
    },
  },
});
