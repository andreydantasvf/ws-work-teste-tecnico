import { FastifyInstance } from 'fastify';
import App from '@/core/webserver/app';
import { BrandsRoutes } from '@/modules/brands/brands.routes';
import { ModelsRoutes } from '@/modules/models/models.routes';

export async function createTestApp(): Promise<FastifyInstance> {
  const appInstance = new App({
    routes: [BrandsRoutes, ModelsRoutes]
  });

  const app = appInstance.getApp();
  await app.ready();

  return app;
}

export async function closeTestApp(app: FastifyInstance): Promise<void> {
  await app.close();
}
