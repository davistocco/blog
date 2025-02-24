import Header from "@/components/header/component";
import { Metadata } from "next";
import Image from 'next/image';
import fs from 'fs';
import styles from './page.module.css';
import { shuffleArray } from "@/utils/array.utils";

export const metadata: Metadata = { title: 'Gifs' };
export const dynamic = 'force-static';

export default function Gifs() {
  const gifFileNames = shuffleArray(fs.readdirSync(`${process.cwd()}/public/gifs-page`));

  return (
    <main>
      <Header title="Gifs" />
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
