import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

export function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const target = document.documentElement;
    const observer = new MutationObserver(() => setIsDark(target.classList.contains('dark')));
    observer.observe(target, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  function toggleTheme() {
    setTheme(isDark ? 'light' : 'dark');
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={theme === 'system' ? `Using system theme (${isDark ? 'dark' : 'light'})` : undefined}
      className={cn(
        'relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors duration-100',
        'hover:bg-surface-muted hover:text-text',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface',
        'active:scale-95',
        className
      )}
    >
      <Sun
        className={cn(
          'absolute h-[18px] w-[18px] transition-all duration-150 motion-reduce:transition-none',
          isDark ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        )}
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          'absolute h-[18px] w-[18px] transition-all duration-150 motion-reduce:transition-none',
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'
        )}
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </button>
  );
}
