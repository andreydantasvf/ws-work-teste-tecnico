/**
 * Brand entity type definition (matches backend schema)
 */
export interface Brand {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Brand creation payload (only name is required based on backend schema)
 */
export interface CreateBrandPayload {
  name: string;
}

/**
 * Brand update payload (only name can be updated based on backend schema)
 */
export interface UpdateBrandPayload {
  name: string;
}

/**
 * API response wrapper (matches backend response format)
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
}

/**
 * API response for brand list
 */
export type BrandsListResponse = ApiResponse<Brand[]>;

/**
 * API response for single brand
 */
export type BrandResponse = ApiResponse<Brand>;

/**
 * API error response (matches backend error format)
 */
export interface ApiError {
  message: string;
  statusCode: number;
  error: unknown;
}
