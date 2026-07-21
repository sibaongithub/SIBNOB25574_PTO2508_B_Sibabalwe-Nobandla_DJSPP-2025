import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

/** Key used to remember the theme in localStorage. */
const STORAGE_KEY = "podcast-theme";

/**
 * Provides the light/dark theme to the whole app and remembers the choice.
 * Adds or removes the "dark" class on <html>, which is what Tailwind uses.
 *
 * @param {{children: React.ReactNode}} props
 * @returns {JSX.Element}
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // use the saved theme, otherwise follow the system setting
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  // apply the theme to <html> and save it whenever it changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  /** Switches between light and dark. */
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

/**
 * Gives a component access to the theme and the toggle.
 * @returns {{theme: string, toggleTheme: () => void}}
 */
export function useTheme() {
  return useContext(ThemeContext);
}
