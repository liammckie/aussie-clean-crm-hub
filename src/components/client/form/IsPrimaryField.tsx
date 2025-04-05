
import React from 'react';
import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';

interface IsPrimaryFieldProps<T> {
  form: UseFormReturn<T>;
  label?: string;
  description?: string;
  name?: string;
}

export function IsPrimaryField<T>({ 
  form, 
  label = "Primary", 
  description,
  name = "is_primary" 
}: IsPrimaryFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name as any}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
          <FormControl>
            <Checkbox 
              checked={field.value as boolean} 
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormItem className="font-normal cursor-pointer">{label}</FormItem>
            {description && (
              <FormDescription>
                {description}
              </FormDescription>
            )}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
