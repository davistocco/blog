// The site lives under a base path (none on a user site, /repo on a project site), so internal links go through here.
export function url(path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}
