import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandForm } from './brand-form';

const meta: Meta<typeof BrandForm> = {
  title: 'Components/Brands/BrandForm',
  component: BrandForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A form component for creating and editing vehicle brands. Supports validation and loading states.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submitted' },
    onCancel: { action: 'cancelled' },
    isLoading: {
      control: 'boolean',
      description: 'Whether the form is in loading state'
    },
    title: {
      control: 'text',
      description: 'Form title'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default create form
 */
export const Create: Story = {
  args: {
    title: 'Create New Brand',
    isLoading: false
  }
};

/**
 * Edit form with initial values
 */
export const Edit: Story = {
  args: {
    title: 'Edit Brand',
    initialValues: {
      id: 1,
      name: 'Toyota',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    isLoading: false
  }
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    title: 'Creating Brand...',
    isLoading: true
  }
};

/**
 * Form with validation errors (simulated)
 */
export const WithValidation: Story = {
  args: {
    title: 'Create New Brand',
    isLoading: false
  },
  parameters: {
    docs: {
      description: {
        story:
          'Try submitting the form without filling required fields to see validation in action.'
      }
    }
  }
};
