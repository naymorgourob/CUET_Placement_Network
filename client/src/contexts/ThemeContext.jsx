import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export const ThemeContext = createContext(null);

const THEME_KEY = 'cuet_theme';
const THEMES = ['light', 'dark', 'system'];

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const stored = localStorage.getItem(THEME_KEY);
    return THEMES.includes(stored) ? stored : 'system';
  });

  useEffect(() => {
    applyTheme(theme);

    if (theme !== 'system') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme('system');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = useCallback((nextTheme) => {
    if (!THEMES.includes(nextTheme)) {
      return;
    }
    localStorage.setItem(THEME_KEY, nextTheme);
    setThemeState(nextTheme);
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
