import Link from "next/link";

type Props = {
    title: string;
    createdAt: string;
    summary?: string;
}

export default function Header({ title, summary, createdAt }: Props) {
    return (
        <header>
            <p><Link href='/'>DaviStocco</Link> <Link href='/posts'>Posts</Link> <Link href="/projects">Projetos</Link> <Link href="/contact">Contato</Link></p>
            <h1 id="davistocco-md">{title}</h1>
            <p>Created: {createdAt}</p>
            <p><strong>{summary}</strong></p>
        </header>)
}