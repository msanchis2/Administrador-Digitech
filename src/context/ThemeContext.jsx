import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "malla-theme";
const ThemeContext = createContext(null);

const readTheme = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readTheme);

  // Los estilos de modo oscuro cuelgan de `body.dark`.
  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* almacenamiento no disponible: el tema simplemente no se recuerda */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);
  const value = useMemo(() => ({ theme, isDark: theme === "dark", toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
