import type { ApiResponse } from '@/lib/api-client';

export interface Brand {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBrandPayload {
  name: string;
}

export interface UpdateBrandPayload {
  name: string;
}

export type BrandsListResponse = ApiResponse<Brand[]>;

export type BrandResponse = ApiResponse<Brand>;

export interface ApiError {
  message: string;
  statusCode: number;
  error: unknown;
}
