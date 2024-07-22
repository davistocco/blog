import { cache } from "react";
import fs from 'fs'
import slugify from "slugify";

type Post = {
    title: string,
    createdAt: Date
}

const posts: Array<Post> = [
    {
        title: 'Gerando Handlers com OpenAI Function Calling e NodeJS.md',
        createdAt: new Date(2024, 0, 10)
    },
    {
        title: 'Breve Relato De Um Pai.md',
        createdAt: new Date(2024, 6, 21)
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
    const fullPath = process.cwd() + '/public/posts/' + title;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return fileContents;
}

export const getPostSlug = (title: string) => {
    return slugify(title, { lower: true }).split('.md')[0];
}