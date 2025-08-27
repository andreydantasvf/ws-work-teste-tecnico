import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
  Brand,
  CreateBrandPayload,
  UpdateBrandPayload
} from '@/types/brand';

interface BrandFormProps {
  /**
   * Initial values for the form (used in edit mode)
   */
  initialValues?: Brand;
  /**
   * Callback fired when form is submitted
   */
  onSubmit: (data: CreateBrandPayload | UpdateBrandPayload) => void;
  /**
   * Callback fired when form is canceled
   */
  onCancel?: () => void;
  /**
   * Whether the form is in loading state
   */
  isLoading?: boolean;
  /**
   * Form title
   */
  title?: string;
}

/**
 * BrandForm component for creating and editing brands
 *
 * @example
 * ```tsx
 * // Create mode
 * <BrandForm
 *   onSubmit={(data) => createBrand(data)}
 *   title="Create New Brand"
 * />
 *
 * // Edit mode
 * <BrandForm
 *   initialValues={existingBrand}
 *   onSubmit={(data) => updateBrand(existingBrand.id, data)}
 *   title="Edit Brand"
 * />
 * ```
 */
export const BrandForm: React.FC<BrandFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: initialValues?.name || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Brand name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Brand name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Brand name must be no more than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({ name: formData.name.trim() });
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-yellow-800 font-semibold">
            Nome da Marca
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Digite o nome da marca"
            className={`border-2 transition-all duration-200 ${
              errors.name
                ? 'border-red-300 focus:border-red-500'
                : 'border-yellow-200 focus:border-yellow-400'
            } bg-white/50`}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="text-sm text-red-600 font-medium">{errors.name}</p>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            type="submit"
            className="bg-gradient-to-r w-36 cursor-pointer from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : initialValues ? 'Atualizar' : 'Criar'}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="border-gray-300 w-36 cursor-pointer text-gray-600 hover:bg-gray-200"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
