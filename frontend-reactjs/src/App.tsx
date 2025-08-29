import { Toaster } from '@/components/ui/sonner';
import { AppRouter } from '@/routes/app-router';
import { QueryProvider } from '@/lib/query-provider';

import { ThemeToggle } from './components/theme-toggle';
import './index.css';

function App() {
  return (
    <QueryProvider>
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="min-h-screen w-full bg-background text-foreground">
        <AppRouter />
      </div>
      <Toaster />
    </QueryProvider>
  );
}

export default App;
