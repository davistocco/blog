import Header from "@/components/header/component";
import { Metadata } from "next";
import Image from 'next/image';
import fs from 'fs';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'Gifs' };
export const dynamic = 'force-static';

export default function Gifs() {
  const gifFileNames = fs.readdirSync(`${process.cwd()}/public/gifs-page`);

  return (
    <main>
      <Header title="Gifs" createdAt="23/02/2025 12:47" />
      <div className={`gifsContainer ${styles.gifsContainer}`}>
        {gifFileNames.map((gif, index) => (
          <Image
            className={`${styles.gif}`}
            key={index}
            src={`/gifs-page/${gif}`}
            alt={gif}
            height={0}
            width={0}
          />
        ))}
      </div>
    </main>
  );
}
