'use client';
import { useState } from 'react';
import styles from './component.module.css';
import { ThemeContext } from '@/contexts/theme.context';

export default function LayoutContainer({
    children,
}: {
    children: React.ReactNode
}) {
    const [theme, setTheme] = useState('themeDark');

    const handleTheme = (theme: string) => {
        setTheme(theme);
        localStorage.setItem('theme', theme);
    }

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
