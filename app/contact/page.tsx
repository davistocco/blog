import Header from "@/components/header/component";
import { Metadata } from "next";

export const metadata: Metadata = { title: 'Contato' };
export const dynamic = 'force-static';

export default function Contact() {
  return (
    <main>
      <Header
        title='Contato'
        createdAt='13/12/2023 20:06'
      />
      Qualquer coisa me dá um toque 👊
    </main>
  );
}
