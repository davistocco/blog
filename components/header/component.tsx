import Menu from "../menu/component";
import styles from './component.module.css';

type Props = {
    title?: string;
    caption?: string;
    summary?: string;
    createdAt?: string;
}

export default function Header({ title, caption, summary, createdAt }: Props) {
    return (
        <header className={styles.header}>
            <Menu />
            <h1 id="davistocco-md">{title}</h1>
            {caption && <h2 className={styles.caption}>{caption}</h2>}
            {
                createdAt && <p>Criado: {createdAt}</p>
            }
            <p><strong>{summary}</strong></p>
        </header>)
}