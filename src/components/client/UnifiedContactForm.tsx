
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ContactBaseFields } from './form/ContactBaseFields';
import { ContactTypeField } from './form/ContactTypeField';
import { ContactAdditionalFields } from './form/ContactAdditionalFields';
import { IsPrimaryField } from './form/IsPrimaryField';
import { UnifiedContactFormData, ContactType } from '@/types/form-types';
import { unifiedContactSchema, createDefaultContactValues } from '@/types/form-types';

interface UnifiedContactFormProps {
  onSubmit: (data: UnifiedContactFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<UnifiedContactFormData>;
  contactTypes?: ContactType[];
  buttonText?: string;
  showIsPrimary?: boolean;
}

export function UnifiedContactForm({ 
  onSubmit, 
  isLoading = false, 
  initialData = {}, 
  contactTypes = ['client_primary', 'client_site', 'supplier', 'employee'],
  buttonText = "Add Contact",
  showIsPrimary = true
}: UnifiedContactFormProps) {
  // Always ensure is_primary is defined as a boolean
  const formInitialData = createDefaultContactValues(
    { 
      ...initialData,
      // Ensure is_primary is always defined as a boolean
      is_primary: initialData.is_primary === undefined ? false : Boolean(initialData.is_primary) 
    }, 
    contactTypes[0]
  );

  const form = useForm<UnifiedAddressFormData>({
    resolver: zodResolver(unifiedContactSchema) as any,
    defaultValues: formInitialData as any
  });

  const handleFormSubmit = (data: UnifiedContactFormData) => {
    // Ensure is_primary is always a boolean
    const submissionData = {
      ...data,
      is_primary: Boolean(data.is_primary) // Convert to boolean to ensure it's always a boolean
    };
    onSubmit(submissionData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit as any)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ContactBaseFields form={form as any} />
          <ContactTypeField form={form as any} contactTypes={contactTypes} />
          <ContactAdditionalFields form={form as any} />
        </div>
        
        {showIsPrimary && (
          <IsPrimaryField<UnifiedContactFormData> 
            form={form as any} 
            label="Primary contact" 
          />
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}
