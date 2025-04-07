
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
import { AddressType as DbAddressType } from '@/types/database-schema';

interface AddressTypeFieldProps {
  form: UseFormReturn<UnifiedAddressFormData>;
}

export function AddressTypeField({ form }: AddressTypeFieldProps) {
  // Address types from the enum
  const addressTypes: AddressType[] = Object.values(DbAddressType);

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
            defaultValue={DbAddressType.BILLING}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select address type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {addressTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
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
