
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
import { Path } from 'react-hook-form';

// Interface for components that include is_primary field
interface IsPrimaryFieldProps<T> {
  form: UseFormReturn<T>;
  label?: string;
}

// Type guard to ensure form.control can handle the field
export function IsPrimaryField<T extends Record<string, any>>({ 
  form, 
  label = "Set as primary" 
}: IsPrimaryFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      // Cast to Path<T> to ensure TypeScript understands this is a valid field path
      name={"is_primary" as Path<T>}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
          <FormControl>
            <Checkbox 
              checked={Boolean(field.value)} 
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
