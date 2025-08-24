export interface IBrand {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaginationParams {
  offset: number;
  limit: number;
  search?: string;
  sortBy: 'name' | 'createdAt' | 'id';
  sortOrder: 'asc' | 'desc';
}

export interface BrandQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'id';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedBrandsResult {
  brands: IBrand[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface IBrandRepository {
  save(brand: IBrand): Promise<IBrand>;
  findById(id: number): Promise<IBrand | null>;
  findByName(name: string): Promise<IBrand | null>;
  findAll(): Promise<IBrand[]>;
  findWithPagination(params: PaginationParams): Promise<IBrand[]>;
  countBrands(search?: string): Promise<number>;
  update(id: number, brand: IBrand): Promise<IBrand | null>;
  delete(id: number): Promise<boolean>;
}
