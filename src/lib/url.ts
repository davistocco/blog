// The site lives under a base path (/blog on GitHub Pages), so internal links go through here.
export function url(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
