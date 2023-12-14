import Header from '@/components/header/component';
import styles from './page.module.css';
import Readmore from '@/components/readmore/component';

export default function Home() {
  return (
    <main className={styles.main}>
      <Header
        title='DaviStocco.md'
        summary='Isso não é um currículo, aqui escrevo um pouco de tudo.'
        createdAt='12/12/2023 22:47'
      />
      <h2 id="skills">Skills</h2>
      <ul>
        <li>Googling</li>
        <li>Pai de Gêmeos</li>
        <li>Node.js</li>
        <li>AWS</li>
      </ul>
      <h2>Posts Recentes</h2>
      em breve
      <h2 id="links-uteis">Links Úteis</h2>
      <ul>
        <li><a href="https://www.youtube.com/c/PauloBorgesJR">Paulo Borges Jr</a></li>
        <li><a href="https://refactoring.guru/">Refactoring Guru</a></li>
        <li><a href="https://www.youtube.com/watch?v=18hhUcqX3P8&amp;pp=ygUPZ3VpdGFycmEgaHVtYW5h">Human guitar</a></li>
        <Readmore href='/links' />
      </ul>
    </main>
  );
}
