import Header from "@/components/header/component";
import { getPostBySlug, getPostContent, getPosts, getPostSlug } from "@/services/posts.service";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus as dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import gfm from 'remark-gfm';
import styles from './page.module.css';
import { notFound } from "next/navigation";

// TODO: enhance markdown feature support

type Props = {
  params: { slug: string }
}

export const dynamic = 'force-static';
export const dynamicParams = true;
export const revalidate = false;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: getPostSlug(post.title) }));
}

export async function generateMetadata({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) return;
  return {
    title: post.title.replace('.md', ''),
  }
}

export default async function Post({ params }: Props) {
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();

  const postContent = await getPostContent(post.title);

  return (
    <main className={styles.tableContainer}>
      <Header />
      <Markdown
        remarkPlugins={[gfm]}
        components={{
          code(props) {
            const { children, className, node, ...rest } = props
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <SyntaxHighlighter
                PreTag="div"
                language={match[1]}
                style={dark}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            )
          }
        }}
      >
        {postContent}
      </Markdown>
    </main>
  );
}
