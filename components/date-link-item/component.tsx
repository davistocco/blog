import Link from 'next/link';
import styles from './component.module.css';

type Props = {
    date: Date;
    text: string;
    href?: string;
    showDay?: boolean;
}


export default function DateLinkItem({ date, href, text, showDay }: Props) {
    const dateFormatOptions = (): Intl.DateTimeFormatOptions => {
        const format: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit' };
        if (!showDay) return format;
        return { ...format, day: '2-digit' }
    };

    const formattedDate = date.toLocaleDateString('pt-BR', dateFormatOptions())

    return (
        <li>
            <span>{formattedDate}</span> {href ? <Link href={href}>{text}</Link> : <span>{text}</span>}
        </li>
    )
}