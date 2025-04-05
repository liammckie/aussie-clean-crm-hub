
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
import { UnifiedAddressFormData } from '@/services/unified';

interface AddressTypeFieldProps {
  form: UseFormReturn<UnifiedAddressFormData>;
}

export function AddressTypeField({ form }: AddressTypeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="address_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Address Type</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select address type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="billing">Billing</SelectItem>
              <SelectItem value="postal">Postal</SelectItem>
              <SelectItem value="physical">Physical</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
