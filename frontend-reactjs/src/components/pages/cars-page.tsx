import { useState, useEffect, useCallback } from 'react';
import { Car, Plus, Edit, Trash2 } from 'lucide-react';
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
import { useCars } from '@/hooks/use-cars';
import { carService } from '@/services/car.service';
import type { Car as CarType } from '@/types/car';
import type { Model } from '@/types/model';

interface CarWithDetails extends CarType {
  model_name?: string;
  brand_name?: string;
}

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
  { value: '4', label: '4 portas' },
  { value: '5', label: '5 portas' }
];

/**
 * Cars page component
 * Manages all cars in the system
 */
export function CarsPage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<CarWithDetails[]>([]);
  const [models, setModels] = useState<ModelWithBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarType | null>(null);
  const [formData, setFormData] = useState({
    modelId: '',
    year: '',
    fuel: '',
    numberOfPorts: '',
    color: ''
  });

  // Fetch data using React Query hooks
  const { data: brands = [], isLoading: brandsLoading } = useBrands();
  const { data: modelsData = [], isLoading: modelsLoading } = useModels();
  const {
    data: carsData = [],
    isLoading: carsLoading,
    refetch: refetchCars
  } = useCars();

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
    if (!brandsLoading && !modelsLoading && !carsLoading) {
      loadCarsWithDetails();
      setLoading(false);
    }
  }, [loadCarsWithDetails, brandsLoading, modelsLoading, carsLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const carData = {
        modelId: Number.parseInt(formData.modelId),
        year: Number.parseInt(formData.year),
        fuel: formData.fuel,
        numberOfPorts: Number.parseInt(formData.numberOfPorts),
        color: formData.color
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
        color: ''
      });
      refetchCars();
    } catch {
      toast.error('Falha ao salvar carro');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este carro?')) return;

    try {
      await carService.deleteCar(id);
      toast.success('Carro excluído com sucesso');
      refetchCars();
    } catch {
      toast.error('Falha ao excluir carro');
    }
  };

  const openEditDialog = (car: CarType) => {
    setEditingCar(car);
    setFormData({
      modelId: car.modelId.toString(),
      year: car.year.toString(),
      fuel: car.fuel,
      numberOfPorts: car.numberOfPorts.toString(),
      color: car.color
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
      color: ''
    });
    setDialogOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não disponível';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handleNavigateBack = () => {
    navigate('/');
  };

  const handleNavigateToModels = () => {
    navigate('/models');
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <Car className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">
                Gerenciar Carros
              </h1>
            </div>
            <Button onClick={openCreateDialog} disabled={models.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Carro
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {models.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Car className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum modelo cadastrado
              </h3>
              <p className="text-muted-foreground mb-4">
                Você precisa cadastrar pelo menos um modelo antes de criar
                carros
              </p>
              <Button onClick={handleNavigateToModels}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Modelo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Carros Cadastrados</CardTitle>
              <CardDescription>
                Gerencie todos os carros do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Carregando...</div>
              ) : cars.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum carro cadastrado</p>
                  <Button onClick={openCreateDialog} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar primeiro carro
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Modelo</TableHead>
                        <TableHead>Ano</TableHead>
                        <TableHead>Combustível</TableHead>
                        <TableHead>Portas</TableHead>
                        <TableHead>Cor</TableHead>
                        <TableHead>Cadastro</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cars.map((car) => (
                        <TableRow key={car.id}>
                          <TableCell className="font-medium">
                            {car.id}
                          </TableCell>
                          <TableCell>{car.brand_name}</TableCell>
                          <TableCell>{car.model_name}</TableCell>
                          <TableCell>{car.year}</TableCell>
                          <TableCell className="capitalize">
                            {car.fuel}
                          </TableCell>
                          <TableCell>{car.numberOfPorts}</TableCell>
                          <TableCell className="capitalize">
                            {car.color}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(car.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditDialog(car)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(car.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCar ? 'Editar Carro' : 'Novo Carro'}
              </DialogTitle>
              <DialogDescription>
                {editingCar
                  ? 'Atualize as informações do carro'
                  : 'Preencha os dados do novo carro'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="modelId">Modelo</Label>
                  <Select
                    value={formData.modelId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, modelId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id.toString()}>
                          {model.brand_name} - {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="year">Ano</Label>
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
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="numberOfPorts">Portas</Label>
                    <Select
                      value={formData.numberOfPorts}
                      onValueChange={(value) =>
                        setFormData({ ...formData, numberOfPorts: value })
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Portas" />
                      </SelectTrigger>
                      <SelectContent>
                        {DOOR_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="fuel">Combustível</Label>
                  <Select
                    value={formData.fuel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, fuel: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o combustível" />
                    </SelectTrigger>
                    <SelectContent>
                      {FUEL_TYPES.map((fuel) => (
                        <SelectItem key={fuel.value} value={fuel.value}>
                          {fuel.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Cor</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    placeholder="Ex: Branco, Preto, Prata..."
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
                  {editingCar ? 'Atualizar' : 'Criar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
