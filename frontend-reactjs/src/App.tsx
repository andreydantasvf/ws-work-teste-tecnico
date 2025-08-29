import { Toaster } from '@/components/ui/sonner';
import { AppRouter } from '@/routes/app-router';
import { QueryProvider } from '@/lib/query-provider';

import { ThemeToggle } from './components/theme-toggle';
import './index.css';

function App() {
  return (
    <QueryProvider>
      <div className="fixed right-6 top-6 z-50">
        <ThemeToggle />
      </div>
      <div className="min-h-screen w-full bg-background text-foreground">
        <AppRouter />
      </div>
      <Toaster
        position="bottom-right"
        theme="system"
        className="toaster group"
        toastOptions={{
          classNames: {
            toast:
              'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
            description: 'group-[.toast]:text-muted-foreground',
            actionButton:
              'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
            cancelButton:
              'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground'
          }
        }}
      />
    </QueryProvider>
  );
}

export default App;
