import Menu from "../menu/component";
import styles from './component.module.css';

type Props = {
    title: string;
    createdAt: string;
    summary?: string;
}

export default function Header({ title, summary, createdAt }: Props) {
    return (
        <header className={styles.header}>
            <Menu />
            <h1 id="davistocco-md">{title}</h1>
            <p>Criado: {createdAt}</p>
            <p><strong>{summary}</strong></p>
        </header>)
}