
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
import { UnifiedAddressFormData, AddressType } from '@/types/form-types';

interface AddressTypeFieldProps {
  form: UseFormReturn<UnifiedAddressFormData>;
}

const addressTypeLabels: Record<AddressType, string> = {
  'head_office': 'Head Office Address',
  'billing': 'Billing Address',
  'site': 'Site Address',
  'residential': 'Employee Residential',
  'postal': 'Postal Address',
  'warehouse': 'Warehouse/Depot Address'
};

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
              {Object.entries(addressTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
