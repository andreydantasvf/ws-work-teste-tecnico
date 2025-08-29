import { apiClient } from '@/lib/api-client';
import type {
  Car,
  CreateCarPayload,
  UpdateCarPayload,
  CarsListResponse,
  CarResponse
} from '@/types/car';

export const carService = {
  async getCars(): Promise<Car[]> {
    const response = await apiClient.get<CarsListResponse>('/cars');
    return response.data;
  },

  async getCarById(id: number): Promise<Car> {
    const response = await apiClient.get<CarResponse>(`/cars/${id}`);
    return response.data;
  },

  async createCar(payload: CreateCarPayload): Promise<Car> {
    const response = await apiClient.post<CarResponse>('/cars', payload);
    return response.data;
  },

  async updateCar(id: number, payload: UpdateCarPayload): Promise<Car> {
    const response = await apiClient.put<CarResponse>(`/cars/${id}`, payload);
    return response.data;
  },

  async deleteCar(id: number): Promise<void> {
    await apiClient.delete<{ success: true; data: null }>(`/cars/${id}`);
  }
};
