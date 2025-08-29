import { QueryProvider } from '@/lib/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { AppRouter } from '@/routes/app-router';
import '@/index.css';

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
