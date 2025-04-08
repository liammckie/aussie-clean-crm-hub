
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { ContactType, UnifiedContactFormData } from '@/types/form-types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface ContactTypeFieldProps {
  form: UseFormReturn<UnifiedContactFormData>;
  availableTypes?: ContactType[];
}

export function ContactTypeField({ form, availableTypes }: ContactTypeFieldProps) {
  // Default contact types to use if not provided
  const defaultTypes: ContactType[] = [
    'Primary',
    'Billing',
    'Operations',
    'Technical',
    'Emergency'
  ];

  const types = availableTypes || defaultTypes;

  return (
    <FormField
      control={form.control}
      name="contact_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Contact Type</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value || 'Primary'}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select contact type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
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
