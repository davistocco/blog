import { PrismaClient } from "@prisma/client";
import { cache } from "react";

const prisma = new PrismaClient();
export const getRecentPosts = cache(async () => {
    return await prisma.posts.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });
});

export const getPosts = cache(async () => {
    return await prisma.posts.findMany({
        orderBy: { createdAt: 'desc' }
    });
});

export const getPostBySlug = cache(async (slug: string) => {
    return await prisma.posts.findUnique({
        where: { slug }
    })
});