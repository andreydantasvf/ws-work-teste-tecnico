import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Um componente de botão reutilizável baseado no Radix UI com múltiplas variantes e tamanhos.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link'
      ],
      description: 'A variante visual do botão'
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'O tamanho do botão'
    },
    asChild: {
      control: { type: 'boolean' },
      description: 'Renderiza como um elemento filho usando Radix Slot'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Desabilita o botão'
    }
  },
  args: {
    onClick: fn(),
    children: 'Button'
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button'
  }
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete'
  }
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline'
  }
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary'
  }
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost'
  }
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link'
  }
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small'
  }
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large'
  }
};

export const Icon: Story = {
  args: {
    size: 'icon',
    children: '🚀'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled'
  }
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes do botão disponíveis.'
      }
    }
  }
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">🚀</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos do botão disponíveis.'
      }
    }
  }
};
