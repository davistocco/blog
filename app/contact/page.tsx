import Header from "@/components/header/component";
import { Metadata } from "next";

export const metadata: Metadata = { title: 'Contato' };
export const dynamic = 'force-static';

export default function Contact() {
  return (
    <main>
      <Header
        title='Contato'
      />
      Qualquer coisa me dá um toque 👊
    </main>
  );
}
