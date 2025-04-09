
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
  return (
    <>
      <h3 className="text-lg font-medium mb-3">Basic Information</h3>
      <BasicInfoFields form={form} />
      
      <h3 className="text-lg font-medium mt-6 mb-3">Billing Information</h3>
      <BillingFields form={form} />
      
      <h3 className="text-lg font-medium mt-6 mb-3">Address Information</h3>
      <AddressFields form={form} />
    </>
  );
};
