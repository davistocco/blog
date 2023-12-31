import Image from 'next/image';
import styles from './component.module.css';
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className='flex center'>
                <Image
                    className={styles.profileImage}
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
            <p>2023-{currentYear}</p>
            <p>by <Link href='/'>Davi Stocco</Link></p>
        </footer>
    )
}