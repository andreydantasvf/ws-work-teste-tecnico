import type { ApiResponse } from '@/lib/api-client';

export interface Car {
  id: number;
  year: number;
  fuel: string;
  numberOfPorts: number;
  color: string;
  value: number;
  modelId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCarPayload {
  year: number;
  fuel: string;
  numberOfPorts: number;
  color: string;
  value: number;
  modelId: number;
}

export interface UpdateCarPayload {
  year: number;
  fuel: string;
  numberOfPorts: number;
  color: string;
  value: number;
  modelId: number;
}

export type CarsListResponse = ApiResponse<Car[]>;

export type CarResponse = ApiResponse<Car>;
