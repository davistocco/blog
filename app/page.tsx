import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 id="davistocco-md">Home - DaviStocco</h1>
      <p>Created: 12/12/2023 22:47</p>
      <p><strong>Isto não é um currículo.</strong></p>
      <p><Link href='/'>Home</Link> <Link href='/posts'>Posts</Link> <a href="/">Projetos</a> <a href="/">Contato</a></p>
      <h2 id="skills">Skills</h2>
      <ul>
        <li>Googling</li>
        <li>Pai de Gêmeos</li>
        <li>JavaScript
        </li>
      </ul>
        <h2 id="educa-o">Educação</h2>
        <ul>

        <li>Fatec Ribeirão Preto (2019 - último semestre)
        </li>
        </ul>
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
