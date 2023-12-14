import { createContext } from "react";

interface ThemeContextProps { theme: string; handleTheme: (theme: string) => void }

export const ThemeContext = createContext<ThemeContextProps>({
    theme: '',
    handleTheme: () => { },
});
