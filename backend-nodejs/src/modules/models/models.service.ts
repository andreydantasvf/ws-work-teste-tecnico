import { AppError } from '@/core/webserver/app-error';
import { ModelRepository } from './models.repository';
import { type IModel, type IModelRepository } from './models.types';

export class ModelsService {
  private repository: IModelRepository;

  constructor() {
    this.repository = new ModelRepository();
  }

  public async createModel(modelData: IModel): Promise<IModel> {
    const existingModel = await this.repository.findByName(modelData.name);
    if (existingModel) {
      throw new AppError('Já existe um modelo com este nome', 400);
    }
    return await this.repository.save(modelData);
  }

  public async updateModel(
    id: number,
    modelData: IModel
  ): Promise<IModel | null> {
    const existingModel = await this.repository.findById(id);
    if (!existingModel) {
      throw new AppError('Modelo não encontrado', 404);
    }
    return await this.repository.update(id, modelData);
  }

  public async deleteModel(id: number): Promise<boolean> {
    const existingModel = await this.repository.findById(id);
    if (!existingModel) {
      throw new AppError('Modelo não encontrado', 404);
    }
    return await this.repository.delete(id);
  }

  public async getAllModels(): Promise<IModel[]> {
    return await this.repository.findAll();
  }

  public async getModelById(id: number): Promise<IModel> {
    const model = await this.repository.findById(id);
    if (!model) {
      throw new AppError('Modelo não encontrado', 404);
    }
    return model;
  }
}
