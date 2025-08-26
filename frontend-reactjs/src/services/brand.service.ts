import { apiClient } from '@/lib/api-client';
import type {
  Brand,
  CreateBrandPayload,
  UpdateBrandPayload,
  BrandsListResponse,
  BrandResponse
} from '@/types/brand';

/**
 * Brand API service
 * Handles all brand-related API operations
 */
export const brandService = {
  /**
   * Get all brands
   */
  async getBrands(): Promise<Brand[]> {
    const response = await apiClient.get<BrandsListResponse>('/brands');
    return response.data;
  },

  /**
   * Get brand by ID
   */
  async getBrandById(id: number): Promise<Brand> {
    const response = await apiClient.get<BrandResponse>(`/brands/${id}`);
    return response.data;
  },

  /**
   * Create a new brand
   */
  async createBrand(payload: CreateBrandPayload): Promise<Brand> {
    const response = await apiClient.post<BrandResponse>('/brands', payload);
    return response.data;
  },

  /**
   * Update an existing brand
   */
  async updateBrand(id: number, payload: UpdateBrandPayload): Promise<Brand> {
    const response = await apiClient.put<BrandResponse>(
      `/brands/${id}`,
      payload
    );
    return response.data;
  },

  /**
   * Delete a brand
   */
  async deleteBrand(id: number): Promise<void> {
    await apiClient.delete<{ success: true; data: null }>(`/brands/${id}`);
  }
};
