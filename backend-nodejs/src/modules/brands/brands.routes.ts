import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { BrandsController } from './brands.controller';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  brandIdSchema,
  createBrandSchema,
  createBrandResponseSchema,
  paginatedBrandsResponseSchema,
  brandsQuerySchema,
  deleteBrandResponseSchema,
  errorResponseSchema
} from './brands.schema';

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
          tags: ['Marcas'],
          summary: 'Criar uma nova marca',
          description:
            'Cria uma nova marca no sistema. O nome deve ser único e ter entre 2 e 100 caracteres.',
          body: createBrandSchema,
          response: {
            201: createBrandResponseSchema,
            400: errorResponseSchema
          }
        }
      },
      (request, reply) => this.controller.createBrand(request, reply)
    );

    fastifyWithZod.get(
      '/',
      {
        schema: {
          tags: ['Marcas'],
          summary: 'Listar marcas com paginação',
          description:
            'Retorna uma lista paginada de marcas com opções de busca e ordenação. Suporta busca por nome, paginação e ordenação por diferentes campos.',
          querystring: brandsQuerySchema,
          response: {
            200: paginatedBrandsResponseSchema
          }
        }
      },
      (request, reply) => this.controller.getAllBrands(request, reply)
    );

    fastifyWithZod.get(
      '/:id',
      {
        schema: {
          tags: ['Marcas'],
          summary: 'Buscar marca por ID',
          description: 'Retorna uma única marca através do seu ID numérico.',
          params: brandIdSchema,
          response: {
            200: createBrandResponseSchema,
            404: errorResponseSchema
          }
        }
      },
      (request, reply) => this.controller.getBrandById(request, reply)
    );

    fastifyWithZod.delete(
      '/:id',
      {
        schema: {
          tags: ['Marcas'],
          summary: 'Deletar marca por ID',
          description:
            'Remove uma marca do sistema. Retorna sucesso e dados nulos em caso de sucesso.',
          params: brandIdSchema,
          response: {
            200: deleteBrandResponseSchema,
            404: errorResponseSchema
          }
        }
      },
      (request, reply) => this.controller.deleteBrand(request, reply)
    );

    fastifyWithZod.put(
      '/:id',
      {
        schema: {
          tags: ['Marcas'],
          summary: 'Atualizar marca por ID',
          description: 'Atualiza o nome de uma marca. O nome deve ser único.',
          params: brandIdSchema,
          body: createBrandSchema,
          response: {
            200: createBrandResponseSchema,
            400: errorResponseSchema,
            404: errorResponseSchema
          }
        }
      },
      (request, reply) => this.controller.updateBrand(request, reply)
    );
  };
}
