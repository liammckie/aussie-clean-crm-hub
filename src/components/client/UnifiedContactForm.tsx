
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ContactBaseFields } from './form/ContactBaseFields';
import { ContactTypeField } from './form/ContactTypeField';
import { ContactAdditionalFields } from './form/ContactAdditionalFields';
import { IsPrimaryField } from './form/IsPrimaryField';

const contactSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  position: z.string().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  company: z.string().optional(),
  contact_type: z.string().min(1, { message: "Contact type is required" }),
  is_primary: z.boolean().default(false),
});

export type UnifiedContactFormData = z.infer<typeof contactSchema>;

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
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      position: initialData.position || '',
      phone: initialData.phone || '',
      mobile: initialData.mobile || '',
      company: initialData.company || '',
      contact_type: initialData.contact_type || contactTypes[0],
      is_primary: initialData.is_primary || false,
    }
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
