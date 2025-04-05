
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { UnifiedAddressFormData } from '@/services/unified';
import { StateField } from './StateField';

interface AddressFieldsProps {
  form: UseFormReturn<UnifiedAddressFormData>;
}

export function AddressFields({ form }: AddressFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="address_line_1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <Input placeholder="123 Main St" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address_line_2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address Line 2 (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Apartment, suite, unit, etc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="suburb"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Suburb/City</FormLabel>
            <FormControl>
              <Input placeholder="Melbourne" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <StateField form={form} />

      <FormField
        control={form.control}
        name="postcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Postcode</FormLabel>
            <FormControl>
              <Input placeholder="3000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input placeholder="Australia" defaultValue="Australia" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
