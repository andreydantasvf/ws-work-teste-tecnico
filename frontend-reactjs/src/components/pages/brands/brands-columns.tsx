'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import type { Brand } from '@/types/brand';

interface BrandsColumnsProps {
  onEdit: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
}

export function createBrandsColumns({
  onEdit,
  onDelete
}: BrandsColumnsProps): ColumnDef<Brand>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome da Marca" />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue('name')}</div>
      ),
      enableSorting: true,
      enableHiding: false
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data de Criação" />
      ),
      cell: ({ row }) => {
        const date = row.getValue('createdAt') as string;
        return (
          <div className="text-muted-foreground">
            {date ? new Date(date).toLocaleDateString('pt-BR') : 'N/A'}
          </div>
        );
      },
      enableSorting: true
    },
    {
      id: 'actions',
      header: 'Ações',
      size: 80,
      cell: ({ row }) => {
        const brand = row.original;

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(brand)}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar marca</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(brand)}
              className="h-8 w-8 p-0 hover:bg-muted hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Excluir marca</span>
            </Button>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false
    }
  ];
}
