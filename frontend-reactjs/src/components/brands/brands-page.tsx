import React, { useState } from 'react';
import { Plus, Loader2, AlertCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BrandCard } from '@/components/brands/brand-card';
import { BrandModal } from '@/components/brands/brand-modal';
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
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
  const [deletingBrand, setDeletingBrand] = useState<Brand | undefined>(
    undefined
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // React Query hooks
  const { data: brands = [], isLoading, error, refetch } = useBrands();
  const createBrandMutation = useCreateBrand();
  const updateBrandMutation = useUpdateBrand();
  const deleteBrandMutation = useDeleteBrand();

  const handleCreateBrand = async (data: CreateBrandPayload) => {
    const loadingToast = toast.loading('⏳ Criando marca...', {
      description: 'Processando as informações...'
    });

    try {
      await createBrandMutation.mutateAsync(data);
      setIsCreateModalOpen(false);
      toast.dismiss(loadingToast);
      toast.success('✨ Marca criada com sucesso!', {
        description: `A marca "${data.name}" foi adicionada ao sistema.`,
        duration: 4000
      });
    } catch {
      toast.dismiss(loadingToast);
      toast.error('❌ Erro ao criar marca', {
        description:
          'Verifique os dados e tente novamente em alguns instantes.',
        duration: 5000
      });
    }
  };

  const handleUpdateBrand = async (data: UpdateBrandPayload) => {
    if (!editingBrand) return;

    const loadingToast = toast.loading('⏳ Atualizando marca...', {
      description: 'Salvando as alterações...'
    });

    try {
      await updateBrandMutation.mutateAsync({
        id: editingBrand.id,
        payload: data
      });
      setEditingBrand(undefined);
      toast.dismiss(loadingToast);
      toast.success('🔄 Marca atualizada com sucesso!', {
        description: `As informações da marca "${data.name}" foram atualizadas.`,
        duration: 4000
      });
    } catch {
      toast.dismiss(loadingToast);
      toast.error('❌ Erro ao atualizar marca', {
        description:
          'Verifique os dados e tente novamente em alguns instantes.',
        duration: 5000
      });
    }
  };

  const handleDeleteBrand = async () => {
    if (!deletingBrand) return;

    const loadingToast = toast.loading('⏳ Deletando marca...', {
      description: 'Removendo do sistema...'
    });

    try {
      await deleteBrandMutation.mutateAsync(deletingBrand.id);
      setIsDeleteModalOpen(false);
      setDeletingBrand(undefined);
      toast.dismiss(loadingToast);
      toast.success('🗑️ Marca deletada com sucesso!', {
        description: `A marca "${deletingBrand.name}" foi removida permanentemente do sistema.`,
        duration: 4000
      });
    } catch {
      toast.dismiss(loadingToast);
      toast.error('❌ Erro ao deletar marca', {
        description:
          'A marca pode estar sendo usada em outros locais. Tente novamente em alguns instantes.',
        duration: 6000
      });
    }
  };

  const handleDeleteClick = (brand: Brand) => {
    setDeletingBrand(brand);
    setIsDeleteModalOpen(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setEditingBrand(undefined);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingBrand(undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4 text-yellow-700"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              <span className="text-lg font-medium">Carregando marcas...</span>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4 text-red-600"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <span className="text-lg font-medium">
                Erro ao carregar marcas
              </span>
            </motion.div>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
            >
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent">
              Marcas de Veículos
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Gerencie as marcas do seu sistema de veículos
            </p>
          </div>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r cursor-pointer from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            disabled={createBrandMutation.isPending}
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nova Marca
          </Button>
        </motion.div>

        {/* Brands Grid */}
        {brands.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-12 border-2 border-yellow-200 bg-gradient-to-br from-white to-yellow-50">
              <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-yellow-800">
                    Nenhuma marca cadastrada
                  </h3>
                  <p className="text-gray-600 mt-2 text-lg">
                    Comece criando sua primeira marca de veículo.
                  </p>
                </div>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Criar Primeira Marca
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {brands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <BrandCard
                  brand={brand}
                  onEdit={handleEditBrand}
                  onDelete={handleDeleteClick}
                  isLoading={
                    deletingBrand?.id === brand.id &&
                    deleteBrandMutation.isPending
                  }
                />
              </motion.div>
            ))}
          </motion.div>
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

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteBrand}
          title="Deletar Marca"
          description={`Tem certeza que deseja deletar a marca "${deletingBrand?.name}"? Esta ação não pode ser desfeita.`}
          isLoading={deleteBrandMutation.isPending}
        />
      </div>
    </div>
  );
};
