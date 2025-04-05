
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { UnifiedAddressFormData } from '@/types/form-types';
import { AddressTypeField } from './form/AddressTypeField';
import { AddressFields } from './form/AddressFields';
import { IsPrimaryField } from './form/IsPrimaryField';
import { unifiedAddressSchema, createDefaultAddressValues } from '@/types/form-types';

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
  // Ensure is_primary is always set, defaulting to false if not provided
  const formInitialData = createDefaultAddressValues({
    ...initialData,
    is_primary: initialData.is_primary ?? false
  });

  const form = useForm<UnifiedAddressFormData>({
    resolver: zodResolver(unifiedAddressSchema),
    defaultValues: formInitialData
  });

  const handleFormSubmit = (data: UnifiedAddressFormData) => {
    // Ensure is_primary is always a boolean
    const submissionData = {
      ...data,
      is_primary: data.is_primary ?? false
    };
    onSubmit(submissionData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        {showAddressType && <AddressTypeField form={form} />}
        
        <AddressFields form={form} />

        {showIsPrimary && (
          <IsPrimaryField<UnifiedAddressFormData> 
            form={form} 
            label="Set as primary address" 
          />
        )}

        <Button type="submit" disabled={isLoading} className="mt-4">
          {isLoading ? "Saving..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}
