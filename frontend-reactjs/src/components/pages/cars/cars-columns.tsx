'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import type { Car } from '@/types/car';

// Extended interface to include model and brand names
export interface CarWithDetails extends Car {
  model_name?: string;
  brand_name?: string;
}

// Define the columns for the cars data table
export const createCarsColumns = (
  onEdit: (car: Car) => void,
  onDelete: (car: Car) => void
): ColumnDef<CarWithDetails>[] => [
  {
    accessorKey: 'brand_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Marca" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue('brand_name') || 'N/A'}</div>
      );
    }
  },
  {
    accessorKey: 'model_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Modelo" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">
          {row.getValue('model_name') || 'N/A'}
        </div>
      );
    }
  },
  {
    accessorKey: 'year',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ano" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('year')}</div>;
    }
  },
  {
    accessorKey: 'fuel',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Combustível" />
    ),
    cell: ({ row }) => {
      const fuel = row.getValue('fuel') as string;
      const fuelVariants: Record<string, string> = {
        gasoline: 'default',
        ethanol: 'secondary',
        flex: 'outline',
        diesel: 'destructive'
      };

      const fuelLabels: Record<string, string> = {
        gasoline: 'Gasolina',
        ethanol: 'Etanol',
        flex: 'Flex',
        diesel: 'Diesel'
      };

      return (
        <Badge
          variant={
            (fuelVariants[fuel] as
              | 'default'
              | 'secondary'
              | 'outline'
              | 'destructive') || 'default'
          }
        >
          {fuelLabels[fuel] || fuel}
        </Badge>
      );
    }
  },
  {
    accessorKey: 'color',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cor" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">{row.getValue('color')}</div>
      );
    }
  },
  {
    accessorKey: 'numberOfPorts',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Portas" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('numberOfPorts')}</div>;
    },
    size: 80
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data de Criação" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string;
      if (!date) return <div className="text-muted-foreground">N/A</div>;

      const formatted = new Date(date).toLocaleDateString('pt-BR');
      return <div className="text-muted-foreground">{formatted}</div>;
    }
  },
  {
    id: 'actions',
    header: 'Ações',
    size: 80,
    cell: ({ row }) => {
      const car = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(car)}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Editar carro</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(car)}
            className="h-8 w-8 p-0 hover:bg-muted hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir carro</span>
          </Button>
        </div>
      );
    }
  }
];
