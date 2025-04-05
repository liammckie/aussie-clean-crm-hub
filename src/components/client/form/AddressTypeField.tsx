
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

// Updated to match all AddressType values defined in form-types.ts
const addressTypeLabels: Record<AddressType, string> = {
  'billing': 'Billing Address',
  'shipping': 'Shipping Address',
  'physical': 'Physical Address',
  'postal': 'Postal Address',
  'head_office': 'Head Office Address',
  'branch': 'Branch Address',
  'residential': 'Employee Residential',
  'commercial': 'Commercial Address',
  'warehouse': 'Warehouse/Depot Address',
  'site': 'Site Address'
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
