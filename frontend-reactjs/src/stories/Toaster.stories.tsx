import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const meta = {
  title: 'UI/Toaster',
  component: Toaster,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Componente de notificações toast baseado no Sonner para feedback ao usuário.'
      }
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div>
      <Toaster />
      <div className="space-y-2">
        <Button onClick={() => toast('Mensagem simples')}>Toast Simples</Button>
      </div>
    </div>
  )
};

export const Success: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button onClick={() => toast.success('Operação realizada com sucesso!')}>
        Toast de Sucesso
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Toast de sucesso para confirmar operações.'
      }
    }
  }
};

export const Error: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        variant="destructive"
        onClick={() =>
          toast.error('Ocorreu um erro ao processar sua solicitação')
        }
      >
        Toast de Erro
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Toast de erro para indicar problemas.'
      }
    }
  }
};

export const Warning: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        variant="outline"
        onClick={() => toast.warning('Esta ação requer confirmação')}
      >
        Toast de Aviso
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Toast de aviso para alertas importantes.'
      }
    }
  }
};

export const Info: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        variant="secondary"
        onClick={() => toast.info('Nova atualização disponível')}
      >
        Toast Informativo
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Toast informativo para comunicar informações úteis.'
      }
    }
  }
};

export const WithAction: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        onClick={() =>
          toast('Item adicionado ao carrinho', {
            action: {
              label: 'Desfazer',
              onClick: () => toast('Ação desfeita')
            }
          })
        }
      >
        Toast com Ação
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Toast com botão de ação para operações reversíveis.'
      }
    }
  }
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        onClick={() =>
          toast('Evento criado', {
            description: 'Seu evento foi agendado para amanhã às 15:00'
          })
        }
      >
        Toast com Descrição
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Toast com descrição adicional para mais contexto.'
      }
    }
  }
};

export const CustomDuration: Story = {
  render: () => (
    <div>
      <Toaster />
      <Button
        onClick={() =>
          toast('Esta mensagem fica por 10 segundos', {
            duration: 10000
          })
        }
      >
        Toast Duração Personalizada
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Toast com duração personalizada.'
      }
    }
  }
};

export const AllTypes: Story = {
  render: () => (
    <div>
      <Toaster />
      <div className="space-y-2">
        <Button onClick={() => toast('Mensagem padrão')}>Padrão</Button>
        <Button onClick={() => toast.success('Sucesso!')}>Sucesso</Button>
        <Button onClick={() => toast.error('Erro!')}>Erro</Button>
        <Button onClick={() => toast.warning('Aviso!')}>Aviso</Button>
        <Button onClick={() => toast.info('Informação!')}>Info</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Todos os tipos de toast disponíveis.'
      }
    }
  }
};
