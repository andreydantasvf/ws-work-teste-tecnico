import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Componentes de tabela reutilizáveis para exibir dados tabulares.'
      }
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'Paid',
    totalAmount: '$250.00',
    paymentMethod: 'Credit Card'
  },
  {
    invoice: 'INV002',
    paymentStatus: 'Pending',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal'
  },
  {
    invoice: 'INV003',
    paymentStatus: 'Unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'Bank Transfer'
  },
  {
    invoice: 'INV004',
    paymentStatus: 'Paid',
    totalAmount: '$450.00',
    paymentMethod: 'Credit Card'
  },
  {
    invoice: 'INV005',
    paymentStatus: 'Paid',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal'
  }
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableCaption>Lista de faturas recentes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Fatura</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
};

export const WithBadges: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fatura</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Método</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>
              <Badge
                variant={
                  invoice.paymentStatus === 'Paid'
                    ? 'default'
                    : invoice.paymentStatus === 'Pending'
                      ? 'secondary'
                      : 'destructive'
                }
              >
                {invoice.paymentStatus}
              </Badge>
            </TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tabela com badges para indicar status.'
      }
    }
  }
};

export const WithActions: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fatura</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Valor</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>
              <Badge
                variant={
                  invoice.paymentStatus === 'Paid'
                    ? 'default'
                    : invoice.paymentStatus === 'Pending'
                      ? 'secondary'
                      : 'destructive'
                }
              >
                {invoice.paymentStatus}
              </Badge>
            </TableCell>
            <TableCell>{invoice.totalAmount}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="sm">
                  Editar
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  Excluir
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tabela com botões de ação em cada linha.'
      }
    }
  }
};

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead>Quantidade</TableHead>
          <TableHead className="text-right">Preço</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Produto A</TableCell>
          <TableCell>2</TableCell>
          <TableCell className="text-right">R$ 100,00</TableCell>
          <TableCell className="text-right">R$ 200,00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Produto B</TableCell>
          <TableCell>1</TableCell>
          <TableCell className="text-right">R$ 150,00</TableCell>
          <TableCell className="text-right">R$ 150,00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Produto C</TableCell>
          <TableCell>3</TableCell>
          <TableCell className="text-right">R$ 75,00</TableCell>
          <TableCell className="text-right">R$ 225,00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right font-semibold">R$ 575,00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tabela com footer mostrando totais.'
      }
    }
  }
};

export const SimpleTable: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Cargo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>João Silva</TableCell>
          <TableCell>joao@exemplo.com</TableCell>
          <TableCell>Desenvolvedor</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Maria Santos</TableCell>
          <TableCell>maria@exemplo.com</TableCell>
          <TableCell>Designer</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Pedro Costa</TableCell>
          <TableCell>pedro@exemplo.com</TableCell>
          <TableCell>Gerente</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tabela simples sem caption, footer ou elementos extras.'
      }
    }
  }
};

export const EmptyState: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3} className="h-24 text-center">
            Nenhum resultado encontrado.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Estado vazio da tabela quando não há dados para exibir.'
      }
    }
  }
};
