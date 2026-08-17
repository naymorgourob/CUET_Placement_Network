import { createContext, useCallback, useMemo, useState } from 'react';

export const DialogContext = createContext(null);

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  const openDialog = useCallback((content) => {
    setDialog(content);
  }, []);

  const closeDialog = useCallback(() => {
    setDialog(null);
  }, []);

  const value = useMemo(() => ({ dialog, openDialog, closeDialog }), [dialog, openDialog, closeDialog]);

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}
