import Header from "@/components/header/component";
import { Metadata } from "next";

export const metadata: Metadata = { title: 'Contato - Davi Stocco' };
export const dynamic = 'force-static';

export default function Contact() {
  return (
    <main>
      <Header
        title='Contato.md'
        createdAt='13/12/2023 20:06'
      />
      Qualquer coisa me dá um toque 👊
    </main>
  );
}
