import DateLinkItem from '@/components/date-link-item/component';
import Header from '@/components/header/component';
import Readmore from '@/components/readmore/component';
import { getRecentPosts } from '@/services/posts.service';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function Home() {
  const posts = await getRecentPosts();

  return (
    <main>
      <Header
        title='DaviStocco.md'
        caption='backend dev/software engineer'
        createdAt='12/12/2023 22:47'
      />
      <p><strong>Isso é tipo um currículo, na verdade, aqui escrevo um pouco de tudo.</strong></p>
      <h2>Posts Recentes</h2>
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
        <Readmore href='/posts' />
      </ul>
      <h2>Skills</h2>
      <ul>
        <li>Googling</li>
        <li>Pai de Gêmeos</li>
        <li>Node.js</li>
      </ul>
      <h2>Referências</h2>
      <ul>
        <li><a href="https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882/ref=sr_1_1?crid=3I3FBMB04EIZM&keywords=clean+code&qid=1702544552&sprefix=clean+co%2Caps%2C390&sr=8-1">Clean Code</a></li>
        <li><a href="https://refactoring.guru/">Refactoring.guru</a></li>
        <li><a href="https://www.youtube.com/c/PauloBorgesJR">Paulo Borges Jr</a></li>
        <Readmore href='/references' />
      </ul>
    </main>
  );
}

