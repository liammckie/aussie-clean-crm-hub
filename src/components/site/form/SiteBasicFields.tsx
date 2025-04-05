
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { SiteFormData } from '../SiteFormTypes';

interface SiteBasicFieldsProps {
  form: UseFormReturn<SiteFormData>;
}

export function SiteBasicFields({ form }: SiteBasicFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="site_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Site Name</FormLabel>
            <FormControl>
              <Input placeholder="Site Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="site_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Site Code</FormLabel>
            <FormControl>
              <Input placeholder="Site Code" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="square_meters"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Area (m²)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Area in square meters"
                {...field}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
