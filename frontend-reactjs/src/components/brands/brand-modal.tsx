import React from 'react';
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
  const title = isEditMode ? `Edit ${brand.name}` : 'Create New Brand';

  const handleSubmit = (data: CreateBrandPayload | UpdateBrandPayload) => {
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
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
