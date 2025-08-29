import { apiClient } from '@/lib/api-client';
import type {
  Brand,
  CreateBrandPayload,
  UpdateBrandPayload,
  BrandsListResponse,
  BrandResponse
} from '@/types/brand';

export const brandService = {
  async getBrands(): Promise<Brand[]> {
    const response = await apiClient.get<BrandsListResponse>('/brands');
    return response.data;
  },

  async getBrandById(id: number): Promise<Brand> {
    const response = await apiClient.get<BrandResponse>(`/brands/${id}`);
    return response.data;
  },

  async createBrand(payload: CreateBrandPayload): Promise<Brand> {
    const response = await apiClient.post<BrandResponse>('/brands', payload);
    return response.data;
  },

  async updateBrand(id: number, payload: UpdateBrandPayload): Promise<Brand> {
    const response = await apiClient.put<BrandResponse>(
      `/brands/${id}`,
      payload
    );
    return response.data;
  },

  async deleteBrand(id: number): Promise<void> {
    await apiClient.delete<{ success: true; data: null }>(`/brands/${id}`);
  }
};
