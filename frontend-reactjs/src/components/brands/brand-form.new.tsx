import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  isLoading = false,
  title = initialValues ? 'Edit Brand' : 'Create Brand'
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Brand Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter brand name"
              variant={errors.name ? 'destructive' : 'default'}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Saving...' : initialValues ? 'Update' : 'Create'}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
