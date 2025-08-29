/**
 * Car entity type definition (matches backend schema)
 */
export interface Car {
  id: number;
  year: number;
  fuel: string;
  numberOfPorts: number;
  color: string;
  modelId: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Car creation payload
 */
export interface CreateCarPayload {
  year: number;
  fuel: string;
  numberOfPorts: number;
  color: string;
  modelId: number;
}

/**
 * Car update payload
 */
export interface UpdateCarPayload {
  year: number;
  fuel: string;
  numberOfPorts: number;
  color: string;
  modelId: number;
}

/**
 * API response wrapper (matches backend response format)
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
}

/**
 * API response for car list
 */
export type CarsListResponse = ApiResponse<Car[]>;

/**
 * API response for single car
 */
export type CarResponse = ApiResponse<Car>;
