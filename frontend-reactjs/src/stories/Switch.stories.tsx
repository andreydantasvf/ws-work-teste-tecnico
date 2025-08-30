import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Um componente de switch (toggle) reutilizável baseado no Radix UI.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: { type: 'boolean' },
      description: 'Estado do switch (ligado/desligado)',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Se o switch está desabilitado',
    },
    onCheckedChange: {
      action: 'toggled',
      description: 'Callback chamado quando o estado muda',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Switch desabilitado no estado ligado.',
      },
    },
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Modo avião</Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Switch com label associado para melhor acessibilidade.',
      },
    },
  },
};

export const SettingsExample: Story = {
  render: () => (
    <div className="space-y-4 w-full max-w-sm">
      <div className="flex items-center justify-between">
        <Label htmlFor="notifications" className="text-sm font-medium">
          Notificações
        </Label>
        <Switch id="notifications" />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="marketing" className="text-sm font-medium">
          Emails de marketing
        </Label>
        <Switch id="marketing" />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="analytics" className="text-sm font-medium">
          Análises de uso
        </Label>
        <Switch id="analytics" checked />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="beta" className="text-sm font-medium text-muted-foreground">
          Recursos beta (em breve)
        </Label>
        <Switch id="beta" disabled />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso em uma página de configurações.',
      },
    },
  },
};

export const FormSettings: Story = {
  render: () => (
    <div className="space-y-6 w-full max-w-md">
      <div>
        <h3 className="text-lg font-medium">Configurações de Privacidade</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie como seus dados são usados.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="grid gap-1.5">
            <Label htmlFor="public-profile">Perfil público</Label>
            <p className="text-xs text-muted-foreground">
              Permitir que outros vejam seu perfil
            </p>
          </div>
          <Switch id="public-profile" />
        </div>
        
        <div className="flex items-start justify-between">
          <div className="grid gap-1.5">
            <Label htmlFor="search-indexing">Indexação em buscadores</Label>
            <p className="text-xs text-muted-foreground">
              Aparecer nos resultados de busca
            </p>
          </div>
          <Switch id="search-indexing" checked />
        </div>
        
        <div className="flex items-start justify-between">
          <div className="grid gap-1.5">
            <Label htmlFor="data-sharing">Compartilhamento de dados</Label>
            <p className="text-xs text-muted-foreground">
              Ajudar a melhorar nossos serviços
            </p>
          </div>
          <Switch id="data-sharing" />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Exemplo mais completo com descrições e múltiplos switches.',
      },
    },
  },
};
