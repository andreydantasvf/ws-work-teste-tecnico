import { type PrismaClient } from '@prisma/client';
import { IModel, IModelRepository } from './models.types';
import { DatabaseConnection } from '@/core/database/connection';

export class ModelRepository implements IModelRepository {
  private db: PrismaClient;

  constructor() {
    this.db = DatabaseConnection.getInstance().getClient();
  }

  async save({ name, fipeValue, brandId }: IModel): Promise<IModel> {
    try {
      const newModel = await this.db.model.create({
        data: {
          name,
          fipeValue,
          brandId
        }
      });
      return newModel;
    } catch (error) {
      throw new Error('Error saving model to database: ' + error);
    }
  }

  async findAll(): Promise<IModel[]> {
    try {
      const models = await this.db.model.findMany();
      return models;
    } catch (error) {
      throw new Error('Error retrieving models from database: ' + error);
    }
  }

  async findById(id: number): Promise<IModel | null> {
    try {
      const model = await this.db.model.findUnique({
        where: { id }
      });
      return model;
    } catch (error) {
      throw new Error('Error finding model by ID: ' + error);
    }
  }

  async findByName(name: string): Promise<IModel | null> {
    try {
      const model = await this.db.model.findUnique({
        where: { name }
      });
      return model;
    } catch (error) {
      throw new Error('Error finding model by name: ' + error);
    }
  }

  async update(
    id: number,
    { name, fipeValue, brandId }: IModel
  ): Promise<IModel | null> {
    try {
      const updatedModel = await this.db.model.update({
        where: { id },
        data: {
          name,
          fipeValue,
          brandId
        }
      });
      return updatedModel;
    } catch (error) {
      throw new Error('Error updating model in database: ' + error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.db.model.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      throw new Error('Error deleting model from database: ' + error);
    }
  }
}
