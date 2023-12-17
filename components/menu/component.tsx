import Link from "next/link";
import styles from "./component.module.css";

export default function Menu() {
    return (
        <div className={styles.menu}>
            <div id="links">
                <Link href='/'>DaviStocco</Link>&nbsp;
                <Link href='/posts'>Posts</Link>&nbsp;
                <Link href="/projects">Projetos</Link>&nbsp;
                <Link href="/contact">Contato</Link>&nbsp;
            </div>
        </div>
    )
}