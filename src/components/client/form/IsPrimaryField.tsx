
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

// Update the interface to make constraint more flexible with optional is_primary
interface IsPrimaryFieldProps<T extends { is_primary?: boolean | null | undefined }> {
  form: UseFormReturn<T>;
  label?: string;
}

export function IsPrimaryField<T extends { is_primary?: boolean | null | undefined }>({ 
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
              checked={field.value || false} 
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
