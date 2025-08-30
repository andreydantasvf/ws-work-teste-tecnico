import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Um componente de select reutilizável baseado no Radix UI com múltiplas opções de configuração.'
      }
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecione uma opção" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectContent>
    </Select>
  )
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Selecione uma fruta" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Frutas Cítricas</SelectLabel>
          <SelectItem value="orange">Laranja</SelectItem>
          <SelectItem value="lemon">Limão</SelectItem>
          <SelectItem value="lime">Lima</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Frutas Vermelhas</SelectLabel>
          <SelectItem value="strawberry">Morango</SelectItem>
          <SelectItem value="raspberry">Framboesa</SelectItem>
          <SelectItem value="blackberry">Amora</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Select com grupos de opções e separadores.'
      }
    }
  }
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="fruit-select">Escolha sua fruta favorita</Label>
      <Select>
        <SelectTrigger className="w-[180px]" id="fruit-select">
          <SelectValue placeholder="Selecione..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Maçã</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="orange">Laranja</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Select associado a um label para melhor acessibilidade.'
      }
    }
  }
};

export const SmallSize: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="sm" className="w-[140px]">
        <SelectValue placeholder="Tamanho pequeno" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="xs">Extra Small</SelectItem>
        <SelectItem value="sm">Small</SelectItem>
        <SelectItem value="md">Medium</SelectItem>
        <SelectItem value="lg">Large</SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Select com tamanho pequeno.'
      }
    }
  }
};

export const DisabledOptions: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Com opções desabilitadas" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Opção 1</SelectItem>
        <SelectItem value="option2" disabled>
          Opção 2 (Desabilitada)
        </SelectItem>
        <SelectItem value="option3">Opção 3</SelectItem>
        <SelectItem value="option4" disabled>
          Opção 4 (Desabilitada)
        </SelectItem>
        <SelectItem value="option5">Opção 5</SelectItem>
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Select com algumas opções desabilitadas.'
      }
    }
  }
};

export const LongList: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Lista longa" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 20 }, (_, i) => (
          <SelectItem key={i} value={`item-${i + 1}`}>
            Item {i + 1}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Select com muitas opções que demonstra o scroll automático.'
      }
    }
  }
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="country">País</Label>
        <Select>
          <SelectTrigger id="country">
            <SelectValue placeholder="Selecione o país" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="br">Brasil</SelectItem>
            <SelectItem value="us">Estados Unidos</SelectItem>
            <SelectItem value="ca">Canadá</SelectItem>
            <SelectItem value="uk">Reino Unido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Prioridade</Label>
        <Select>
          <SelectTrigger id="priority">
            <SelectValue placeholder="Selecione a prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Baixa</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="urgent">Urgente</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso em formulário com múltiplos selects.'
      }
    }
  }
};
