import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal';
import { PageSkeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useBrands } from '@/hooks/use-brands';
import { brandService } from '@/services/brand.service';
import { useQueryClient } from '@tanstack/react-query';
import type { Brand } from '@/types/brand';
import { createBrandsColumns } from './brands-columns';
import { brandFormSchema, type BrandFormData } from '@/schemas/brand.schema';

/**
 * Brands management page component
 * Allows CRUD operations on vehicle brands
 */
export function BrandsPage() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();
  const { data: brands = [], isLoading } = useBrands();

  const form = useForm<BrandFormData>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      name: ''
    }
  });

  // Show skeleton while loading
  if (isLoading) {
    return <PageSkeleton />;
  }

  const handleSubmit = async (data: BrandFormData) => {
    setIsSubmitting(true);

    try {
      if (editingBrand) {
        await brandService.updateBrand(editingBrand.id, data);
        toast.success('Marca atualizada com sucesso');
      } else {
        await brandService.createBrand(data);
        toast.success('Marca criada com sucesso');
      }

      // Invalidate and refetch brands data
      queryClient.invalidateQueries({ queryKey: ['brands'] });

      setDialogOpen(false);
      setEditingBrand(null);
      form.reset();
    } catch {
      toast.error('Falha ao salvar marca');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!brandToDelete) return;

    setIsDeleting(true);
    try {
      await brandService.deleteBrand(brandToDelete.id);
      toast.success('Marca excluída com sucesso');

      // Invalidate and refetch brands data
      queryClient.invalidateQueries({ queryKey: ['brands'] });

      setDeleteModalOpen(false);
      setBrandToDelete(null);
    } catch {
      toast.error('Falha ao excluir marca');
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditDialog = (brand: Brand) => {
    setEditingBrand(brand);
    form.setValue('name', brand.name);
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingBrand(null);
    form.reset();
    setDialogOpen(true);
  };

  const openDeleteModal = (brand: Brand) => {
    setBrandToDelete(brand);
    setDeleteModalOpen(true);
  };

  const handleNavigateBack = () => {
    navigate('/');
  };

  // Create columns with handlers
  const columns = createBrandsColumns({
    onEdit: openEditDialog,
    onDelete: openDeleteModal
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleNavigateBack}
                className="text-muted-foreground cursor-pointer hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                ← Voltar
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    Gerenciar Marcas
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Cadastre e gerencie as marcas de veículos
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={openCreateDialog}
              className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-soft"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Marca
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-soft animate-fade-in">
          <CardHeader className="pb-4">
            <CardTitle className="text-card-foreground">
              Marcas Cadastradas
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Lista de todas as marcas disponíveis no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={brands}
              searchKey="name"
              searchPlaceholder="Buscar por nome da marca..."
            />
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="border-border/50 bg-card/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-card-foreground">
                {editingBrand ? 'Editar Marca' : 'Nova Marca'}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {editingBrand
                  ? 'Atualize as informações da marca'
                  : 'Preencha os dados da nova marca'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-6 py-4">
                <div className="grid gap-3">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground"
                  >
                    Nome da Marca
                  </Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Ex: Toyota, Honda, Ford..."
                    className="border-border/50 focus:border-primary bg-background/50"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter className="gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="border-border/50 hover:border-primary/50 bg-transparent"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-soft"
                >
                  {isSubmitting
                    ? 'Salvando...'
                    : editingBrand
                      ? 'Atualizar'
                      : 'Criar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="Excluir Marca"
          description={`Tem certeza que deseja excluir a marca "${brandToDelete?.name}"? Esta ação não pode ser desfeita.`}
          isLoading={isDeleting}
        />
      </main>
    </div>
  );
}
