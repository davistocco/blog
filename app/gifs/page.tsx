import DateLinkItem from "@/components/date-link-item/component";
import Header from "@/components/header/component";
import { Metadata } from "next";
import Image from 'next/image'

export const metadata: Metadata = { title: 'Gifs' };
export const dynamic = 'force-static';

export default function Gifs() {
  const gifs = [
    {
      src: '/images/larry-david-pretty-good.gif',
      alt: 'larry david pretty good'
    },
  ]

  return (
    <main>
      <Header
        title='Gifs'
        createdAt='23/02/2025 12:47'
      />
      <ul>
        {
          gifs.map((gif, index) => (
            <Image
              key={index}
              src={gif.src}
              layout="fill"
              objectFit="contain"
              alt={gif.alt}
            />
          ))
        }
      </ul>
    </main>
  );
}
