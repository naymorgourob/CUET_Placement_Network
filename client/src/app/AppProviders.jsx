import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { DialogProvider } from '@/contexts/DialogContext';
import { CommandPaletteProvider } from '@/contexts/CommandPaletteContext';
import { QueryProvider } from '@/providers/QueryProvider';
import { TooltipProvider } from '@/providers/TooltipProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function AppProviders({ children }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryProvider>
          <BrowserRouter>
            <AuthProvider>
              <ToastProvider>
                <DialogProvider>
                  <TooltipProvider>
                    <CommandPaletteProvider>{children}</CommandPaletteProvider>
                  </TooltipProvider>
                </DialogProvider>
              </ToastProvider>
            </AuthProvider>
          </BrowserRouter>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
