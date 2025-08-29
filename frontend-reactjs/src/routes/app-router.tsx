import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardPage } from '@/components/pages/dashboard-page';
import { BrandsPage } from '@/components/pages/brands-page';
import { ModelsPage } from '@/components/pages/models-page';
import { CarsPage } from '@/components/pages/cars-page';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/cars" element={<CarsPage />} />
        {/* Fallback route */}
        <Route path="*" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
