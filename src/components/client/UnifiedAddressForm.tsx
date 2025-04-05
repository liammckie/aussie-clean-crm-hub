
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { AddressType } from '@/services/unified';
import { AddressTypeField } from './form/AddressTypeField';
import { AddressFields } from './form/AddressFields';
import { IsPrimaryField } from './form/IsPrimaryField';

// Address schema for validation
const addressSchema = z.object({
  address_line_1: z.string().min(1, { message: 'Street address is required' }),
  address_line_2: z.string().optional(),
  suburb: z.string().min(1, { message: 'Suburb is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  postcode: z.string().min(4, { message: 'Postcode must be at least 4 characters' }),
  country: z.string().default('Australia'),
  address_type: z.enum(['billing', 'postal', 'physical']),
  is_primary: z.boolean().default(false),
});

export type UnifiedAddressFormData = z.infer<typeof addressSchema>;

interface UnifiedAddressFormProps {
  onSubmit: (data: UnifiedAddressFormData) => void;
  initialData?: Partial<UnifiedAddressFormData>;
  isLoading?: boolean;
  buttonText?: string;
  showAddressType?: boolean;
  showIsPrimary?: boolean;
}

export function UnifiedAddressForm({
  onSubmit,
  initialData = {},
  isLoading = false,
  buttonText = "Save Address",
  showAddressType = true,
  showIsPrimary = true,
}: UnifiedAddressFormProps) {
  const form = useForm<UnifiedAddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address_line_1: initialData.address_line_1 || '',
      address_line_2: initialData.address_line_2 || '',
      suburb: initialData.suburb || '',
      state: initialData.state || '',
      postcode: initialData.postcode || '',
      country: initialData.country || 'Australia',
      address_type: (initialData.address_type as AddressType) || 'billing',
      is_primary: initialData.is_primary || false,
    }
  });

  const handleFormSubmit = (data: UnifiedAddressFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        {showAddressType && <AddressTypeField form={form} />}
        
        <AddressFields form={form} />

        {showIsPrimary && <IsPrimaryField<UnifiedAddressFormData> form={form} label="Set as primary address" />}

        <Button type="submit" disabled={isLoading} className="mt-4">
          {isLoading ? "Saving..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}
