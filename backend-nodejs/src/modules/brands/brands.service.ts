import { AppError } from '@/core/webserver/app-error';
import { BrandsRepository } from './brands.repository';
import {
  BrandQueryParams,
  PaginatedBrandsResult,
  type IBrand,
  type IBrandRepository
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

  public async getAllBrands(
    queryParams?: BrandQueryParams
  ): Promise<PaginatedBrandsResult> {
    const page = queryParams?.page || 1;
    const limit = queryParams?.limit || 10;
    const search = queryParams?.search;
    const sortBy = queryParams?.sortBy || 'name';
    const sortOrder = queryParams?.sortOrder || 'asc';

    const offset = (page - 1) * limit;

    const totalBrands = await this.repository.countBrands(search);
    const totalPages = Math.ceil(totalBrands / limit);

    const brands = await this.repository.findWithPagination({
      offset,
      limit,
      search,
      sortBy,
      sortOrder
    });

    return {
      brands,
      pagination: {
        page,
        limit,
        total: totalBrands,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
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
}
