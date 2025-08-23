import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { BrandsController } from './brands.controller';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { brandIdSchema, createBrandSchema } from './brands.schema';

export class BrandsRoutes {
  public prefix_route = '/brands';
  private controller: BrandsController;

  constructor() {
    this.controller = new BrandsController();
  }

  public routes = async (
    fastify: FastifyInstance,
    _options: FastifyPluginOptions
  ) => {
    const fastifyWithZod = fastify.withTypeProvider<ZodTypeProvider>();

    fastifyWithZod.post(
      '/',
      {
        schema: {
          body: createBrandSchema
        }
      },
      (request, reply) => this.controller.createBrand(request, reply)
    );

    fastifyWithZod.get('/', {}, (request, reply) =>
      this.controller.getAllBrands(request, reply)
    );

    fastifyWithZod.get(
      '/:id',
      {
        schema: {
          params: brandIdSchema
        }
      },
      (request, reply) => this.controller.getBrandById(request, reply)
    );

    fastifyWithZod.delete(
      '/:id',
      {
        schema: {
          params: brandIdSchema
        }
      },
      (request, reply) => this.controller.deleteBrand(request, reply)
    );

    fastifyWithZod.put(
      '/:id',
      {
        schema: {
          params: brandIdSchema,
          body: createBrandSchema
        }
      },
      (request, reply) => this.controller.updateBrand(request, reply)
    );
  };
}
