import React from 'react';
import { Plus, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { BrandForm } from './brand-form';
import type {
  Brand,
  CreateBrandPayload,
  UpdateBrandPayload
} from '@/types/brand';

interface BrandModalProps {
  /**
   * Whether the modal is open
   */
  isOpen: boolean;
  /**
   * Callback fired when modal should be closed
   */
  onClose: () => void;
  /**
   * Brand to edit (if provided, modal will be in edit mode)
   */
  brand?: Brand;
  /**
   * Callback fired when form is submitted
   */
  onSubmit: (data: CreateBrandPayload | UpdateBrandPayload) => void;
  /**
   * Whether the form is in loading state
   */
  isLoading?: boolean;
}

/**
 * BrandModal component for creating and editing brands in a modal dialog
 *
 * Features:
 * - Responsive modal that works on mobile and desktop
 * - Automatically adjusts title based on create/edit mode
 * - Handles form submission and modal closing
 * - Loading state support
 *
 * @example
 * ```tsx
 * // Create mode
 * <BrandModal
 *   isOpen={isCreateModalOpen}
 *   onClose={() => setIsCreateModalOpen(false)}
 *   onSubmit={(data) => createBrand(data)}
 *   isLoading={isCreating}
 * />
 *
 * // Edit mode
 * <BrandModal
 *   isOpen={isEditModalOpen}
 *   onClose={() => setIsEditModalOpen(false)}
 *   brand={selectedBrand}
 *   onSubmit={(data) => updateBrand(selectedBrand.id, data)}
 *   isLoading={isUpdating}
 * />
 * ```
 */
export const BrandModal: React.FC<BrandModalProps> = ({
  isOpen,
  onClose,
  brand,
  onSubmit,
  isLoading = false
}) => {
  const isEditMode = !!brand;
  const title = isEditMode ? `Editar ${brand.name}` : 'Nova Marca';
  const Icon = isEditMode ? Edit : Plus;

  const handleSubmit = (data: CreateBrandPayload | UpdateBrandPayload) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-2 border-yellow-200 bg-gradient-to-br from-white to-yellow-50">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.3, type: 'spring' }}
              className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md"
            >
              <Icon className="h-5 w-5 text-white" />
            </motion.div>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-yellow-700 to-yellow-800 bg-clip-text text-transparent">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <BrandForm
            initialValues={brand}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            title="" // We're using the dialog title instead
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
