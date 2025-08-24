import { AppError } from '@/core/webserver/app-error';
import { BrandsRepository } from './brands.repository';
import {
  type IBrand,
  type IBrandRepository,
  type IModelByBrand
} from './brands.types';

export class BrandsService {
  private repository: IBrandRepository;

  constructor() {
    this.repository = new BrandsRepository();
  }

  public async createBrand({ name }: IBrand): Promise<IBrand> {
    const existingBrand = await this.repository.findByName(name);
    if (existingBrand) {
      throw new AppError('Marca já existe', 400);
    }
    return await this.repository.save({ name });
  }

  public async getAllBrands(): Promise<IBrand[]> {
    return await this.repository.findAll();
  }

  public async getBrandById(id: number): Promise<IBrand> {
    const brand = await this.repository.findById(id);
    if (!brand) {
      throw new AppError('Marca não encontrada', 404);
    }
    return brand;
  }

  public async updateBrand(
    id: number,
    brandData: IBrand
  ): Promise<IBrand | null> {
    const brand = await this.repository.findById(id);
    if (!brand) {
      throw new AppError('Marca não encontrada', 404);
    }
    return await this.repository.update(id, brandData);
  }

  public async deleteBrand(id: number): Promise<boolean> {
    const brand = await this.repository.findById(id);
    if (!brand) {
      throw new AppError('Marca não encontrada', 404);
    }
    return await this.repository.delete(id);
  }

  public async getModelsByBrandId(brandId: number): Promise<IModelByBrand[]> {
    const brand = await this.repository.findById(brandId);
    if (!brand) {
      throw new AppError('Marca não encontrada', 404);
    }
    return await this.repository.findModelsByBrandId(brandId);
  }
}
