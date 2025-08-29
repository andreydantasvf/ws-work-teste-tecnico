import { apiClient } from '@/lib/api-client';
import type {
  Model,
  CreateModelPayload,
  UpdateModelPayload,
  ModelsListResponse,
  ModelResponse
} from '@/types/model';

export const modelService = {
  async getModels(): Promise<Model[]> {
    const response = await apiClient.get<ModelsListResponse>('/models');
    return response.data;
  },

  async getModelById(id: number): Promise<Model> {
    const response = await apiClient.get<ModelResponse>(`/models/${id}`);
    return response.data;
  },

  async createModel(payload: CreateModelPayload): Promise<Model> {
    const response = await apiClient.post<ModelResponse>('/models', payload);
    return response.data;
  },

  async updateModel(id: number, payload: UpdateModelPayload): Promise<Model> {
    const response = await apiClient.put<ModelResponse>(
      `/models/${id}`,
      payload
    );
    return response.data;
  },

  async deleteModel(id: number): Promise<void> {
    await apiClient.delete<{ success: true; data: null }>(`/models/${id}`);
  }
};
