import Header from '@/components/header/component';
import styles from './page.module.css';
import Readmore from '@/components/readmore/component';

export default function Home() {
  return (
    <main className={styles.main}>
      <Header
        title='DaviStocco.md'
        summary='Isso é quase um currículo, na verdade, aqui escrevo um pouco de tudo.'
        createdAt='12/12/2023 22:47'
      />
      <h2>Skills</h2>
      <ul>
        <li>Googling</li>
        <li>Pai de Gêmeos</li>
        <li>Node.js</li>
        <li>AWS</li>
      </ul>
      <h2>Posts Recentes</h2>
      em breve
      <h2>Referências</h2>
      <ul>
        <li><a href="https://www.youtube.com/c/PauloBorgesJR">Paulo Borges Jr</a></li>
        <li><a href="https://refactoring.guru/">Refactoring.guru</a></li>
        <li><a href="https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882/ref=sr_1_1?crid=3I3FBMB04EIZM&keywords=clean+code&qid=1702544552&sprefix=clean+co%2Caps%2C390&sr=8-1">Clean Code</a></li>
        <Readmore href='/references' />
      </ul>
    </main>
  );
}
