import { AppProviders } from '@/app/AppProviders';
import { AppRoutes } from '@/app/AppRoutes';
import { Toaster } from '@/components/shared/Toaster';
import { CommandPalette } from '@/components/CommandPalette';

function App() {
  return (
    <AppProviders>
      <AppRoutes />
      <Toaster />
      <CommandPalette />
    </AppProviders>
  );
}

export default App;
