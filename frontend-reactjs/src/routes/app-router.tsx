import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardPage } from '@/components/pages/dashboard-page';
import { BrandsPage } from '@/components/pages/brands/brands-page';
import { ModelsPage } from '@/components/pages/models/models-page';
import { CarsPage } from '@/components/pages/cars/cars-page';
import { NotFoundPage } from '@/components/pages/not-found-page';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/cars" element={<CarsPage />} />
        {/* 404 Not Found route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
