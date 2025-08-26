import { QueryProvider } from '@/lib/query-provider';
import { BrandsPage } from '@/components/brands/brands-page';

/**
 * Main App component
 * Sets up the application with React Query and renders the brands page
 */
function App() {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-background">
        <BrandsPage />
      </div>
    </QueryProvider>
  );
}

export default App;
