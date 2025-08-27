import React from 'react';
import { Edit, Trash2, Calendar, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
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
  onDelete?: (brand: Brand) => void;
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
      onDelete(brand);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card
        className={`w-full transition-all duration-200 hover:shadow-lg border-2 border-yellow-200 bg-gradient-to-br from-white to-yellow-50 ${
          isLoading ? 'opacity-50' : ''
        }`}
      >
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-yellow-700 to-yellow-800 bg-clip-text text-transparent">
                {brand.name}
              </CardTitle>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleEdit}
              disabled={isLoading}
              className="border-none hover:bg-none hover:text-yellow-500 cursor-pointer text-yellow-700 transition-all duration-200"
              aria-label={`Editar ${brand.name}`}
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
              disabled={isLoading}
              className="border-none hover:bg-none cursor-pointer hover:text-red-400 text-red-600 transition-all duration-200 ml-auto"
              aria-label={`Deletar ${brand.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {brand.createdAt && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-yellow-600" />
              <span>
                Criado em:{' '}
                {new Date(brand.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
