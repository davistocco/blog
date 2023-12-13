export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer>
            <p>2023-{currentYear} Davi Stocco</p>
        </footer>
    )
}