
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

// Updated contact type labels to support all ContactType values
const contactTypeLabels: Record<string, string> = {
  'Primary': 'Primary Contact',
  'Billing': 'Billing Contact',
  'Operations': 'Operations Contact',
  'Emergency': 'Emergency Contact',
  'Technical': 'Technical Contact',
  'Support': 'Support Contact',
  'Sales': 'Sales Contact',
  'Management': 'Management Contact',
  'client_primary': 'Client Primary Contact',
  'client_site': 'Client Site Contact',
  'supplier': 'Supplier Contact',
  'employee': 'Internal Staff Member',
  'hr_payroll': 'HR/Payroll Contact',
  'emergency': 'Emergency Contact',
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
          <Select 
            onValueChange={(value) => {
              console.log("Selected contact type:", value);
              field.onChange(value);
            }} 
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a contact type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {contactTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {contactTypeLabels[type] || type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
