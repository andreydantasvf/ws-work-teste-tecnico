import { useState, useEffect, useCallback } from 'react';
import { Car, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { createCarsColumns, type CarWithDetails } from './cars-columns';
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
import { useCars } from '@/hooks/use-cars';
import { carService } from '@/services/car.service';
import type { Car as CarType } from '@/types/car';
import type { Model } from '@/types/model';

interface ModelWithBrand extends Model {
  brand_name?: string;
}

const FUEL_TYPES = [
  { value: 'Gasolina', label: 'Gasolina' },
  { value: 'Etanol', label: 'Etanol' },
  { value: 'Flex', label: 'Flex' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'GNV', label: 'GNV' },
  { value: 'Elétrico', label: 'Elétrico' },
  { value: 'Híbrido', label: 'Híbrido' }
];

const DOOR_OPTIONS = [
  { value: '2', label: '2 portas' },
  { value: '3', label: '3 portas' },
  { value: '4', label: '4 portas' }
];

/**
 * Cars page component
 * Manages all cars in the system
 */
export function CarsPage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarWithDetails[]>([]);
  const [models, setModels] = useState<ModelWithBrand[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarType | null>(null);
  const [carToDelete, setCarToDelete] = useState<CarType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    modelId: '',
    year: '',
    fuel: '',
    numberOfPorts: '',
    color: '',
    value: ''
  });

  // Fetch data using React Query hooks
  const { data: brands = [], isLoading: brandsLoading } = useBrands();
  const { data: modelsData = [], isLoading: modelsLoading } = useModels();
  const {
    data: carsData = [],
    isLoading: carsLoading,
    refetch: refetchCars
  } = useCars();

  const loading = brandsLoading || modelsLoading || carsLoading;

  const loadCarsWithDetails = useCallback(() => {
    // Enrich models with brand names
    const modelsWithBrands = modelsData.map((model) => {
      const brand = brands.find((b) => b.id === model.brandId);
      return {
        ...model,
        brand_name: brand?.name || 'Marca não encontrada'
      };
    });

    // Enrich cars with model and brand names
    const carsWithDetails = carsData.map((car) => {
      const model = modelsData.find((m) => m.id === car.modelId);
      const brand = model ? brands.find((b) => b.id === model.brandId) : null;
      return {
        ...car,
        model_name: model?.name || 'Modelo não encontrado',
        brand_name: brand?.name || 'Marca não encontrada'
      };
    });

    setCars(carsWithDetails);
    setModels(modelsWithBrands);
  }, [brands, modelsData, carsData]);

  useEffect(() => {
    if (!loading) {
      loadCarsWithDetails();
    }
  }, [loadCarsWithDetails, loading]);

  // Show skeleton while loading
  if (loading) {
    return <PageSkeleton />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const carData = {
        modelId: Number.parseInt(formData.modelId),
        year: Number.parseInt(formData.year),
        fuel: formData.fuel,
        numberOfPorts: Number.parseInt(formData.numberOfPorts),
        color: formData.color,
        value: Number.parseFloat(formData.value)
      };

      if (editingCar) {
        await carService.updateCar(editingCar.id, carData);
        toast.success('Carro atualizado com sucesso');
      } else {
        await carService.createCar(carData);
        toast.success('Carro criado com sucesso');
      }

      setDialogOpen(false);
      setEditingCar(null);
      setFormData({
        modelId: '',
        year: '',
        fuel: '',
        numberOfPorts: '',
        color: '',
        value: ''
      });
      refetchCars();
    } catch {
      toast.error('Falha ao salvar carro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!carToDelete) return;

    setIsDeleting(true);
    try {
      await carService.deleteCar(carToDelete.id);
      toast.success('Carro excluído com sucesso');
      refetchCars();
      setDeleteModalOpen(false);
      setCarToDelete(null);
    } catch {
      toast.error('Falha ao excluir carro');
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditDialog = (car: CarType) => {
    setEditingCar(car);
    setFormData({
      modelId: car.modelId.toString(),
      year: car.year.toString(),
      fuel: car.fuel,
      numberOfPorts: car.numberOfPorts.toString(),
      color: car.color,
      value: car.value.toString()
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingCar(null);
    setFormData({
      modelId: '',
      year: '',
      fuel: '',
      numberOfPorts: '',
      color: '',
      value: ''
    });
    setDialogOpen(true);
  };

  const openDeleteModal = (car: CarType) => {
    setCarToDelete(car);
    setDeleteModalOpen(true);
  };

  // Create columns with the handlers
  const columns = createCarsColumns(openEditDialog, openDeleteModal);

  const handleNavigateBack = () => {
    navigate('/');
  };

  const handleNavigateToModels = () => {
    navigate('/models');
  };

  const currentYear = new Date().getFullYear();

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
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <Car className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                    Gerenciar Carros
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Cadastre e gerencie os carros do sistema
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={openCreateDialog}
              disabled={models.length === 0}
              className="bg-purple-500 hover:bg-purple-600 text-white border-0 shadow-soft disabled:opacity-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Carro
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {models.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-soft animate-fade-in">
            <CardContent className="text-center py-12">
              <div className="p-4 rounded-full bg-purple-500/10 w-fit mx-auto mb-6">
                <Car className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Nenhum modelo cadastrado
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Você precisa cadastrar pelo menos um modelo antes de criar
                carros. Os modelos são necessários para definir as
                especificações dos veículos.
              </p>
              <Button
                onClick={handleNavigateToModels}
                className="bg-purple-500 hover:bg-purple-600 text-white border-0 shadow-soft"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Modelo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-soft animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle className="text-card-foreground">
                Carros Cadastrados
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Lista de todos os carros disponíveis no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cars.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-6">
                    <Car className="h-12 w-12 opacity-50" />
                  </div>
                  <p className="font-medium mb-2">Nenhum carro cadastrado</p>
                  <p className="text-sm mb-6">
                    Comece cadastrando seu primeiro carro
                  </p>
                  <Button
                    onClick={openCreateDialog}
                    className="bg-purple-500 hover:bg-purple-600 text-white border-0 shadow-soft"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar primeiro carro
                  </Button>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={cars}
                  searchKey="model_name"
                  searchPlaceholder="Buscar carros por modelo..."
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md border-border/50 bg-card/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-card-foreground">
                {editingCar ? 'Editar Carro' : 'Novo Carro'}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {editingCar
                  ? 'Atualize as informações do carro'
                  : 'Preencha os dados do novo carro'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 py-4">
                <div className="grid gap-3">
                  <Label
                    htmlFor="modelId"
                    className="text-sm font-medium text-foreground"
                  >
                    Modelo
                  </Label>
                  <Select
                    value={formData.modelId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, modelId: value })
                    }
                    required
                  >
                    <SelectTrigger className="border-border/50 focus:border-primary bg-background/50">
                      <SelectValue placeholder="Selecione um modelo" />
                    </SelectTrigger>
                    <SelectContent className="border-border/50 bg-card/95 backdrop-blur-xl">
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id.toString()}>
                          {model.brand_name} - {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label
                      htmlFor="year"
                      className="text-sm font-medium text-foreground"
                    >
                      Ano
                    </Label>
                    <Input
                      id="year"
                      type="number"
                      min="1900"
                      max={currentYear + 1}
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
                      }
                      placeholder="2024"
                      className="border-border/50 focus:border-primary bg-background/50"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label
                      htmlFor="numberOfPorts"
                      className="text-sm font-medium text-foreground"
                    >
                      Portas
                    </Label>
                    <Select
                      value={formData.numberOfPorts}
                      onValueChange={(value) =>
                        setFormData({ ...formData, numberOfPorts: value })
                      }
                      required
                    >
                      <SelectTrigger className="border-border/50 focus:border-primary bg-background/50">
                        <SelectValue placeholder="Portas" />
                      </SelectTrigger>
                      <SelectContent className="border-border/50 bg-card/95 backdrop-blur-xl">
                        {DOOR_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label
                    htmlFor="fuel"
                    className="text-sm font-medium text-foreground"
                  >
                    Combustível
                  </Label>
                  <Select
                    value={formData.fuel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, fuel: value })
                    }
                    required
                  >
                    <SelectTrigger className="border-border/50 focus:border-primary bg-background/50">
                      <SelectValue placeholder="Selecione o combustível" />
                    </SelectTrigger>
                    <SelectContent className="border-border/50 bg-card/95 backdrop-blur-xl">
                      {FUEL_TYPES.map((fuel) => (
                        <SelectItem key={fuel.value} value={fuel.value}>
                          {fuel.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label
                    htmlFor="color"
                    className="text-sm font-medium text-foreground"
                  >
                    Cor
                  </Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    placeholder="Ex: Branco, Preto, Prata..."
                    className="border-border/50 focus:border-primary bg-background/50"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label
                    htmlFor="value"
                    className="text-sm font-medium text-foreground"
                  >
                    Valor (R$)
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    placeholder="Ex: 45000.50"
                    className="border-border/50 focus:border-primary bg-background/50"
                    required
                  />
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
                  className="bg-purple-500 hover:bg-purple-600 text-white border-0 shadow-soft"
                >
                  {isSubmitting
                    ? 'Salvando...'
                    : editingCar
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
          title="Excluir Carro"
          description={`Tem certeza que deseja excluir este carro? Esta ação não pode ser desfeita.`}
          isLoading={isDeleting}
        />
      </main>
    </div>
  );
}
