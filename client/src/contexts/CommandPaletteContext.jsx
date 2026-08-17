import { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export const CommandPaletteContext = createContext(null);

export function CommandPaletteProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((current) => !current), []);

  useEffect(() => {
    function handleKeyDown(event) {
      const modifierPressed = event.ctrlKey || event.metaKey;

      if (modifierPressed && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        toggle();
      }

      if (event.key === 'Escape') {
        close();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle, close]);

  const value = useMemo(() => ({ isOpen, open, close, toggle }), [isOpen, open, close, toggle]);

  return <CommandPaletteContext.Provider value={value}>{children}</CommandPaletteContext.Provider>;
}
