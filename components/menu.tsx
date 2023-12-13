import Link from "next/link";

export default function Menu() {
    return (
        <>
            <p><Link href='/'>DaviStocco</Link> <Link href='/posts'>Posts</Link> <Link href="/projects">Projetos</Link></p>
        </>
    )
}