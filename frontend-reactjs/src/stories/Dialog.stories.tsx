import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Um componente de modal/dialog acessível baseado no Radix UI.'
      }
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Abrir Dialog</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Faça alterações em seu perfil aqui. Clique em salvar quando
            terminar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
};

export const SimpleDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Mostrar informações</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sobre este projeto</DialogTitle>
          <DialogDescription>
            Este é um exemplo de dialog simples com informações.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Este dialog contém apenas informações básicas e não possui campos de
          entrada.
        </p>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dialog simples apenas com informações, sem formulário.'
      }
    }
  }
};

export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Excluir item</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tem certeza absoluta?</DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente o
            item e removerá os dados de nossos servidores.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button variant="destructive">Confirmar exclusão</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dialog de confirmação para ações destrutivas.'
      }
    }
  }
};

export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Adicionar novo usuário</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Adicionar usuário</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo usuário abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              Nome
            </Label>
            <Input id="firstName" placeholder="João" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Sobrenome
            </Label>
            <Input id="lastName" placeholder="Silva" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="joao@exemplo.com"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Cargo
            </Label>
            <Input
              id="role"
              placeholder="Desenvolvedor"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button type="submit">Adicionar usuário</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dialog com formulário para adicionar novo usuário.'
      }
    }
  }
};

export const WithoutFooter: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Visualizar detalhes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes do produto</DialogTitle>
          <DialogDescription>
            Informações completas sobre o produto selecionado.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Nome</h4>
            <p className="text-sm text-muted-foreground">MacBook Pro 16"</p>
          </div>
          <div>
            <h4 className="font-medium">Preço</h4>
            <p className="text-sm text-muted-foreground">R$ 15.999,00</p>
          </div>
          <div>
            <h4 className="font-medium">Descrição</h4>
            <p className="text-sm text-muted-foreground">
              Notebook profissional com chip M2 Pro e tela Retina de 16
              polegadas.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dialog sem footer, apenas para visualização de informações.'
      }
    }
  }
};
