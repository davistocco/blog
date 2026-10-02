import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './i18n';

export type Post = CollectionEntry<'posts'>;

export async function getAllPosts(lang: Lang = 'pt-br') {
  const posts = await getCollection('posts', (p) => p.data.lang === lang);
  return posts.sort((a, b) => b.data.createdAt.getTime() - a.data.createdAt.getTime());
}

// Unlisted posts keep their URL but stay out of the home list, read-next and RSS.
export async function getPosts(lang: Lang = 'pt-br') {
  return (await getAllPosts(lang)).filter((p) => !p.data.unlisted);
}

function plainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function readingTime(post: Post) {
  const words = plainText(post.body ?? '').split(' ').length;
  return Math.max(1, Math.round(words / 200));
}

export function description(post: Post) {
  if (post.data.description) return post.data.description;
  const text = plainText(post.body ?? '');
  return text.length > 160 ? text.slice(0, 157).trimEnd() + '...' : text;
}

export function readNext(post: Post, listed: Post[]): Post | null {
  const others = listed.filter((p) => p.id !== post.id);
  const older = others.find((p) => p.data.createdAt < post.data.createdAt);
  return older ?? others[0] ?? null;
}
