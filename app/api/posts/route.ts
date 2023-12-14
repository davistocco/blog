import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const posts = await prisma.posts.findMany();
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}

// export async function POST(req: Request) {
//     try {
//         const data = await req.json();
//         const post = await prisma.posts.create({ data });
//         return NextResponse.json(post, { status: 201 });
//     } catch (error) {
//         return NextResponse.json(error, { status: 500 });
//     }
// }