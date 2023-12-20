import Image from 'next/image';
import Link from 'next/link';

export default async function NotFound() {
    return (
        <div style={{ textAlign: 'center' }}>
            <h2>404</h2>
            <p>Página não encontrada</p>
            <Link href='/'>
                <Image
                    src='/images/not-found.gif'
                    layout='fill'
                    objectFit='contain'
                    alt='very young davi'
                />
            </Link>
        </div>
    )
}