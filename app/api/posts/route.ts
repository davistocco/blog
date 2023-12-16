import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export const forceDynamic = true
const prisma = new PrismaClient();

export async function GET() {
    try {
        const posts = await prisma.posts.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(posts, { status: 201 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}