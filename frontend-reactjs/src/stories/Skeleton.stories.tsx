import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Skeleton,
  CardSkeleton,
  DashboardCardSkeleton,
  DashboardActivitySkeleton,
  DashboardStatsSkeleton,
  HeaderSkeleton
} from '@/components/ui/skeleton';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Componentes de skeleton para indicar carregamento de conteúdo.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Classes CSS adicionais para personalizar o skeleton'
    }
  }
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Skeleton className="h-4 w-48" />
};

export const CircularSkeleton: Story = {
  render: () => <Skeleton className="h-12 w-12 rounded-full" />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton circular, útil para avatares.'
      }
    }
  }
};

export const TextLines: Story = {
  render: () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Múltiplas linhas de texto com larguras variadas.'
      }
    }
  }
};

export const UserProfile: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-4 w-[80px]" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Skeleton para perfil de usuário com avatar e informações.'
      }
    }
  }
};

export const CardExample: Story = {
  render: () => (
    <div className="w-80">
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Skeleton completo para um card com avatar e conteúdo.'
      }
    }
  }
};

export const DifferentSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium">Altura pequena</p>
        <Skeleton className="h-2 w-32" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Altura média</p>
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Altura grande</p>
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Quadrado</p>
        <Skeleton className="h-16 w-16" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes tamanhos de skeleton.'
      }
    }
  }
};

export const FullCard: Story = {
  render: () => <CardSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton completo para um card com múltiplos elementos.'
      }
    }
  }
};

export const DashboardCard: Story = {
  render: () => <DashboardCardSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton específico para cards de dashboard.'
      }
    }
  }
};

export const DashboardActivity: Story = {
  render: () => <DashboardActivitySkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton para seção de atividades do dashboard.'
      }
    }
  }
};

export const DashboardStats: Story = {
  render: () => <DashboardStatsSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Skeleton para estatísticas do dashboard.'
      }
    }
  }
};

export const Header: Story = {
  render: () => <HeaderSkeleton />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Skeleton para o cabeçalho da aplicação.'
      }
    }
  }
};

export const LoadingStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Lista de itens</h3>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Tabela</h3>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Diferentes estados de carregamento para listas e tabelas.'
      }
    }
  }
};
