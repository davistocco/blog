import DateLinkItem from "@/components/date-link-item/component";
import Header from "@/components/header/component";
import { getPosts, getPostSlug } from "@/services/posts.service";
import styles from './page.module.css';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function Home() {
  const posts = await getPosts();

  return (
    <main>
      <Header
        title='Davi Stocco'
        caption='blog'
      />
      <ul className={styles.posts}>
        {
          posts.map((post, index) => (
            <DateLinkItem
              key={index}
              href={`/posts/${getPostSlug(post.title)}`}
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
