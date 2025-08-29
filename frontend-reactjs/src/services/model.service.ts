import { apiClient } from '@/lib/api-client';
import type {
  Model,
  CreateModelPayload,
  UpdateModelPayload,
  ModelsListResponse,
  ModelResponse
} from '@/types/model';

/**
 * Model API service
 * Handles all model-related API operations
 */
export const modelService = {
  /**
   * Get all models
   */
  async getModels(): Promise<Model[]> {
    const response = await apiClient.get<ModelsListResponse>('/models');
    return response.data;
  },

  /**
   * Get model by ID
   */
  async getModelById(id: number): Promise<Model> {
    const response = await apiClient.get<ModelResponse>(`/models/${id}`);
    return response.data;
  },

  /**
   * Create a new model
   */
  async createModel(payload: CreateModelPayload): Promise<Model> {
    const response = await apiClient.post<ModelResponse>('/models', payload);
    return response.data;
  },

  /**
   * Update an existing model
   */
  async updateModel(id: number, payload: UpdateModelPayload): Promise<Model> {
    const response = await apiClient.put<ModelResponse>(
      `/models/${id}`,
      payload
    );
    return response.data;
  },

  /**
   * Delete a model
   */
  async deleteModel(id: number): Promise<void> {
    await apiClient.delete<{ success: true; data: null }>(`/models/${id}`);
  }
};
