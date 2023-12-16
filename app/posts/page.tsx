import DateLinkItem from "@/components/date-link-item/component";
import Header from "@/components/header/component";
import { getPosts } from "@/services/posts.service";

export const revalidate = 3600;

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
