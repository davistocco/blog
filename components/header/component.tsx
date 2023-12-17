import Menu from "../menu/component";
import styles from './component.module.css';

type Props = {
    title?: string;
    caption?: string;
    createdAt?: string;
}

export default function Header({ title, caption, createdAt }: Props) {
    return (
        <header className={styles.header}>
            <Menu />
            <h1 id="davistocco-md">{title}</h1>
            {caption && <h2 className={styles.caption}>{caption}</h2>}
            {
                createdAt && <p>Criado: {createdAt}</p>
            }
        </header>)
}