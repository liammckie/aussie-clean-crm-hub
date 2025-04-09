
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { 
  UnifiedAddressFormData
} from '@/types/form-types';
import { AddressTypeField } from './form/AddressTypeField';
import { AddressFields } from './form/AddressFields';
import { IsPrimaryField } from '../shared/IsPrimaryField';
import { AddressType } from '@/types/database-schema';
import { z } from 'zod';

// Define schema here since it's missing from form-types
const unifiedAddressSchema = z.object({
  address_line_1: z.string().min(1, { message: "Address line 1 is required" }),
  address_line_2: z.string().optional(),
  suburb: z.string().min(1, { message: "Suburb is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postcode: z.string().min(1, { message: "Postcode is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  address_type: z.string().min(1, { message: "Address type is required" }),
  is_primary: z.boolean().default(false)
});

// Create a function to generate default values
const createDefaultAddressValues = (initialData?: Partial<UnifiedAddressFormData>): UnifiedAddressFormData => {
  return {
    address_line_1: initialData?.address_line_1 || '',
    address_line_2: initialData?.address_line_2 || '',
    suburb: initialData?.suburb || '',
    state: initialData?.state || '',
    postcode: initialData?.postcode || '',
    country: initialData?.country || 'Australia',
    address_type: initialData?.address_type || AddressType.BILLING,
    is_primary: initialData?.is_primary || false,
    // Include any other fields from UnifiedAddressFormData
    ...(initialData || {})
  };
};

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
  // Always ensure is_primary is defined as a boolean
  const formInitialData = createDefaultAddressValues({
    ...initialData,
    // Ensure address_type is set to a valid enum value
    address_type: initialData.address_type || AddressType.BILLING,
    // Ensure is_primary is always defined as a boolean
    is_primary: initialData.is_primary === undefined ? false : Boolean(initialData.is_primary)
  });

  const form = useForm<UnifiedAddressFormData>({
    resolver: zodResolver(unifiedAddressSchema),
    defaultValues: formInitialData
  });

  const handleFormSubmit = (data: UnifiedAddressFormData) => {
    // Ensure is_primary is always a boolean
    const submissionData = {
      ...data,
      is_primary: Boolean(data.is_primary) // Convert to boolean to ensure it's always a boolean
    };
    onSubmit(submissionData);
  };

  // Create an adapter to make AddressFields work with UnifiedAddressFormData
  const addressFieldsAdapter = {
    ...form,
    // Any necessary adapter methods can go here if needed
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        {showAddressType && <AddressTypeField form={form} />}
        
        {/* Now this is compatible since our AddressFields component is generic */}
        <AddressFields form={addressFieldsAdapter} />

        {showIsPrimary && (
          <IsPrimaryField<UnifiedAddressFormData>
            form={form} 
            label="Set as primary address"
            name="is_primary"
          />
        )}

        <Button type="submit" disabled={isLoading} className="mt-4">
          {isLoading ? "Saving..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}
