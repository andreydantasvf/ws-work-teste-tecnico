import { Car, Plus } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Cars page component
 * Placeholder for vehicle inventory management
 */
export function CarsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Inventário de Veículos
          </h1>
          <p className="text-muted-foreground">
            Gerencie o inventário completo de veículos
          </p>
        </div>

        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Veículo
        </Button>
      </div>

      {/* Coming Soon Card */}
      <Card className="p-8">
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-yellow-100 rounded-full flex items-center justify-center">
            <Car className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl mb-2">Em Desenvolvimento</CardTitle>
            <p className="text-muted-foreground max-w-md">
              A página de inventário de veículos está sendo desenvolvida. Em
              breve você poderá gerenciar todo o seu inventário de carros.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              CRUD de Veículos
            </span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              Busca Avançada
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Relatórios
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              Valores FIPE
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
