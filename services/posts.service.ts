import { cache } from "react";
import fs from 'fs'
import slugify from "slugify";

type Post = {
    title: string,
    createdAt: Date
}

const posts: Array<Post> = [
    {
        title: 'Gerando Handlers com OpenAI Function Calling e NodeJS',
        createdAt: new Date(2024, 0, 10)
    },
    {
        title: 'Breve Relato de Um Pai',
        createdAt: new Date(2024, 6, 21)
    },
    {
        title: 'Bistrô Dogueria - Uma Análise Contemplativa',
        createdAt: new Date(2025, 0, 3)
    }
]

export const getRecentPosts = cache(async () => {
    const posts = await getPosts();
    return posts.slice(0, 5);
});

export const getPosts = cache(async () => {
    return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
});

export const getPostBySlug = cache(async (slug: string) => {
    return posts.find(post => getPostSlug(post.title) === slug);
});

export async function getPostContent(title: string) {
    const fullPath = `${process.cwd()}/public/posts/${title}.md`;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return fileContents;
}

export const getPostSlug = (title: string) => {
    return slugify(title, { lower: true });
}
