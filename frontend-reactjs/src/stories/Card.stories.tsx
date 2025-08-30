import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Um componente de card reutilizável com header, content e footer.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'ghost'],
      description: 'A variante visual do card'
    },
    asChild: {
      control: { type: 'boolean' },
      description: 'Renderiza como um elemento filho usando Radix Slot'
    }
  }
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Este é o conteúdo do card.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  )
};

export const Outline: Story = {
  render: () => (
    <Card variant="outline" className="w-80">
      <CardHeader>
        <CardTitle>Card Outline</CardTitle>
        <CardDescription>Card com borda destacada</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Este card usa a variante outline.</p>
      </CardContent>
    </Card>
  )
};

export const Ghost: Story = {
  render: () => (
    <Card variant="ghost" className="w-80">
      <CardHeader>
        <CardTitle>Card Ghost</CardTitle>
        <CardDescription>Card sem borda e sombra</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Este card usa a variante ghost.</p>
      </CardContent>
    </Card>
  )
};

export const OnlyContent: Story = {
  render: () => (
    <Card className="w-80">
      <CardContent className="pt-6">
        <p>Card simples apenas com conteúdo.</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card simples apenas com conteúdo, sem header nem footer.'
      }
    }
  }
};

export const WithoutFooter: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Sem Footer</CardTitle>
        <CardDescription>Card sem footer</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Este card não possui footer.</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card com header e content, mas sem footer.'
      }
    }
  }
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <Card className="w-60">
        <CardHeader>
          <CardTitle>Default</CardTitle>
          <CardDescription>Variante padrão</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card padrão</p>
        </CardContent>
      </Card>

      <Card variant="outline" className="w-60">
        <CardHeader>
          <CardTitle>Outline</CardTitle>
          <CardDescription>Com borda destacada</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card outline</p>
        </CardContent>
      </Card>

      <Card variant="ghost" className="w-60">
        <CardHeader>
          <CardTitle>Ghost</CardTitle>
          <CardDescription>Sem borda e sombra</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card ghost</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Todas as variantes do card disponíveis.'
      }
    }
  }
};
