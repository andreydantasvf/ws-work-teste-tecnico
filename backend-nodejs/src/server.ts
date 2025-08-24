import { errorHandler } from '@/core/webserver/error-handler';
import App from '@/core/webserver/app';
import { env } from '@/core/config/env';
import { BrandsRoutes } from './modules/brands/brands.routes';
import { ModelsRoutes } from './modules/models/models.routes';
import { CarsRoutes } from './modules/cars/cars.routes';

export const app = new App({
  routes: [CarsRoutes, BrandsRoutes, ModelsRoutes]
});

errorHandler(app.getApp());

if (env.NODE_ENV !== 'test') {
  app.listen();
}
