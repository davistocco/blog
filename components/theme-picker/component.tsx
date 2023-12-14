'use client';
import { ThemeContext } from "@/contexts/theme.context";
import { useContext } from "react";
import styles from './component.module.css';

export default function ThemePicker() {
    const { handleTheme } = useContext(ThemeContext);
    const themes = ['themeLight', 'themeYellow', 'themeMint', 'themeGreen', 'themePink', 'themeRed', 'themeDark'];

    return (
        <div className={styles.themePicker}>
            {themes.map(theme => (
                <button
                    key={theme}
                    className={theme}
                    onClick={() => handleTheme(theme)}
                ></button>
            ))}
        </div>
    );
}
