import DateLinkItem from "@/components/date-link-item/component";
import Header from "@/components/header";

export default function Projects() {
  return (
    <main>
      <Header
        title='Projetos.md'
        createdAt='13/12/2023 13:21'
      />
      <ul>
        <DateLinkItem
          href="https://github.com/davistocco/blog"
          date={new Date(2023, 11)}
          text="Este blog"
        />
        <DateLinkItem
          date={new Date(2023, 5)}
          text="Tryst"
        /> <DateLinkItem
          href="https://www.linkedin.com/feed/update/urn:li:activity:7080650800078761984/"
          date={new Date(2023, 5)}
          text="Bot Nota Control"
        />
        <DateLinkItem
          href="https://www.linkedin.com/feed/update/urn:li:activity:7127796860991254528/"
          date={new Date(2022, 10)}
          text="LucianoApp"
        />
        <DateLinkItem
          href="https://lagoinharibeiraopreto.com.br/"
          date={new Date(2022, 6)}
          text="Site Lagoinha Ribeirão Preto"
        />
        <DateLinkItem
          href="https://davistocco.github.io/neomorphic-elements/"
          date={new Date(2022, 4)}
          text="Neomorphic Elements"
        />
      </ul>
    </main>
  );
}
