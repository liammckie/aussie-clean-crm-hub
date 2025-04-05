
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ContactBaseFields } from './form/ContactBaseFields';
import { ContactTypeField } from './form/ContactTypeField';
import { ContactAdditionalFields } from './form/ContactAdditionalFields';
import { IsPrimaryField } from './form/IsPrimaryField';
import { ManagerFields } from './form/ManagerFields';
import { UnifiedContactFormData, ContactType } from '@/types/form-types';
import { unifiedContactSchema, createDefaultContactValues } from '@/types/form-types';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  const form = useForm<UnifiedContactFormData>({
    resolver: zodResolver(unifiedContactSchema),
    defaultValues: formInitialData
  });

  // State to track the current contact type
  const [currentContactType, setCurrentContactType] = useState<ContactType>(
    formInitialData.contact_type as ContactType
  );

  // Watch for contact type changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'contact_type') {
        setCurrentContactType(value.contact_type as ContactType);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const handleFormSubmit = (data: UnifiedContactFormData) => {
    // Ensure is_primary is always a boolean
    const submissionData = {
      ...data,
      is_primary: Boolean(data.is_primary) // Convert to boolean to ensure it's always a boolean
    };
    onSubmit(submissionData);
  };

  // Check if the current contact type is employee (internal staff)
  const isInternalStaff = currentContactType === 'employee';

  return (
    <ScrollArea className="h-[70vh] pr-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ContactBaseFields form={form} />
            <ContactTypeField form={form} contactTypes={contactTypes} />
            <ContactAdditionalFields form={form} />
            
            {/* Only show manager fields for employee type */}
            {isInternalStaff && (
              <div className="col-span-1 sm:col-span-2">
                <div className="border-t pt-4 mt-2">
                  <h3 className="text-sm font-medium mb-4">Manager Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <ManagerFields form={form} />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {showIsPrimary && (
            <IsPrimaryField 
              form={form} 
              label="Primary contact" 
            />
          )}

          <Button type="submit" disabled={isLoading} className="mt-6">
            {isLoading ? "Saving..." : buttonText}
          </Button>
        </form>
      </Form>
    </ScrollArea>
  );
}
