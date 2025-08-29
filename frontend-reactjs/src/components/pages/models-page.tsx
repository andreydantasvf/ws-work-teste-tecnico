import { useState, useEffect, useCallback } from 'react';
import { Wrench, Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
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
import { toast } from 'sonner';
import { useBrands } from '@/hooks/use-brands';
import { useModels } from '@/hooks/use-models';
import { modelService } from '@/services/model.service';
import type { Model } from '@/types/model';

interface ModelWithBrand extends Model {
  brand_name?: string;
}

/**
 * Models page component
 * Manages all vehicle models in the system
 */
export function ModelsPage() {
  const navigate = useNavigate();
  const [models, setModels] = useState<ModelWithBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    brandId: '',
    fipeValue: ''
  });

  // Fetch data using React Query hooks
  const { data: brands = [], isLoading: brandsLoading } = useBrands();
  const {
    data: modelsData = [],
    isLoading: modelsLoading,
    refetch: refetchModels
  } = useModels();

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
    if (!brandsLoading && !modelsLoading) {
      loadModelsWithBrands();
      setLoading(false);
    }
  }, [loadModelsWithBrands, brandsLoading, modelsLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const modelData = {
        name: formData.name,
        brandId: Number.parseInt(formData.brandId),
        fipeValue: Number.parseFloat(formData.fipeValue)
      };

      if (editingModel) {
        await modelService.updateModel(editingModel.id, modelData);
        toast.success('Modelo atualizado com sucesso');
      } else {
        await modelService.createModel(modelData);
        toast.success('Modelo criado com sucesso');
      }

      setDialogOpen(false);
      setEditingModel(null);
      setFormData({ name: '', brandId: '', fipeValue: '' });
      refetchModels();
    } catch {
      toast.error('Falha ao salvar modelo');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este modelo?')) return;

    try {
      await modelService.deleteModel(id);
      toast.success('Modelo excluído com sucesso');
      refetchModels();
    } catch {
      toast.error('Falha ao excluir modelo');
    }
  };

  const openEditDialog = (model: Model) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      brandId: model.brandId.toString(),
      fipeValue: model.fipeValue.toString()
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingModel(null);
    setFormData({ name: '', brandId: '', fipeValue: '' });
    setDialogOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleNavigateBack = () => {
    navigate('/');
  };

  const handleNavigateToBrands = () => {
    navigate('/brands');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleNavigateBack}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Voltar
              </button>
              <Wrench className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">
                Gerenciar Modelos
              </h1>
            </div>
            <Button onClick={openCreateDialog} disabled={brands.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Modelo
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {brands.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhuma marca cadastrada
              </h3>
              <p className="text-muted-foreground mb-4">
                Você precisa cadastrar pelo menos uma marca antes de criar
                modelos
              </p>
              <Button onClick={handleNavigateToBrands}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Marca
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Modelos Cadastrados</CardTitle>
              <CardDescription>
                Gerencie todos os modelos de veículos do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando...</div>
              ) : models.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum modelo cadastrado</p>
                  <Button onClick={openCreateDialog} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar primeiro modelo
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome do Modelo</TableHead>
                      <TableHead>Marca</TableHead>
                      <TableHead>Valor FIPE</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {models.map((model) => (
                      <TableRow key={model.id}>
                        <TableCell className="font-medium">
                          {model.id}
                        </TableCell>
                        <TableCell>{model.name}</TableCell>
                        <TableCell>{model.brand_name}</TableCell>
                        <TableCell>{formatCurrency(model.fipeValue)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(model)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(model.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingModel ? 'Editar Modelo' : 'Novo Modelo'}
              </DialogTitle>
              <DialogDescription>
                {editingModel
                  ? 'Atualize as informações do modelo'
                  : 'Preencha os dados do novo modelo'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome do Modelo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: Civic, Corolla, Focus..."
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="brandId">Marca</Label>
                  <Select
                    value={formData.brandId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, brandId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fipeValue">Valor FIPE (R$)</Label>
                  <Input
                    id="fipeValue"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.fipeValue}
                    onChange={(e) =>
                      setFormData({ ...formData, fipeValue: e.target.value })
                    }
                    placeholder="Ex: 45000.00"
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
                <Button type="submit">
                  {editingModel ? 'Atualizar' : 'Criar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
