import React, { useState } from 'react';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BrandCard } from '@/components/brands/brand-card';
import { BrandModal } from '@/components/brands/brand-modal';
import {
  useBrands,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand
} from '@/hooks/use-brands';
import type {
  Brand,
  CreateBrandPayload,
  UpdateBrandPayload
} from '@/types/brand';

/**
 * BrandsPage component - Main page for managing vehicle brands
 *
 * Features:
 * - List all brands in a responsive grid
 * - Create new brands with a modal form
 * - Edit existing brands inline
 * - Delete brands with optimistic updates
 * - Loading states and error handling
 * - Mobile-first responsive design
 *
 * @example
 * ```tsx
 * <BrandsPage />
 * ```
 */
export const BrandsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | undefined>(
    undefined
  );
  const [deletingBrandId, setDeletingBrandId] = useState<number | undefined>(
    undefined
  );

  // React Query hooks
  const { data: brands = [], isLoading, error, refetch } = useBrands();
  const createBrandMutation = useCreateBrand();
  const updateBrandMutation = useUpdateBrand();
  const deleteBrandMutation = useDeleteBrand();

  const handleCreateBrand = async (data: CreateBrandPayload) => {
    try {
      await createBrandMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleUpdateBrand = async (data: UpdateBrandPayload) => {
    if (!editingBrand) return;

    try {
      await updateBrandMutation.mutateAsync({
        id: editingBrand.id,
        payload: data
      });
      setEditingBrand(undefined);
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleDeleteBrand = async (brandId: number) => {
    if (
      window.confirm(
        'Are you sure you want to delete this brand? This action cannot be undone.'
      )
    ) {
      setDeletingBrandId(brandId);
      try {
        await deleteBrandMutation.mutateAsync(brandId);
      } catch {
        // Error is handled by the mutation
      } finally {
        setDeletingBrandId(undefined);
      }
    }
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingBrand(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading brands...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-6 w-6" />
          <span>Failed to load brands</span>
        </div>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vehicle Brands</h1>
          <p className="text-muted-foreground mt-1">
            Manage your vehicle brands and their information
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
          disabled={createBrandMutation.isPending}
        >
          <Plus className="h-4 w-4" />
          Add Brand
        </Button>
      </div>

      {/* Brands Grid */}
      {brands.length === 0 ? (
        <Card className="p-8">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">No brands yet</h3>
              <p className="text-muted-foreground">
                Get started by creating your first vehicle brand.
              </p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Create Your First Brand
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onEdit={handleEditBrand}
              onDelete={handleDeleteBrand}
              isLoading={deletingBrandId === brand.id}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <BrandModal
        isOpen={isCreateModalOpen || !!editingBrand}
        onClose={handleCloseModal}
        brand={editingBrand}
        onSubmit={(data) => {
          if (editingBrand) {
            return handleUpdateBrand(data as UpdateBrandPayload);
          } else {
            return handleCreateBrand(data as CreateBrandPayload);
          }
        }}
        isLoading={
          createBrandMutation.isPending || updateBrandMutation.isPending
        }
      />
    </div>
  );
};
