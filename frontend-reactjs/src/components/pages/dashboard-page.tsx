import { LayoutDashboard, TrendingUp, Users, Car } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Dashboard page component
 * Shows an overview of the vehicle management system
 */
export function DashboardPage() {
  const stats = [
    {
      title: 'Total de Marcas',
      value: '24',
      icon: Users,
      trend: '+12% este mês',
      color: 'text-blue-600'
    },
    {
      title: 'Total de Modelos',
      value: '156',
      icon: LayoutDashboard,
      trend: '+8% este mês',
      color: 'text-yellow-600'
    },
    {
      title: 'Total de Carros',
      value: '1,234',
      icon: Car,
      trend: '+23% este mês',
      color: 'text-green-600'
    },
    {
      title: 'Valor Total',
      value: 'R$ 2.5M',
      icon: TrendingUp,
      trend: '+15% este mês',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de gerenciamento de veículos
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Welcome Message */}
      <Card className="bg-gradient-to-r from-blue-50 to-yellow-50 dark:from-blue-900/20 dark:to-yellow-900/20">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-full flex items-center justify-center">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Bem-vindo ao WS Vehicle Manager!
              </h3>
              <p className="text-muted-foreground">
                Gerencie suas marcas, modelos e inventário de veículos de forma
                eficiente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
