import { getFileContent } from '@/utils/file.utils';
import { exclude } from '@/utils/object.utils';
import { removeAccents } from '@/utils/string.utils';
import { PrismaClient } from '@prisma/client';
import _ from 'lodash';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// TODO: file ext validation
// TODO: authentication
export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const data = await prepareData(formData);
        const post = await prisma.posts.create({ data });
        const responseData = exclude(post, ['content'])
        return NextResponse.json(responseData, { status: 201 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}

async function prepareData(formData: FormData) {
    const file = formData.get('file') as File;
    const [fileNameWithoutExtension] = file.name.split('.');
    const content = await getFileContent(file);
    const slug = _.kebabCase(removeAccents(fileNameWithoutExtension));
    return { title: file.name, slug, content };
}
