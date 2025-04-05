
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';

interface IsPrimaryFieldProps<T extends { is_primary: boolean }> {
  form: UseFormReturn<T>;
  label?: string;
}

export function IsPrimaryField<T extends { is_primary: boolean }>({ 
  form, 
  label = "Set as primary" 
}: IsPrimaryFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name="is_primary" as="is_primary"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
          <FormControl>
            <Checkbox 
              checked={field.value} 
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormLabel className="font-normal cursor-pointer">
            {label}
          </FormLabel>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
