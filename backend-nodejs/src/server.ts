import { errorHandler } from '@/core/webserver/error-handler';
import App from '@/core/webserver/app';
import { env } from '@/core/config/env';
import { BrandsRoutes } from './modules/brands/brands.routes';

export const app = new App({
  routes: [BrandsRoutes]
});

errorHandler(app.getApp());

if (env.NODE_ENV !== 'test') {
  app.listen();
}
