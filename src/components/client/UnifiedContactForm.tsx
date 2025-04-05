
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ContactBaseFields } from './form/ContactBaseFields';
import { ContactTypeField } from './form/ContactTypeField';
import { ContactAdditionalFields } from './form/ContactAdditionalFields';
import { IsPrimaryField } from './form/IsPrimaryField';
import { unifiedContactSchema, UnifiedContactFormData, createDefaultContactValues } from '@/types/form-types';

interface UnifiedContactFormProps {
  onSubmit: (data: UnifiedContactFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<UnifiedContactFormData>;
  contactTypes?: string[];
  buttonText?: string;
  showIsPrimary?: boolean;
}

export function UnifiedContactForm({ 
  onSubmit, 
  isLoading = false, 
  initialData = {}, 
  contactTypes = ['Primary', 'Billing', 'Operations', 'Emergency'],
  buttonText = "Add Contact",
  showIsPrimary = true
}: UnifiedContactFormProps) {
  const form = useForm<UnifiedContactFormData>({
    resolver: zodResolver(unifiedContactSchema),
    defaultValues: createDefaultContactValues(initialData, contactTypes[0])
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ContactBaseFields form={form} />
          <ContactTypeField form={form} contactTypes={contactTypes} />
          <ContactAdditionalFields form={form} />
        </div>
        
        {showIsPrimary && (
          <IsPrimaryField<UnifiedContactFormData> form={form} label="Primary contact" />
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}
