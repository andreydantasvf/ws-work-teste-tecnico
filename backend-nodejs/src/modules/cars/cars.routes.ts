import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { CarsController } from './cars.controller';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import {
  carIdSchema,
  carsListResponseSchema,
  createCarResponseSchema,
  createCarSchema,
  deleteCarResponseSchema,
  errorResponseSchema
} from './cars.schema';

export class CarsRoutes {
  public prefix_route = '/cars';
  private controller: CarsController;

  constructor() {
    this.controller = new CarsController();
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
          tags: ['Carros'],
          summary: 'Criar um carro',
          description: 'Cria um novo carro no sistema',
          body: createCarSchema,
          response: {
            201: createCarResponseSchema,
            400: errorResponseSchema
          }
        }
      },
      (request, reply) => this.controller.createCar(request, reply)
    );

    fastifyWithZod.get(
      '/:id',
      {
        schema: {
          tags: ['Carros'],
          summary: 'Buscar carro pelo ID',
          description: 'Obtém um carro pelo ID',
          params: carIdSchema,
          response: {
            200: createCarResponseSchema,
            404: errorResponseSchema
          }
        }
      },
      (request, reply) => this.controller.getCarById(request, reply)
    );

    fastifyWithZod.get(
      '/',
      {
        schema: {
          tags: ['Carros'],
          summary: 'Listar todos os carros',
          description: 'Obtém uma lista de todos os carros',
          response: {
            200: carsListResponseSchema
          }
        }
      },
      (request, reply) => this.controller.getAllCars(request, reply)
    );

    fastifyWithZod.delete(
      '/:id',
      {
        schema: {
          tags: ['Carros'],
          summary: 'Deletar carro pelo ID',
          description: 'Remove um carro pelo ID',
          params: carIdSchema,
          response: {
            200: deleteCarResponseSchema,
            404: errorResponseSchema
          }
        }
      },
      (request, reply) => this.controller.deleteCar(request, reply)
    );

    fastifyWithZod.put(
      '/:id',
      {
        schema: {
          tags: ['Carros'],
          summary: 'Atualizar carro pelo ID',
          description: 'Atualiza um carro pelo ID',
          params: carIdSchema,
          body: createCarSchema,
          response: {
            200: createCarResponseSchema,
            400: errorResponseSchema,
            404: errorResponseSchema
          }
        }
      },
      (request, reply) => this.controller.updateCar(request, reply)
    );
  };
}
