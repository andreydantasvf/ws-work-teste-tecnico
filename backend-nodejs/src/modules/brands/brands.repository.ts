import { type PrismaClient } from '@prisma/client';
import { type IBrand, type IBrandRepository } from './brands.types';
import { DatabaseConnection } from '@/core/database/connection';

export class BrandsRepository implements IBrandRepository {
  private db: PrismaClient;

  constructor() {
    this.db = DatabaseConnection.getInstance().getClient();
  }

  async save({ name }: IBrand): Promise<IBrand> {
    try {
      const brand = await this.db.brand.create({
        data: {
          name
        }
      });
      return brand;
    } catch (error) {
      throw new Error('Error saving brand to database: ' + error);
    }
  }

  async findAll(): Promise<IBrand[]> {
    try {
      const brands = await this.db.brand.findMany();
      return brands;
    } catch (error) {
      throw new Error('Error fetching all brands: ' + error);
    }
  }

  async findById(id: number): Promise<IBrand | null> {
    try {
      const brand = await this.db.brand.findUnique({
        where: { id }
      });
      return brand;
    } catch (error) {
      throw new Error('Error fetching brand by ID: ' + error);
    }
  }

  async findByName(name: string): Promise<IBrand | null> {
    try {
      const brand = await this.db.brand.findUnique({
        where: { name }
      });
      return brand;
    } catch (error) {
      throw new Error('Error fetching brand by name: ' + error);
    }
  }

  async update(id: number, brand: IBrand): Promise<IBrand | null> {
    try {
      const updatedBrand = await this.db.brand.update({
        where: { id },
        data: brand
      });
      return updatedBrand;
    } catch (error) {
      throw new Error('Error updating brand: ' + error);
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.db.brand.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      throw new Error('Error deleting brand: ' + error);
    }
  }
}
