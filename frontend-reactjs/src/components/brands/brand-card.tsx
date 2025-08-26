import React from 'react';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import type { Brand } from '@/types/brand';

interface BrandCardProps {
  /**
   * Brand data to display
   */
  brand: Brand;
  /**
   * Callback fired when edit button is clicked
   */
  onEdit?: (brand: Brand) => void;
  /**
   * Callback fired when delete button is clicked
   */
  onDelete?: (brandId: number) => void;
  /**
   * Whether the card is in loading state (e.g., during deletion)
   */
  isLoading?: boolean;
}

/**
 * BrandCard component for displaying brand information
 *
 * Features:
 * - Responsive design that works on mobile and desktop
 * - Action buttons for edit and delete operations
 * - Loading state support
 * - Accessible design with proper ARIA labels
 *
 * @example
 * ```tsx
 * <BrandCard
 *   brand={brand}
 *   onEdit={(brand) => setEditingBrand(brand)}
 *   onDelete={(id) => deleteBrand(id)}
 *   isLoading={isDeletingBrand}
 * />
 * ```
 */
export const BrandCard: React.FC<BrandCardProps> = ({
  brand,
  onEdit,
  onDelete,
  isLoading = false
}) => {
  const handleEdit = () => {
    if (onEdit && !isLoading) {
      onEdit(brand);
    }
  };

  const handleDelete = () => {
    if (onDelete && !isLoading) {
      onDelete(brand.id);
    }
  };

  return (
    <Card
      className={`w-full transition-all duration-200 hover:shadow-md ${isLoading ? 'opacity-50' : ''}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-foreground">
          {brand.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {brand.createdAt && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Created: {new Date(brand.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}

        {brand.updatedAt && brand.updatedAt !== brand.createdAt && (
          <div className="text-xs text-muted-foreground pt-2 border-t">
            <p>Updated: {new Date(brand.updatedAt).toLocaleDateString()}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
          aria-label={`Edit ${brand.name}`}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isLoading}
          className="flex-1 sm:flex-none"
          aria-label={`Delete ${brand.name}`}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
