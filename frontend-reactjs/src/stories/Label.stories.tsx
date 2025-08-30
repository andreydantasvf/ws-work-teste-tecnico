import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const meta = {
  title: 'UI/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Um componente de label acessível baseado no Radix UI para associar com inputs.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    htmlFor: {
      control: { type: 'text' },
      description: 'ID do elemento que o label está associado'
    }
  },
  args: {
    children: 'Label text'
  }
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Label padrão'
  }
};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="seu@email.com" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Label associado a um input usando o atributo htmlFor.'
      }
    }
  }
};

export const Required: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="name">
        Nome <span className="text-red-500">*</span>
      </Label>
      <Input id="name" placeholder="Seu nome" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Label indicando campo obrigatório.'
      }
    }
  }
};

export const DisabledInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="disabled">Campo Desabilitado</Label>
      <Input id="disabled" disabled placeholder="Campo desabilitado" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Label com input desabilitado - o label herda o estilo de desabilitado.'
      }
    }
  }
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="firstName">Primeiro Nome</Label>
        <Input id="firstName" placeholder="João" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Sobrenome</Label>
        <Input id="lastName" placeholder="Silva" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="userEmail">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input id="userEmail" type="email" placeholder="joao@exemplo.com" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso em um formulário com múltiplos campos.'
      }
    }
  }
};
