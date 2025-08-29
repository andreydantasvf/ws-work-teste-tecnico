import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus } from 'lucide-react';
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
import { toast } from 'sonner';
import { useBrands } from '@/hooks/use-brands';
import { brandService } from '@/services/brand.service';
import { useQueryClient } from '@tanstack/react-query';
import type { Brand, CreateBrandPayload } from '@/types/brand';
import { createBrandsColumns } from './brands-columns';

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
  const [formData, setFormData] = useState<CreateBrandPayload>({ name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();
  const { data: brands = [], isLoading: loading } = useBrands();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingBrand) {
        await brandService.updateBrand(editingBrand.id, formData);
        toast.success('Marca atualizada com sucesso');
      } else {
        await brandService.createBrand(formData);
        toast.success('Marca criada com sucesso');
      }

      // Invalidate and refetch brands data
      queryClient.invalidateQueries({ queryKey: ['brands'] });

      setDialogOpen(false);
      setEditingBrand(null);
      setFormData({ name: '' });
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
    setFormData({ name: brand.name });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingBrand(null);
    setFormData({ name: '' });
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleNavigateBack}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Voltar
              </Button>
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">
                Gerenciar Marcas
              </h1>
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Marca
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Marcas Cadastradas</CardTitle>
            <CardDescription>
              Gerencie todas as marcas de veículos do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Carregando...</div>
            ) : brands.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma marca cadastrada</p>
                <Button onClick={openCreateDialog} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar primeira marca
                </Button>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={brands}
                searchKey="name"
                searchPlaceholder="Filtrar por nome da marca..."
              />
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBrand ? 'Editar Marca' : 'Nova Marca'}
              </DialogTitle>
              <DialogDescription>
                {editingBrand
                  ? 'Atualize as informações da marca'
                  : 'Preencha os dados da nova marca'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome da Marca</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    placeholder="Ex: Toyota, Honda, Ford..."
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
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
