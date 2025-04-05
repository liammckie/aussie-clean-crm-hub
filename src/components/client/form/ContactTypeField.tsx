
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { UnifiedContactFormData, ContactType } from '@/types/form-types';

interface ContactTypeFieldProps {
  form: UseFormReturn<UnifiedContactFormData>;
  contactTypes: ContactType[];
}

// Updated to match all ContactType values defined in form-types.ts
const contactTypeLabels: Record<ContactType, string> = {
  'client_primary': 'Client Primary Contact',
  'client_site': 'Client Site Contact',
  'supplier': 'Supplier Contact',
  'employee': 'Internal Staff Member',
  'emergency': 'Emergency Contact',
  'hr_payroll': 'HR/Payroll Contact',
  'sales_lead': 'Sales Contact (Lead)',
  'subcontractor': 'Subcontractor Contact'
};

export function ContactTypeField({ form, contactTypes }: ContactTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="contact_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Contact Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a contact type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {contactTypes.map((type) => (
                <SelectItem key={type} value={type}>{contactTypeLabels[type] || type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
