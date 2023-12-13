import Header from '@/components/header';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <Header
        title='DaviStocco.md'
        summary='Isto é mais ou menos um currículo, aqui escrevo um touco de pudo.'
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
      <h2 id="links-teis">Links Úteis</h2>
      <ul>
        <li><a href="https://www.youtube.com/c/PauloBorgesJR">Paulo Borges Jr</a></li>
        <li><a href="https://refactoring.guru/">Refactoring Guru</a></li>
        <li><a href="https://codingchallenges.substack.com/">John Crickett</a></li>
        <li><a href="https://www.youtube.com/watch?v=18hhUcqX3P8&amp;pp=ygUPZ3VpdGFycmEgaHVtYW5h">Human Guitar</a></li>
      </ul>
    </main>
  );
}
