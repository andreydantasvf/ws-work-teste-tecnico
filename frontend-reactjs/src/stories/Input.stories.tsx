import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from '@/components/ui/input';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Um componente de input reutilizável com variantes e tamanhos.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive'],
      description: 'A variante visual do input'
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg'],
      description: 'O tamanho do input'
    },
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'O tipo do input'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Desabilita o input'
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Texto de placeholder'
    }
  }
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Digite aqui...'
  }
};

export const WithValue: Story = {
  args: {
    value: 'Texto inserido',
    placeholder: 'Digite aqui...'
  }
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    placeholder: 'Campo com erro...'
  }
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'seu@email.com'
  }
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Sua senha...'
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Campo desabilitado'
  }
};

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Input pequeno'
  }
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Input grande'
  }
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm">
      <Input size="sm" placeholder="Small input" />
      <Input size="default" placeholder="Default input" />
      <Input size="lg" placeholder="Large input" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tamanhos do input disponíveis.'
      }
    }
  }
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm">
      <Input variant="default" placeholder="Input padrão" />
      <Input variant="destructive" placeholder="Input com erro" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes do input disponíveis.'
      }
    }
  }
};
