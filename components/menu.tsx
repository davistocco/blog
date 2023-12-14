import Link from "next/link";

export default function Menu() {
    return (
        <div>
            <Link href='/'>DaviStocco</Link>&nbsp;
            <Link href='/posts'>Posts</Link>&nbsp;
            <Link href="/projects">Projetos</Link>&nbsp;
            <Link href="/contact">Contato</Link>
        </div>
    )
}