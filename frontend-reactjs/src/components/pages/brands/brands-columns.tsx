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
        <div className="font-semibold text-foreground">
          {row.getValue('name')}
        </div>
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
      header: () => <div className="text-right">Ações</div>,
      cell: ({ row }) => {
        const brand = row.original;

        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(brand)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar marca</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(brand)}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Excluir marca</span>
            </Button>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
      size: 100 // Define um tamanho menor para a coluna de ações
    }
  ];
}
