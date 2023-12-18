import Image from 'next/image';

export default async function NotFound() {
    return (
        <div style={{ textAlign: 'center' }}>
            <h2>404</h2>
            <p>Página não encontrada</p>
            <Image
                src='/images/not-found.gif'
                layout='fill'
                objectFit='contain'
                alt='very young davi'
            />
        </div>
    )
}