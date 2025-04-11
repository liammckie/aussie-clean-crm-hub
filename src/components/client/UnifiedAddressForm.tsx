
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { 
  UnifiedAddressFormData,
  unifiedAddressSchema,
  createDefaultAddressValues
} from '@/types/form-types';
import { AddressTypeField } from './form/AddressTypeField';
import { AddressFields } from './form/AddressFields';
import { IsPrimaryField } from '../shared/IsPrimaryField';
import { AddressType } from '@/types/database-schema';

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
  // Always ensure we have properly initialized form data
  const formInitialData = createDefaultAddressValues(initialData);

  const form = useForm<UnifiedAddressFormData>({
    resolver: zodResolver(unifiedAddressSchema),
    defaultValues: formInitialData
  });

  const handleFormSubmit = (data: UnifiedAddressFormData) => {
    // Ensure is_primary is always a boolean
    const submissionData = {
      ...data,
      is_primary: Boolean(data.is_primary) 
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
