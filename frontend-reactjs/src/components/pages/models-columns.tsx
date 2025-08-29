'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { Model } from '@/types/model';

// Extended interface to include brand name
export interface ModelWithBrand extends Model {
  brand_name?: string;
}

// Define the columns for the models data table
export const createModelsColumns = (
  onEdit: (model: Model) => void,
  onDelete: (model: Model) => void
): ColumnDef<ModelWithBrand>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome do Modelo" />
    ),
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('name')}</div>;
    }
  },
  {
    accessorKey: 'brand_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Marca" />
    ),
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground">
          {row.getValue('brand_name') || 'N/A'}
        </div>
      );
    }
  },
  {
    accessorKey: 'fipeValue',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor FIPE" />
    ),
    cell: ({ row }) => {
      const value = row.getValue('fipeValue') as number;
      const formatted = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);

      return <div className="font-medium">{formatted}</div>;
    }
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
      const model = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(model)}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Editar modelo</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(model)}
            className="h-8 w-8 p-0 hover:bg-muted hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Excluir modelo</span>
          </Button>
        </div>
      );
    }
  }
];
