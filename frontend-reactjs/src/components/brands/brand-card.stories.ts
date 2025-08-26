import type { Meta, StoryObj } from '@storybook/react-vite';
import { BrandCard } from './brand-card';

const meta: Meta<typeof BrandCard> = {
  title: 'Components/Brands/BrandCard',
  component: BrandCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A card component for displaying brand information with action buttons.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onEdit: { action: 'edit clicked' },
    onDelete: { action: 'delete clicked' },
    isLoading: {
      control: 'boolean',
      description: 'Whether the card is in loading state'
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockBrand = {
  id: 1,
  name: 'Toyota',
  createdAt: '2024-01-01T10:00:00Z',
  updatedAt: '2024-01-15T14:30:00Z'
};

/**
 * Default brand card
 */
export const Default: Story = {
  args: {
    brand: mockBrand,
    isLoading: false
  }
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    brand: mockBrand,
    isLoading: true
  }
};

/**
 * Recently created brand (same created/updated dates)
 */
export const RecentlyCreated: Story = {
  args: {
    brand: {
      ...mockBrand,
      name: 'BMW',
      updatedAt: mockBrand.createdAt // Same as created date
    },
    isLoading: false
  }
};

/**
 * Brand with long name
 */
export const LongName: Story = {
  args: {
    brand: {
      ...mockBrand,
      name: 'Automobili Lamborghini S.p.A.'
    },
    isLoading: false
  }
};

/**
 * Brand without creation date
 */
export const WithoutDates: Story = {
  args: {
    brand: {
      id: 2,
      name: 'Mercedes-Benz'
    },
    isLoading: false
  }
};
