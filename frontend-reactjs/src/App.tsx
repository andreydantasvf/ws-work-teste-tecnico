import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QueryProvider } from '@/lib/query-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar, type PageType } from '@/components/layout/app-sidebar';
import { Toaster } from '@/components/ui/sonner';
import { BrandsPage } from '@/components/brands/brands-page';
import { DashboardPage } from '@/components/pages/dashboard-page';
import { ModelsPage } from '@/components/pages/models-page';
import { CarsPage } from '@/components/pages/cars-page';

/**
 * Main App component
 * Sets up the application with React Query, Sidebar, and page routing
 */
function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const renderCurrentPage = () => {
    const pageComponents = {
      dashboard: <DashboardPage />,
      brands: <BrandsPage />,
      models: <ModelsPage />,
      cars: <CarsPage />
    };

    return pageComponents[currentPage] || <DashboardPage />;
  };

  return (
    <QueryProvider>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen overflow-x-hidden w-full bg-slate-100 flex">
          <AppSidebar currentPage={currentPage} onPageChange={setCurrentPage} />
          <main className="flex-1 overflow-auto overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
                className="h-full"
              >
                {renderCurrentPage()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        <Toaster />
      </SidebarProvider>
    </QueryProvider>
  );
}

export default App;
