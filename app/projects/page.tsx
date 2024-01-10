import DateLinkItem from "@/components/date-link-item/component";
import Header from "@/components/header/component";
import { Metadata } from "next";

export const metadata: Metadata = { title: 'Projetos' };
export const dynamic = 'force-static';

export default function Projects() {
  const projects = [
    {
      title: 'Este blog',
      createdAt: new Date(2023, 11),
      href: 'https://github.com/davistocco/blog',
    },
    {
      title: 'LucianoApp',
      createdAt: new Date(2023, 10),
      href: 'https://www.linkedin.com/feed/update/urn:li:activity:7127796860991254528/',
    },
    {
      title: 'Tryst',
      createdAt: new Date(2023, 5),
    },
    {
      title: 'Bot Nota Control',
      createdAt: new Date(2023, 5),
      href: 'https://www.linkedin.com/feed/update/urn:li:activity:7080650800078761984/',
    },
    {
      title: 'Site Lagoinha Ribeirão',
      createdAt: new Date(2022, 6),
      href: 'https://lagoinharibeiraopreto.com.br/',
    },
    {
      title: 'Neomorphic Elements',
      createdAt: new Date(2022, 4),
      href: 'https://davistocco.github.io/neomorphic-elements/',
    },
  ]
  return (
    <main>
      <Header
        title='Projetos.md'
        createdAt='13/12/2023 13:21'
      />
      <ul>
        {
          projects.map(project => (
            <DateLinkItem
              key={project.title}
              href={project.href}
              date={project.createdAt}
              text={project.title}
            />
          ))
        }
      </ul>
    </main>
  );
}
