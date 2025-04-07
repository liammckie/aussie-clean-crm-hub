
import React from 'react';
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn, Path } from 'react-hook-form';

// Create a union type that contains both form data types
type FormDataWithIsPrimary = {
  is_primary?: boolean;
}

interface IsPrimaryFieldProps<T extends FormDataWithIsPrimary> {
  form: UseFormReturn<T>;
  label?: string;
  description?: string;
}

export function IsPrimaryField<T extends FormDataWithIsPrimary>({ 
  form, 
  label = "Mark as primary", 
  description = "Primary items are displayed prominently and used as defaults"
}: IsPrimaryFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={"is_primary" as Path<T>}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value === true}
              onCheckedChange={(checked) => {
                field.onChange(checked === true);
              }}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
}
