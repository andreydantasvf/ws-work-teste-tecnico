/**
 * Model entity type definition (matches backend schema)
 */
export interface Model {
  id: number;
  name: string;
  fipeValue: number;
  brandId: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Model creation payload
 */
export interface CreateModelPayload {
  name: string;
  fipeValue: number;
  brandId: number;
}

/**
 * Model update payload
 */
export interface UpdateModelPayload {
  name: string;
  fipeValue: number;
  brandId: number;
}

/**
 * API response wrapper (matches backend response format)
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
}

/**
 * API response for model list
 */
export type ModelsListResponse = ApiResponse<Model[]>;

/**
 * API response for single model
 */
export type ModelResponse = ApiResponse<Model>;
