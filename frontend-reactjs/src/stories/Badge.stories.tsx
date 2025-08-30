import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@/components/ui/badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Um componente de badge reutilizável para destacar informações importantes.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'A variante visual do badge'
    },
    asChild: {
      control: { type: 'boolean' },
      description: 'Renderiza como um elemento filho usando Radix Slot'
    }
  },
  args: {
    children: 'Badge'
  }
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Default'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary'
  }
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive'
  }
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline'
  }
};

export const WithIcon: Story = {
  render: () => (
    <Badge>
      <span>🚀</span>
      With Icon
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Badge com ícone.'
      }
    }
  }
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes do badge disponíveis.'
      }
    }
  }
};

export const StatusExamples: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Ativo</Badge>
      <Badge variant="secondary">Pendente</Badge>
      <Badge variant="destructive">Inativo</Badge>
      <Badge variant="outline">Rascunho</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exemplos de uso do badge para indicar status.'
      }
    }
  }
};
