import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brand.service';
import type {
  Brand,
  CreateBrandPayload,
  UpdateBrandPayload
} from '@/types/brand';

export const brandKeys = {
  all: ['brands'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  list: (filters: string) => [...brandKeys.lists(), { filters }] as const,
  details: () => [...brandKeys.all, 'detail'] as const,
  detail: (id: number) => [...brandKeys.details(), id] as const
};

export function useBrands() {
  return useQuery({
    queryKey: brandKeys.lists(),
    queryFn: brandService.getBrands,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useBrand(id: number) {
  return useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: () => brandService.getBrandById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBrandPayload) =>
      brandService.createBrand(payload),
    onSuccess: (newBrand: Brand) => {
      queryClient.setQueryData(
        brandKeys.lists(),
        (oldData: Brand[] | undefined) => {
          if (!oldData) return [newBrand];
          return [...oldData, newBrand];
        }
      );

      queryClient.setQueryData(brandKeys.detail(newBrand.id), newBrand);
    }
  });
}

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
      queryClient.setQueryData(
        brandKeys.lists(),
        (oldData: Brand[] | undefined) => {
          if (!oldData) return [updatedBrand];
          return oldData.map((brand) =>
            brand.id === updatedBrand.id ? updatedBrand : brand
          );
        }
      );

      queryClient.setQueryData(brandKeys.detail(updatedBrand.id), updatedBrand);
    }
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => brandService.deleteBrand(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(
        brandKeys.lists(),
        (oldData: Brand[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((brand) => brand.id !== deletedId);
        }
      );

      queryClient.removeQueries({ queryKey: brandKeys.detail(deletedId) });
    }
  });
}
