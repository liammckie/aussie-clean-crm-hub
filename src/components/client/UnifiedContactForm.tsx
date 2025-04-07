
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ContactType, UnifiedContactFormData, createDefaultContactValues, unifiedContactSchema } from '@/types/form-types';
import { ContactFields } from './form/ContactFields';
import { ContactAdditionalFields } from './form/ContactAdditionalFields';
import { IsPrimaryField } from '@/components/shared/IsPrimaryField';

interface UnifiedContactFormProps {
  initialData?: Partial<UnifiedContactFormData>;
  onSubmit: (data: UnifiedContactFormData) => void;
  isLoading?: boolean;
  contactTypes?: ContactType[];
  buttonText?: string;
}

export function UnifiedContactForm({
  initialData,
  onSubmit,
  isLoading = false,
  contactTypes,
  buttonText = 'Save Contact'
}: UnifiedContactFormProps) {
  const form = useForm<UnifiedContactFormData>({
    resolver: zodResolver(unifiedContactSchema),
    defaultValues: createDefaultContactValues(initialData),
  });

  const handleSubmit = (data: UnifiedContactFormData) => {
    // Ensure boolean type for is_primary
    const formattedData = {
      ...data,
      is_primary: Boolean(data.is_primary)
    };
    
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-4">
          <ContactFields 
            form={form} 
            contactTypes={contactTypes} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ContactAdditionalFields form={form} />
            <IsPrimaryField 
              form={form} 
              name="is_primary" 
              label="Primary Contact" 
              description="Is this the primary contact for the entity?"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="w-full md:w-auto" 
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : buttonText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
