import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTable } from '@/components/ui/data-table';

const meta = {
  title: 'UI/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Componente de tabela de dados avançado com filtragem, ordenação e paginação baseado no TanStack Table.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    columns: {
      description: 'Definições das colunas da tabela'
    },
    data: {
      description: 'Array de dados para exibir na tabela'
    },
    searchKey: {
      control: { type: 'text' },
      description: 'Chave do campo para busca'
    },
    searchPlaceholder: {
      control: { type: 'text' },
      description: 'Placeholder do campo de busca'
    }
  }
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// Dados de exemplo simples
const sampleData = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    role: 'Desenvolvedor'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@exemplo.com',
    role: 'Designer'
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro@exemplo.com',
    role: 'Gerente'
  }
];

// Colunas simples
const simpleColumns = [
  {
    accessorKey: 'name',
    header: 'Nome'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'role',
    header: 'Cargo'
  }
];

export const Default: Story = {
  args: {
    columns: simpleColumns,
    data: sampleData,
    searchKey: 'name',
    searchPlaceholder: 'Filtrar por nome...'
  }
};

export const EmptyState: Story = {
  args: {
    columns: simpleColumns,
    data: [],
    searchKey: 'name',
    searchPlaceholder: 'Filtrar por nome...'
  },
  parameters: {
    docs: {
      description: {
        story: 'Estado vazio da tabela quando não há dados.'
      }
    }
  }
};

export const WithManyRows: Story = {
  args: {
    columns: simpleColumns,
    data: Array.from({ length: 50 }, (_, i) => ({
      id: String(i + 1),
      name: `Usuário ${i + 1}`,
      email: `usuario${i + 1}@exemplo.com`,
      role: ['Desenvolvedor', 'Designer', 'Gerente', 'Analista'][i % 4]
    })),
    searchKey: 'name',
    searchPlaceholder: 'Filtrar por nome...'
  },
  parameters: {
    docs: {
      description: {
        story: 'Tabela com muitos dados demonstrando paginação automática.'
      }
    }
  }
};

export const WithoutSearch: Story = {
  args: {
    columns: simpleColumns,
    data: sampleData
  },
  parameters: {
    docs: {
      description: {
        story: 'Tabela sem campo de busca.'
      }
    }
  }
};
