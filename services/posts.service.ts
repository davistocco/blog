import { PrismaClient } from "@prisma/client";
import { cache } from "react";

export const getRecentPosts = cache(async () => {
    const prisma = new PrismaClient();
    return await prisma.posts.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });
});

export const getPosts = cache(async () => {
    const prisma = new PrismaClient();
    return await prisma.posts.findMany({
        orderBy: { createdAt: 'desc' }
    });
});

export const getPostBySlug = cache(async (slug: string) => {
    const prisma = new PrismaClient();
    return await prisma.posts.findUnique({
        where: { slug }
    })
});