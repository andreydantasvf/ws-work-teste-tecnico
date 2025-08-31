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
import {
  DashboardCardSkeleton,
  DashboardActivitySkeleton,
  DashboardStatsSkeleton,
  HeaderSkeleton
} from '@/components/ui/skeleton';
import { useBrands } from '@/hooks/use-brands';
import { useModels } from '@/hooks/use-models';
import { useCars } from '@/hooks/use-cars';
import { formatCompactCurrency } from '@/lib/utils';
import type { Car as CarType } from '@/types/car';

interface DashboardStats {
  totalBrands: number;
  totalModels: number;
  totalCars: number;
  recentCars: Array<CarType & { model_name?: string; brand_name?: string }>;
  totalFleetValue: number;
  averageCarValue: number;
  mostExpensiveCar: number;
  cheapestCar: number;
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
    recentCars: [],
    totalFleetValue: 0,
    averageCarValue: 0,
    mostExpensiveCar: 0,
    cheapestCar: 0
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

      // Calculate value statistics
      const carValues = cars
        .map((car) => car.value)
        .filter((value) => value > 0);
      const totalFleetValue = carValues.reduce((sum, value) => sum + value, 0);
      const averageCarValue =
        carValues.length > 0 ? totalFleetValue / carValues.length : 0;
      const mostExpensiveCar =
        carValues.length > 0 ? Math.max(...carValues) : 0;
      const cheapestCar = carValues.length > 0 ? Math.min(...carValues) : 0;

      setStats({
        totalBrands: brands.length,
        totalModels: models.length,
        totalCars: cars.length,
        recentCars,
        totalFleetValue,
        averageCarValue,
        mostExpensiveCar,
        cheapestCar
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
      Gasolina:
        'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
      Etanol:
        'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
      Flex: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      Diesel:
        'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
      Elétrico:
        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      Híbrido:
        'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
    };
    return colors[fuel] || 'bg-muted text-muted-foreground border-border';
  };

  const handleNavigate = (page: 'brands' | 'models' | 'cars') => {
    navigate(`/${page}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      {loading ? (
        <HeaderSkeleton />
      ) : (
        <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    WS - AutoManager
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Sistema de Gestão Automotiva
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {loading ? (
          <>
            <div className="mb-8 space-y-2">
              <div className="animate-pulse bg-muted/50 h-10 w-64 max-w-full rounded-lg"></div>
              <div className="animate-pulse bg-muted/30 h-5 w-96 max-w-full rounded-md"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DashboardActivitySkeleton />
              <DashboardStatsSkeleton />
            </div>
          </>
        ) : (
          <>
            <div className="mb-8 animate-fade-in">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-2">
                Dashboard
              </h2>
              <p className="text-lg text-muted-foreground">
                Gerencie marcas, modelos e carros do seu sistema
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
              <Card className="group hover:shadow-medium transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">
                    Marcas
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                    <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {loading ? '...' : stats.totalBrands}
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Total de marcas cadastradas
                  </p>
                  <Button
                    className="w-full bg-blue-500 cursor-pointer hover:bg-blue-600 text-white border-0 shadow-soft"
                    size="sm"
                    onClick={() => handleNavigate('brands')}
                  >
                    Gerenciar Marcas
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-medium transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">
                    Modelos
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                    <Wrench className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {loading ? '...' : stats.totalModels}
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Total de modelos cadastrados
                  </p>
                  <Button
                    className="w-full bg-green-500 cursor-pointer hover:bg-green-600 text-white border-0 shadow-soft"
                    size="sm"
                    onClick={() => handleNavigate('models')}
                  >
                    Gerenciar Modelos
                  </Button>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-medium transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">
                    Carros
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                    <Car className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {loading ? '...' : stats.totalCars}
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Total de carros cadastrados
                  </p>
                  <Button
                    className="w-full bg-purple-500 cursor-pointer hover:bg-purple-600 text-white border-0 shadow-soft"
                    size="sm"
                    onClick={() => handleNavigate('cars')}
                  >
                    Gerenciar Carros
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-soft">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-card-foreground">
                    <div className="p-2 rounded-lg bg-orange-500/10">
                      <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    Atividade Recente
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Últimos carros cadastrados no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.recentCars.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                        <Car className="h-8 w-8 opacity-50" />
                      </div>
                      <p className="font-medium">Nenhuma atividade recente</p>
                      <p className="text-sm mt-1">
                        Comece cadastrando uma marca
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentCars.map((car, index) => (
                        <div
                          key={car.id}
                          className="group p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-200 border border-border/30 hover:border-primary/30"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-foreground text-sm">
                                  {car.brand_name} {car.model_name}
                                </span>
                                <Badge
                                  variant="outline"
                                  className={`${getFuelBadgeColor(car.fuel)} text-xs font-medium border`}
                                >
                                  {car.fuel}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground space-y-1">
                                <div className="flex items-center gap-4">
                                  <span>{car.year}</span>
                                  <span>{car.color}</span>
                                  <span>{car.numberOfPorts} portas</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs opacity-75">
                                    Cadastrado em {formatDate(car.createdAt)}
                                  </span>
                                  <span className="text-sm font-semibold text-primary">
                                    {formatCompactCurrency(car.value)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                              <Car className="h-4 w-4 text-primary" />
                            </div>
                          </div>
                        </div>
                      ))}
                      {stats.recentCars.length > 0 && (
                        <Button
                          variant="outline"
                          className="w-full cursor-pointer mt-4 border-border/50 hover:border-primary/50 bg-transparent hover:bg-primary/5"
                          onClick={() => handleNavigate('cars')}
                        >
                          Ver todos os carros
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-soft">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-card-foreground">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    Estatísticas Rápidas
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Insights sobre seu inventário
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.totalCars === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                        <TrendingUp className="h-8 w-8 opacity-50" />
                      </div>
                      <p className="font-medium">Sem dados para exibir</p>
                      <p className="text-sm mt-1">
                        Cadastre alguns carros para ver estatísticas
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="group p-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-blue-600/5 border border-blue-500/20 hover:from-blue-500/10 hover:to-blue-600/10 transition-all duration-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground">
                            Valor total da frota
                          </span>
                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCompactCurrency(stats.totalFleetValue)}
                          </span>
                        </div>
                      </div>

                      <div className="group p-4 rounded-xl bg-gradient-to-r from-green-500/5 to-green-600/5 border border-green-500/20 hover:from-green-500/10 hover:to-green-600/10 transition-all duration-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground">
                            Valor médio por veículo
                          </span>
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {formatCompactCurrency(stats.averageCarValue)}
                          </span>
                        </div>
                      </div>

                      <div className="group p-4 rounded-xl bg-gradient-to-r from-purple-500/5 to-purple-600/5 border border-purple-500/20 hover:from-purple-500/10 hover:to-purple-600/10 transition-all duration-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground">
                            Veículo mais caro
                          </span>
                          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {formatCompactCurrency(stats.mostExpensiveCar)}
                          </span>
                        </div>
                      </div>

                      <div className="group p-4 rounded-xl bg-gradient-to-r from-orange-500/5 to-orange-600/5 border border-orange-500/20 hover:from-orange-500/10 hover:to-orange-600/10 transition-all duration-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground">
                            Veículo mais barato
                          </span>
                          <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {formatCompactCurrency(stats.cheapestCar)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
