import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal';
import { fn } from 'storybook/test';

const meta = {
  title: 'UI/ConfirmDeleteModal',
  component: ConfirmDeleteModal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Um modal de confirmação para ações de exclusão com animações e estilo visual diferenciado.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: { type: 'boolean' },
      description: 'Controla se o modal está aberto ou fechado'
    },
    title: {
      control: { type: 'text' },
      description: 'Título do modal de confirmação'
    },
    description: {
      control: { type: 'text' },
      description: 'Descrição/mensagem de confirmação'
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Estado de carregamento do botão de confirmação'
    }
  },
  args: {
    onClose: fn(),
    onConfirm: fn(),
    isOpen: true,
    title: 'Excluir item',
    description:
      'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
    isLoading: false
  }
} satisfies Meta<typeof ConfirmDeleteModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Excluir item',
    description:
      'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.'
  }
};

export const LoadingState: Story = {
  args: {
    title: 'Excluir arquivo',
    description:
      'Esta operação irá excluir permanentemente o arquivo do servidor.',
    isLoading: true
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal de confirmação no estado de carregamento.'
      }
    }
  }
};

export const DeleteUser: Story = {
  args: {
    title: 'Excluir usuário',
    description:
      'Tem certeza que deseja excluir este usuário? Todos os dados associados serão perdidos permanentemente.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso para exclusão de usuário.'
      }
    }
  }
};

export const DeleteProject: Story = {
  args: {
    title: 'Excluir projeto',
    description:
      "Esta ação irá excluir o projeto 'Sistema de Vendas' e todos os seus arquivos. Esta operação não pode ser desfeita."
  },
  parameters: {
    docs: {
      description: {
        story:
          'Exemplo de uso para exclusão de projeto com descrição mais específica.'
      }
    }
  }
};

export const DeleteMultipleItems: Story = {
  args: {
    title: 'Excluir 5 itens selecionados',
    description:
      'Tem certeza que deseja excluir os 5 itens selecionados? Esta ação não pode ser desfeita e todos os dados serão perdidos permanentemente.'
  },
  parameters: {
    docs: {
      description: {
        story: 'Exemplo de uso para exclusão de múltiplos itens.'
      }
    }
  }
};
