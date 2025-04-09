
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormData } from '@/services/client';
import { BasicInfoFields } from './form/BasicInfoFields';
import { BillingFields } from './form/BillingFields';
import { AddressFields, AddressFieldsFormData } from './form/AddressFields';

interface ClientFormFieldsProps {
  form: UseFormReturn<ClientFormData>;
}

// Create an adapter to handle the ClientFormData to AddressFieldsFormData conversion
// This is necessary during the transition period from multiple address tables to using unified addresses
export const ClientFormFields: React.FC<ClientFormFieldsProps> = ({ form }) => {
  // We create a compatible form that handles the field differences during the transition period
  const addressFieldsFormAdapter: UseFormReturn<AddressFieldsFormData> = {
    ...form,
    // Override specific methods to ensure they work with both types
    register: (name, options) => form.register(name, options),
    setValue: (name, value, options) => form.setValue(name as any, value, options),
    getValues: () => {
      const values = form.getValues();
      // Ensure all required fields are present in the returned object
      return {
        address_line_1: values.address_line_1 || '',
        address_line_2: values.address_line_2,
        suburb: values.suburb || '',
        state: values.state || '',
        postcode: values.postcode || '',
        country: values.country || 'Australia'
      } as AddressFieldsFormData;
    },
    watch: () => {
      const watched = form.watch();
      // Ensure all required fields are present in the watched object
      return {
        address_line_1: watched.address_line_1 || '',
        address_line_2: watched.address_line_2,
        suburb: watched.suburb || '',
        state: watched.state || '',
        postcode: watched.postcode || '',
        country: watched.country || 'Australia'
      } as AddressFieldsFormData;
    }
  };

  return (
    <>
      <h3 className="text-lg font-medium mb-3">Basic Information</h3>
      <BasicInfoFields form={form} />
      
      <h3 className="text-lg font-medium mt-6 mb-3">Billing Information</h3>
      <BillingFields form={form} />
      
      <h3 className="text-lg font-medium mt-6 mb-3">Address Information</h3>
      <AddressFields form={addressFieldsFormAdapter} />
    </>
  );
};
