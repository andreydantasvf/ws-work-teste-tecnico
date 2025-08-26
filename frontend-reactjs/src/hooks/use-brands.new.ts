import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brand.service';
import type {
  Brand,
  CreateBrandPayload,
  UpdateBrandPayload
} from '@/types/brand';

// Query keys for better cache management
export const brandKeys = {
  all: ['brands'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  list: (filters: string) => [...brandKeys.lists(), { filters }] as const,
  details: () => [...brandKeys.all, 'detail'] as const,
  detail: (id: number) => [...brandKeys.details(), id] as const
};

/**
 * Hook to fetch all brands
 */
export function useBrands() {
  return useQuery({
    queryKey: brandKeys.lists(),
    queryFn: brandService.getBrands,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

/**
 * Hook to fetch a single brand by ID
 */
export function useBrand(id: number) {
  return useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: () => brandService.getBrandById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

/**
 * Hook to create a new brand
 */
export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBrandPayload) =>
      brandService.createBrand(payload),
    onSuccess: (newBrand: Brand) => {
      // Update the brands list cache
      queryClient.setQueryData(
        brandKeys.lists(),
        (oldData: Brand[] | undefined) => {
          if (!oldData) return [newBrand];
          return [...oldData, newBrand];
        }
      );

      // Set the new brand in detail cache
      queryClient.setQueryData(brandKeys.detail(newBrand.id), newBrand);
    }
  });
}

/**
 * Hook to update an existing brand
 */
export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload
    }: {
      id: number;
      payload: UpdateBrandPayload;
    }) => brandService.updateBrand(id, payload),
    onSuccess: (updatedBrand: Brand) => {
      // Update the brands list cache
      queryClient.setQueryData(
        brandKeys.lists(),
        (oldData: Brand[] | undefined) => {
          if (!oldData) return [updatedBrand];
          return oldData.map((brand) =>
            brand.id === updatedBrand.id ? updatedBrand : brand
          );
        }
      );

      // Update the detail cache
      queryClient.setQueryData(brandKeys.detail(updatedBrand.id), updatedBrand);
    }
  });
}

/**
 * Hook to delete a brand
 */
export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => brandService.deleteBrand(id),
    onSuccess: (_, deletedId) => {
      // Remove from brands list cache
      queryClient.setQueryData(
        brandKeys.lists(),
        (oldData: Brand[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((brand) => brand.id !== deletedId);
        }
      );

      // Remove from detail cache
      queryClient.removeQueries({ queryKey: brandKeys.detail(deletedId) });
    }
  });
}
