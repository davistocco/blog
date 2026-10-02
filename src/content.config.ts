import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    createdAt: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    lang: z.enum(['pt-br', 'en']).default('pt-br'),
    description: z.string().optional(),
    // Path under public/ (e.g. images/capa.jpg); omit to use the site-wide cover.
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    unlisted: z.boolean().default(false),
  }),
});

export const collections = { posts };
