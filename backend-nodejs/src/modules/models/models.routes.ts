import { type FastifyPluginOptions, type FastifyInstance } from 'fastify';
import { ModelsController } from './models.controller';
import { type ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  createModelResponseSchema,
  createModelSchema,
  deleteModelResponseSchema,
  errorResponseSchema,
  modelIdSchema,
  modelsListResponseSchema
} from './models.schema';

export class ModelsRoutes {
  public prefix_route = '/models';
  private controller: ModelsController;

  constructor() {
    this.controller = new ModelsController();
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
          tags: ['Modelos'],
          summary: 'Criar um novo modelo',
          description: 'Cria um novo modelo no sistema.',
          body: createModelSchema,
          response: {
            201: createModelResponseSchema,
            400: errorResponseSchema
          }
        }
      },
      (request, reply) => this.controller.createModel(request, reply)
    );

    fastifyWithZod.get(
      '/',
      {
        schema: {
          tags: ['Modelos'],
          summary: 'Listar todos os modelos',
          description: 'Retorna um array com todos os modelos cadastrados.',
          response: {
            200: modelsListResponseSchema
          }
        }
      },
      (request, reply) => this.controller.getAllModels(request, reply)
    );

    fastifyWithZod.get(
      '/:id',
      {
        schema: {
          tags: ['Modelos'],
          summary: 'Obter um modelo por ID',
          description: 'Retorna um modelo específico com base no ID fornecido.',
          params: modelIdSchema,
          response: {
            200: createModelResponseSchema,
            404: errorResponseSchema
          }
        }
      },
      (request, reply) => this.controller.getModelById(request, reply)
    );

    fastifyWithZod.put(
      '/:id',
      {
        schema: {
          tags: ['Modelos'],
          summary: 'Atualizar um modelo por ID',
          description:
            'Atualiza os detalhes de um modelo existente com base no ID fornecido.',
          params: modelIdSchema,
          body: createModelSchema,
          response: {
            200: createModelResponseSchema,
            400: errorResponseSchema,
            404: errorResponseSchema
          }
        }
      },
      (request, reply) => this.controller.updateModel(request, reply)
    );

    fastifyWithZod.delete(
      '/:id',
      {
        schema: {
          tags: ['Modelos'],
          summary: 'Excluir um modelo por ID',
          description: 'Remove um modelo existente com base no ID fornecido.',
          params: modelIdSchema,
          response: {
            200: deleteModelResponseSchema,
            404: errorResponseSchema
          }
        }
      },
      (request, reply) => this.controller.deleteModel(request, reply)
    );
  };
}
