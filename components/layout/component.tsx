'use client';
import { useState } from 'react';
import styles from './component.module.css';
import { ThemeContext } from '@/contexts/theme.context';
import { setCookie } from 'nookies';

//TODO: refactor

interface LayoutProps {
    children: React.ReactNode;
    initialTheme: string | undefined;
}

export default function Layout({ children, initialTheme }: LayoutProps) {
    const defaultTheme = 'themeDark';
    const [theme, setTheme] = useState(initialTheme ?? defaultTheme);

    const handleTheme = (newTheme: string) => {
        setTheme(newTheme);
        setCookie(null, 'theme', newTheme, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 });
    };

    return (
        <ThemeContext.Provider value={{ theme, handleTheme }}>
            <div className={`${styles.container} ${theme}`}>
                <div className={styles.limiter}>
                    {children}
                </div>
            </div>
        </ThemeContext.Provider>
    );
}
