import Link from "next/link";
import styles from "./component.module.css";

export default function Menu() {
    return (
        <div className={styles.menu}>
            <div id="links">
                <Link href='/'>davistocco.com</Link>&nbsp;
            </div>
        </div>
    )
}