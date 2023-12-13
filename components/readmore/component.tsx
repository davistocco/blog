import Link from 'next/link';
import styles from './component.module.css';

type Props = {
    href: string;
}

export default function Readmore({ href }: Props) {
    return (
        <Link className={styles.readmore} href={href}>ver mais</Link>
    )
}