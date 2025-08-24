import { type FastifyReply, type FastifyRequest } from 'fastify';
import { ModelsService } from './models.service';
import { IModel } from './models.types';

export class ModelsController {
  private modelService: ModelsService;

  constructor() {
    this.modelService = new ModelsService();
  }

  public async createModel(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const modelData = request.body as IModel;
    const newModel = await this.modelService.createModel(modelData);
    reply.status(201).send({
      success: true,
      data: newModel
    });
  }

  public async getAllModels(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const models = await this.modelService.getAllModels();
    reply.status(200).send({
      success: true,
      data: models
    });
  }

  public async getModelById(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: number };
    const model = await this.modelService.getModelById(id);
    reply.status(200).send({
      success: true,
      data: model
    });
  }

  public async updateModel(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: number };
    const modelData = request.body as IModel;
    const updatedModel = await this.modelService.updateModel(id, modelData);
    reply.status(200).send({
      success: true,
      data: updatedModel
    });
  }

  public async deleteModel(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    const { id } = request.params as { id: number };
    await this.modelService.deleteModel(id);
    reply.status(200).send({
      success: true,
      data: null
    });
  }
}
