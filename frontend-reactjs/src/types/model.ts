import type { ApiResponse } from '@/lib/api-client';

export interface Model {
  id: number;
  name: string;
  fipeValue: number;
  brandId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateModelPayload {
  name: string;
  fipeValue: number;
  brandId: number;
}

export interface UpdateModelPayload {
  name: string;
  fipeValue: number;
  brandId: number;
}

export type ModelsListResponse = ApiResponse<Model[]>;

export type ModelResponse = ApiResponse<Model>;
