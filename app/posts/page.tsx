import DateLinkItem from "@/components/date-link-item/component";
import Header from "@/components/header/component";
import { PrismaClient } from "@prisma/client";
import { cache } from "react";

export const revalidate = 60;
const prisma = new PrismaClient();
const getPosts = cache(async () => {
  return await prisma.posts.findMany({
    orderBy: { createdAt: 'desc' }
  });
})

export default async function Posts() {
  const posts = await getPosts();

  return (
    <main>
      <Header
        title='Posts.md'
        createdAt='13/12/2023 13:20'
      />
      <ul>
        {
          posts.map(post => (
            <DateLinkItem
              key={post.slug}
              href={`/posts/${post.slug}`}
              date={post.createdAt}
              text={post.title}
              showDay={true}
            />
          ))
        }
      </ul>
    </main>
  );
}
