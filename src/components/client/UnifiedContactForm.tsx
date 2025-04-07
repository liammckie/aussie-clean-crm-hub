
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ContactBaseFields } from '@/components/client/form/ContactBaseFields';
import { ContactTypeField } from '@/components/client/form/ContactTypeField';
import { ContactAdditionalFields } from '@/components/client/form/ContactAdditionalFields';
import { IsPrimaryField } from '@/components/client/form/IsPrimaryField';
import { ManagerFields } from '@/components/client/form/ManagerFields';
import { UnifiedContactFormData, ContactType } from '@/types/form-types';
import { validateFormData, applyValidationErrorsToForm } from '@/utils/form-validation';

// Define the schema for contact validation
const contactSchema = z.object({
  name: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  position: z.string().optional(),
  company: z.string().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  contact_type: z.string(),
  is_primary: z.boolean().default(false),
  notes: z.string().optional(),
  account_manager: z.string().optional(),
  state_manager: z.string().optional(),
  national_manager: z.string().optional(),
});

interface UnifiedContactFormProps {
  onSubmit: (data: UnifiedContactFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<UnifiedContactFormData>;
  contactTypes: ContactType[];
  showManagerFields?: boolean;
  buttonText?: string;
}

export function UnifiedContactForm({
  onSubmit,
  isLoading = false,
  initialData = {},
  contactTypes,
  showManagerFields = false,
  buttonText = "Save Contact"
}: UnifiedContactFormProps) {
  const form = useForm<UnifiedContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      position: initialData.position || '',
      company: initialData.company || '',
      phone: initialData.phone || '',
      mobile: initialData.mobile || '',
      contact_type: initialData.contact_type || contactTypes[0],
      is_primary: initialData.is_primary || false,
      notes: initialData.notes || '',
      account_manager: initialData.account_manager || '',
      state_manager: initialData.state_manager || '',
      national_manager: initialData.national_manager || '',
    }
  });

  const handleSubmit = (data: UnifiedContactFormData) => {
    const validation = validateFormData<UnifiedContactFormData>(contactSchema, data);
    
    if (!validation.success) {
      if (validation.errors) {
        applyValidationErrorsToForm(form, validation.errors);
        return;
      }
    }
    
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ContactBaseFields form={form} />
          
          <ContactTypeField form={form} contactTypes={contactTypes} />
          
          <ContactAdditionalFields form={form} />
        </div>
        
        <IsPrimaryField form={form} />
        
        {showManagerFields && (
          <ManagerFields form={form} />
        )}

        <Button type="submit" disabled={isLoading} className="mt-4">
          {isLoading ? "Saving..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}
