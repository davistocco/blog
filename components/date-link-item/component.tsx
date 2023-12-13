import Link from 'next/link';
import styles from './component.module.css';
import { capitalize } from 'lodash';

type Props = {
    date: Date;
    href?: string;
    text: string;
}

export default function DateLinkItem({ date, href, text }: Props) {
    const formattedDate = capitalize(new Intl
        .DateTimeFormat('pt-BR', { year: 'numeric', month: '2-digit' })
        .format(date)
    );

    return (
        <li className={styles.dateLinkItem}>
            <span>{formattedDate}</span> {href ? <Link href={href}>{text}</Link> : <span>{text}</span>}
        </li>
    )
}