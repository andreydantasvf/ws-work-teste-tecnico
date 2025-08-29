import { apiClient } from '@/lib/api-client';
import type {
  Car,
  CreateCarPayload,
  UpdateCarPayload,
  CarsListResponse,
  CarResponse
} from '@/types/car';

/**
 * Car API service
 * Handles all car-related API operations
 */
export const carService = {
  /**
   * Get all cars
   */
  async getCars(): Promise<Car[]> {
    const response = await apiClient.get<CarsListResponse>('/cars');
    return response.data;
  },

  /**
   * Get car by ID
   */
  async getCarById(id: number): Promise<Car> {
    const response = await apiClient.get<CarResponse>(`/cars/${id}`);
    return response.data;
  },

  /**
   * Create a new car
   */
  async createCar(payload: CreateCarPayload): Promise<Car> {
    const response = await apiClient.post<CarResponse>('/cars', payload);
    return response.data;
  },

  /**
   * Update an existing car
   */
  async updateCar(id: number, payload: UpdateCarPayload): Promise<Car> {
    const response = await apiClient.put<CarResponse>(`/cars/${id}`, payload);
    return response.data;
  },

  /**
   * Delete a car
   */
  async deleteCar(id: number): Promise<void> {
    await apiClient.delete<{ success: true; data: null }>(`/cars/${id}`);
  }
};
