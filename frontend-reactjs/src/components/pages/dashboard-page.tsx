import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Building2, Wrench, TrendingUp, Calendar } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBrands } from '@/hooks/use-brands';
import { useModels } from '@/hooks/use-models';
import { useCars } from '@/hooks/use-cars';
import type { Car as CarType } from '@/types/car';

interface DashboardStats {
  totalBrands: number;
  totalModels: number;
  totalCars: number;
  recentCars: Array<CarType & { model_name?: string; brand_name?: string }>;
}

/**
 * Dashboard page component
 * Shows an overview of the vehicle management system with real data
 */
export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalBrands: 0,
    totalModels: 0,
    totalCars: 0,
    recentCars: []
  });

  // Fetch data using React Query hooks
  const { data: brands = [], isLoading: brandsLoading } = useBrands();
  const { data: models = [], isLoading: modelsLoading } = useModels();
  const { data: cars = [], isLoading: carsLoading } = useCars();

  const loading = brandsLoading || modelsLoading || carsLoading;

  const loadDashboardData = useCallback(() => {
    try {
      // Get recent cars (last 5) with model and brand names
      const recentCars = cars
        .sort(
          (a, b) =>
            new Date(b.createdAt || '').getTime() -
            new Date(a.createdAt || '').getTime()
        )
        .slice(0, 5)
        .map((car) => {
          const model = models.find((m) => m.id === car.modelId);
          const brand = model
            ? brands.find((b) => b.id === model.brandId)
            : null;
          return {
            ...car,
            model_name: model?.name || 'Modelo não encontrado',
            brand_name: brand?.name || 'Marca não encontrada'
          };
        });

      setStats({
        totalBrands: brands.length,
        totalModels: models.length,
        totalCars: cars.length,
        recentCars
      });
    } catch {
      // Error handling
    }
  }, [brands, models, cars]);

  useEffect(() => {
    if (!loading) {
      loadDashboardData();
    }
  }, [loadDashboardData, loading]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFuelBadgeColor = (fuel: string) => {
    const colors: Record<string, string> = {
      Gasolina: 'bg-red-100 text-red-800',
      Etanol: 'bg-green-100 text-green-800',
      Flex: 'bg-blue-100 text-blue-800',
      Diesel: 'bg-yellow-100 text-yellow-800',
      Elétrico: 'bg-emerald-100 text-emerald-800',
      Híbrido: 'bg-purple-100 text-purple-800'
    };
    return colors[fuel] || 'bg-gray-100 text-gray-800';
  };

  const handleNavigate = (page: 'brands' | 'models' | 'cars') => {
    navigate(`/${page}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">
                AutoManager
              </h1>
            </div>
            <div className="text-sm text-muted-foreground">
              Sistema de Gestão Automotiva
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Gerencie marcas, modelos e carros do seu sistema
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Marcas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {loading ? '...' : stats.totalBrands}
              </div>
              <p className="text-xs text-muted-foreground">
                Total de marcas cadastradas
              </p>
              <Button
                className="w-full mt-4"
                size="sm"
                onClick={() => handleNavigate('brands')}
              >
                Gerenciar Marcas
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Modelos</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {loading ? '...' : stats.totalModels}
              </div>
              <p className="text-xs text-muted-foreground">
                Total de modelos cadastrados
              </p>
              <Button
                className="w-full mt-4"
                size="sm"
                onClick={() => handleNavigate('models')}
              >
                Gerenciar Modelos
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carros</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {loading ? '...' : stats.totalCars}
              </div>
              <p className="text-xs text-muted-foreground">
                Total de carros cadastrados
              </p>
              <Button
                className="w-full mt-4"
                size="sm"
                onClick={() => handleNavigate('cars')}
              >
                Gerenciar Carros
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Atividade Recente
              </CardTitle>
              <CardDescription>
                Últimos carros cadastrados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Carregando...
                </div>
              ) : stats.recentCars.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma atividade recente</p>
                  <p className="text-sm">Comece cadastrando uma marca</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentCars.map((car) => (
                    <div
                      key={car.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {car.brand_name} {car.model_name}
                          </span>
                          <Badge
                            variant="outline"
                            className={getFuelBadgeColor(car.fuel)}
                          >
                            {car.fuel}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {car.year} • {car.color} • {car.numberOfPorts} portas
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Cadastrado em {formatDate(car.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                  {stats.recentCars.length > 0 && (
                    <Button
                      variant="outline"
                      className="w-full mt-4 bg-transparent"
                      onClick={() => handleNavigate('cars')}
                    >
                      Ver todos os carros
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Estatísticas Rápidas
              </CardTitle>
              <CardDescription>Insights sobre seu inventário</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Carregando...
                </div>
              ) : stats.totalCars === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sem dados para exibir</p>
                  <p className="text-sm">
                    Cadastre alguns carros para ver estatísticas
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">
                      Média de modelos por marca
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {stats.totalBrands > 0
                        ? Math.round(
                            (stats.totalModels / stats.totalBrands) * 10
                          ) / 10
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">
                      Média de carros por modelo
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {stats.totalModels > 0
                        ? Math.round(
                            (stats.totalCars / stats.totalModels) * 10
                          ) / 10
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm font-medium">
                      Total de registros
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {stats.totalBrands + stats.totalModels + stats.totalCars}
                    </span>
                  </div>
                  {stats.recentCars.length > 0 && (
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                      <span className="text-sm font-medium">
                        Último cadastro
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {formatDate(stats.recentCars[0].createdAt)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
