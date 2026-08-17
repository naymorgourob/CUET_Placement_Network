import { useCallback, useState } from 'react';

const COLLAPSE_KEY = 'cuet_sidebar_collapsed';

export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === '1');

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
      return next;
    });
  }, []);

  return [collapsed, toggle];
}
