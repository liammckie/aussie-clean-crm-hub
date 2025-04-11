
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { UnifiedAddressFormData } from '@/types/form-types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { AddressType } from '@/types/database-schema';

interface AddressTypeFieldProps {
  form: UseFormReturn<UnifiedAddressFormData>;
}

export function AddressTypeField({ form }: AddressTypeFieldProps) {
  // Address types from the enum - use the database schema enum to ensure consistency
  const addressTypes: AddressType[] = Object.values(AddressType);

  const formatAddressType = (type: string): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
            defaultValue={field.value || AddressType.BILLING}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select address type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {addressTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {formatAddressType(type)}
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
