'use client';
import { useState } from 'react';
import styles from './component.module.css';
import { ThemeContext } from '@/contexts/theme.context';
import { setCookie } from 'nookies';
import { Theme } from '@/enums/theme.enum';

//TODO: refactor

interface LayoutProps {
    children: React.ReactNode;
    initialTheme: string | undefined;
}

export default function Layout({ children, initialTheme }: LayoutProps) {
    const defaultTheme = Object.values(Theme)[0];
    const [theme, setTheme] = useState(initialTheme ?? defaultTheme);

    const handleTheme = (newTheme: string) => {
        setTheme(newTheme);
        setCookie(null, 'theme', newTheme, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 });
    };

    return (
        <ThemeContext.Provider value={{ theme, handleTheme }}>
            <body className={`${styles.container} ${theme}`}>
                <div className={styles.limiter}>
                    {children}
                </div>
            </body>
        </ThemeContext.Provider>
    );
}
