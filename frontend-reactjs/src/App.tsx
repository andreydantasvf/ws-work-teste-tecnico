import { QueryProvider } from '@/lib/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { AppRouter } from '@/routes/app-router';
import '@/index.css';

/**
 * Main App component
 * Sets up the application with React Query and routing
 */
function App() {
  return (
    <QueryProvider>
      <div className="min-h-screen w-full bg-slate-100">
        <AppRouter />
        <Toaster />
      </div>
    </QueryProvider>
  );
}

export default App;
