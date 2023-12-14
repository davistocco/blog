import Header from "@/components/header/component";

export default function References() {
  return (
    <main>
      <Header
        title='Referências.md'
        createdAt='13/12/2023 17:03'
      />
      <h2>Links Úteis</h2>
      <ul>
        <li><a href="https://www.youtube.com/c/PauloBorgesJR">Paulo Borges Jr</a></li>
        <li><a href="https://refactoring.guru/">Refactoring.guru</a></li>
      </ul>
      <h2>Livros</h2>
      <ul>
        <li><a href="https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882/ref=sr_1_1?crid=3I3FBMB04EIZM&keywords=clean+code&qid=1702544552&sprefix=clean+co%2Caps%2C390&sr=8-1">Clean Code</a></li>
      </ul>
    </main>
  );
}
