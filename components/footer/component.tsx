import Image from 'next/image';
import styles from './component.module.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className='flex center'>
                <Image
                    src='/images/very-young-davi.png'
                    width='60'
                    height='60'
                    alt='very young davi'
                />
                <ul>
                    <li>
                        <b><a href="mailto:davistocco14@gmail.com">&gt;mail</a></b>
                    </li>
                    <li><a href='https://linkedin.com/in/davistocco'>linkedin</a></li>
                    <li><a href='https://github.com/davistocco'>github</a></li>
                </ul>
            </div>
            <p>2023-{currentYear} Davi Stocco</p>
        </footer>
    )
}