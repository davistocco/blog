import Menu from "./menu";

type Props = {
    title: string;
    createdAt: string;
    summary?: string;
}

export default function Header({ title, summary, createdAt }: Props) {
    return (
        <header>
            <Menu />
            <h1 id="davistocco-md">{title}</h1>
            <p>Created: {createdAt}</p>
            <p><strong>{summary}</strong></p>
        </header>)
}