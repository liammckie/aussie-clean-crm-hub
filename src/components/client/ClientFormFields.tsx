
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormData } from '@/services/client';
import { BasicInfoFields } from './form/BasicInfoFields';
import { BillingFields } from './form/BillingFields';
import { AddressFields } from './form/AddressFields';

interface ClientFormFieldsProps {
  form: UseFormReturn<ClientFormData>;
}

export const ClientFormFields: React.FC<ClientFormFieldsProps> = ({ form }) => {
  // Create a specialized form adapter that properly handles the field types
  // This is necessary during the transition period from multiple address tables to unified addresses
  const addressFieldsFormAdapter = {
    ...form,
    // These methods are safely typed to work with both form types
    register: (name: any, options: any) => form.register(name, options),
    setValue: (name: any, value: any, options: any) => form.setValue(name as any, value, options),
    control: form.control,
    formState: form.formState,
    // Explicitly define getValues to match the expected type
    getValues: () => {
      const values = form.getValues();
      return {
        address_line_1: values.address_line_1 || '',
        address_line_2: values.address_line_2,
        suburb: values.suburb || '',
        state: values.state || '',
        postcode: values.postcode || '',
        country: values.country || 'Australia'
      };
    },
    // Explicitly define watch to match the expected type
    watch: (name?: any) => {
      const watched = name ? form.watch(name) : form.watch();
      if (!name) {
        return {
          address_line_1: (watched as any).address_line_1 || '',
          address_line_2: (watched as any).address_line_2,
          suburb: (watched as any).suburb || '',
          state: (watched as any).state || '',
          postcode: (watched as any).postcode || '',
          country: (watched as any).country || 'Australia'
        };
      }
      return watched;
    }
  };

  return (
    <>
      <h3 className="text-lg font-medium mb-3">Basic Information</h3>
      <BasicInfoFields form={form} />
      
      <h3 className="text-lg font-medium mt-6 mb-3">Billing Information</h3>
      <BillingFields form={form} />
      
      <h3 className="text-lg font-medium mt-6 mb-3">Address Information</h3>
      <AddressFields form={addressFieldsFormAdapter as any} />
    </>
  );
};
