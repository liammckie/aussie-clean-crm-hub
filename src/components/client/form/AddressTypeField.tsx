
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { AddressType, UnifiedAddressFormData } from '@/types/form-types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface AddressTypeFieldProps {
  form: UseFormReturn<UnifiedAddressFormData>;
}

export function AddressTypeField({ form }: AddressTypeFieldProps) {
  // Address types
  const addressTypes: AddressType[] = [
    'billing',
    'shipping',
    'physical',
    'head_office',
    'branch',
    'site',
    'warehouse',
    'commercial',
    'residential',
    'postal'
  ];

  return (
    <FormField
      control={form.control}
      name="address_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Address Type</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            defaultValue="billing"
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select address type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {addressTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
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
