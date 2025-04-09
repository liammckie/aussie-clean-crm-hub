
import React from 'react';
import { UseFormReturn, FieldPath } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { StateField } from './StateField';

// Create a generic type that defines the minimal fields needed for this component
export interface AddressFieldsFormData {
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

interface AddressFieldsProps<T extends AddressFieldsFormData> {
  form: UseFormReturn<T>;
}

export function AddressFields<T extends AddressFieldsFormData>({ form }: AddressFieldsProps<T>) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={"address_line_1" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <Input placeholder="Street address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name={"address_line_2" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2</FormLabel>
              <FormControl>
                <Input placeholder="Suite, unit, building, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={"suburb" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suburb</FormLabel>
              <FormControl>
                <Input placeholder="Suburb" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <StateField form={form} />

        <FormField
          control={form.control}
          name={"postcode" as FieldPath<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postcode</FormLabel>
              <FormControl>
                <Input placeholder="Postcode" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name={"country" as FieldPath<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input placeholder="Country" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
