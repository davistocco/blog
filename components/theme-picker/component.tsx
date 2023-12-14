'use client';
import { ThemeContext } from "@/contexts/theme.context";
import { useContext } from "react";
import styles from './component.module.css';

export default function ThemePicker() {
    const { handleTheme } = useContext(ThemeContext);

    return (
        <div className={styles.themePicker}>
            <button className='themeLight' onClick={() => handleTheme('themeLight')}></button>
            <button className='themeYellow' onClick={() => handleTheme('themeYellow')}></button>
            <button className='themeMint' onClick={() => handleTheme('themeMint')}></button>
            <button className='themeGreen' onClick={() => handleTheme('themeGreen')}></button>
            <button className='themePink' onClick={() => handleTheme('themePink')}></button>
            <button className='themeRed' onClick={() => handleTheme('themeRed')}></button>
            <button className='themeDark' onClick={() => handleTheme('themeDark')}></button>
        </div>
    );
}