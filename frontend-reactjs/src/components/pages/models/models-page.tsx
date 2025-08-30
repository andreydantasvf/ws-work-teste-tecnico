import { useState, useEffect, useCallback } from 'react';
import { Wrench, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import { createModelsColumns, type ModelWithBrand } from './models-columns';
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { PageSkeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useBrands } from '@/hooks/use-brands';
import { useModels } from '@/hooks/use-models';
import { modelService } from '@/services/model.service';
import type { Model } from '@/types/model';
import { modelFormSchema, type ModelFormData } from '@/schemas/model.schema';

/**
 * Models page component
 * Manages all vehicle models in the system
 */
export function ModelsPage() {
  const navigate = useNavigate();
  const [models, setModels] = useState<ModelWithBrand[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch data using React Query hooks
  const { data: brands = [], isLoading: brandsLoading } = useBrands();
  const {
    data: modelsData = [],
    isLoading: modelsLoading,
    refetch: refetchModels
  } = useModels();

  const form = useForm<ModelFormData>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      name: '',
      brandId: 0,
      fipeValue: 0
    }
  });

  const loadModelsWithBrands = useCallback(() => {
    const modelsWithBrands = modelsData.map((model) => {
      const brand = brands.find((b) => b.id === model.brandId);
      return {
        ...model,
        brand_name: brand?.name || 'Marca não encontrada'
      };
    });

    setModels(modelsWithBrands);
  }, [brands, modelsData]);

  useEffect(() => {
    loadModelsWithBrands();
  }, [loadModelsWithBrands]);

  const loading = brandsLoading || modelsLoading;

  // Show skeleton while loading
  if (loading) {
    return <PageSkeleton />;
  }

  const handleSubmit = async (data: ModelFormData) => {
    setIsSubmitting(true);

    try {
      if (editingModel) {
        await modelService.updateModel(editingModel.id, data);
        toast.success('Modelo atualizado com sucesso');
      } else {
        await modelService.createModel(data);
        toast.success('Modelo criado com sucesso');
      }

      setDialogOpen(false);
      setEditingModel(null);
      form.reset();
      refetchModels();
    } catch {
      toast.error('Falha ao salvar modelo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!modelToDelete) return;

    setIsDeleting(true);
    try {
      await modelService.deleteModel(modelToDelete.id);
      toast.success('Modelo excluído com sucesso');
      refetchModels();
      setDeleteModalOpen(false);
      setModelToDelete(null);
    } catch {
      toast.error('Falha ao excluir modelo');
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditDialog = (model: Model) => {
    setEditingModel(model);
    form.setValue('name', model.name);
    form.setValue('brandId', model.brandId);
    form.setValue('fipeValue', model.fipeValue);
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingModel(null);
    form.reset();
    setDialogOpen(true);
  };

  const openDeleteModal = (model: Model) => {
    setModelToDelete(model);
    setDeleteModalOpen(true);
  };

  // Create columns with the handlers
  const columns = createModelsColumns(openEditDialog, openDeleteModal);

  const handleNavigateBack = () => {
    navigate('/');
  };

  const handleNavigateToBrands = () => {
    navigate('/brands');
  };

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
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                ← Voltar
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/20">
                  <Wrench className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    Gerenciar Modelos
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Cadastre e gerencie os modelos de veículos
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={openCreateDialog}
              disabled={brands.length === 0}
              className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-soft disabled:opacity-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Modelo
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {brands.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-soft animate-fade-in">
            <CardContent className="text-center py-12">
              <div className="p-4 rounded-full bg-green-500/10 w-fit mx-auto mb-6">
                <Wrench className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Nenhuma marca cadastrada
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Você precisa cadastrar pelo menos uma marca antes de criar
                modelos. As marcas são necessárias para organizar os modelos de
                veículos.
              </p>
              <Button
                onClick={handleNavigateToBrands}
                className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-soft"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Marca
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-soft animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle className="text-card-foreground">
                Modelos Cadastrados
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Lista de todos os modelos de veículos do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {models.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-6">
                    <Wrench className="h-12 w-12 opacity-50" />
                  </div>
                  <p className="font-medium mb-2">Nenhum modelo cadastrado</p>
                  <p className="text-sm mb-6">
                    Comece cadastrando seu primeiro modelo
                  </p>
                  <Button
                    onClick={openCreateDialog}
                    className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-soft"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar primeiro modelo
                  </Button>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={models}
                  searchKey="name"
                  searchPlaceholder="Buscar modelos..."
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="border-border/50 bg-card/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-card-foreground">
                {editingModel ? 'Editar Modelo' : 'Novo Modelo'}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {editingModel
                  ? 'Atualize as informações do modelo'
                  : 'Preencha os dados do novo modelo'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-6 py-4">
                <div className="grid gap-3">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground"
                  >
                    Nome do Modelo
                  </Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Ex: Civic, Corolla, Focus..."
                    className="border-border/50 focus:border-primary bg-background/50"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label
                    htmlFor="brandId"
                    className="text-sm font-medium text-foreground"
                  >
                    Marca
                  </Label>
                  <Select
                    value={
                      form.watch('brandId') > 0
                        ? form.watch('brandId').toString()
                        : ''
                    }
                    onValueChange={(value) =>
                      form.setValue('brandId', Number(value))
                    }
                  >
                    <SelectTrigger className="border-border/50 focus:border-primary bg-background/50">
                      <SelectValue placeholder="Selecione uma marca" />
                    </SelectTrigger>
                    <SelectContent className="border-border/50 bg-card/95 backdrop-blur-xl">
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.brandId && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.brandId.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label
                    htmlFor="fipeValue"
                    className="text-sm font-medium text-foreground"
                  >
                    Valor FIPE (R$)
                  </Label>
                  <Input
                    id="fipeValue"
                    type="number"
                    step="0.01"
                    min="0"
                    {...form.register('fipeValue', { valueAsNumber: true })}
                    placeholder="Ex: 45000.00"
                    className="border-border/50 focus:border-primary bg-background/50"
                  />
                  {form.formState.errors.fipeValue && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.fipeValue.message}
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
                  className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-soft"
                >
                  {isSubmitting
                    ? 'Salvando...'
                    : editingModel
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
          title="Excluir Modelo"
          description={`Tem certeza que deseja excluir o modelo "${modelToDelete?.name}"? Esta ação não pode ser desfeita.`}
          isLoading={isDeleting}
        />
      </main>
    </div>
  );
}
