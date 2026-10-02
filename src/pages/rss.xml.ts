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
