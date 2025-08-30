import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Um componente de menu dropdown reutilizável baseado no Radix UI.'
      }
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Abrir menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Perfil
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Configurações
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Teclado
          <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Equipe</DropdownMenuItem>
        <DropdownMenuItem>Convidar usuários</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Sair
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};

export const WithGroups: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Menu com grupos</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Aplicação</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Dashboard</DropdownMenuItem>
          <DropdownMenuItem>Relatórios</DropdownMenuItem>
          <DropdownMenuItem>Análises</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Configurações</DropdownMenuItem>
          <DropdownMenuItem>Preferências</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Menu dropdown com grupos de itens organizados.'
      }
    }
  }
};

export const WithCheckboxes: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filtros</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked>
          Mostrar painel lateral
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>
          Mostrar barra de status
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked>
          Mostrar barra de atividades
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem>Modo compacto</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Menu dropdown com itens de checkbox para filtros e opções.'
      }
    }
  }
};

export const WithRadioGroup: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Tema</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Escolher tema</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value="light">
          <DropdownMenuRadioItem value="light">Claro</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Escuro</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">Sistema</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Menu dropdown com grupo de radio buttons para seleção única.'
      }
    }
  }
};

export const WithSubmenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>Menu com submenu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>Início</DropdownMenuItem>
        <DropdownMenuItem>Sobre</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Configurações</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Conta</DropdownMenuItem>
            <DropdownMenuItem>Privacidade</DropdownMenuItem>
            <DropdownMenuItem>Segurança</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Aparência</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Ajuda</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Documentação</DropdownMenuItem>
            <DropdownMenuItem>Tutoriais</DropdownMenuItem>
            <DropdownMenuItem>Suporte</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Menu dropdown com submenus aninhados.'
      }
    }
  }
};

export const UserMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
            JD
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">João Silva</p>
            <p className="text-xs leading-none text-muted-foreground">
              joao@exemplo.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Perfil
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Configurações
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Novo projeto</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Sair
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Menu de usuário típico com avatar e informações do perfil.'
      }
    }
  }
};

export const ActionsMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          ⋯
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Editar</DropdownMenuItem>
        <DropdownMenuItem>Duplicar</DropdownMenuItem>
        <DropdownMenuItem>Compartilhar</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Menu de ações contextual para itens de lista ou tabela.'
      }
    }
  }
};
