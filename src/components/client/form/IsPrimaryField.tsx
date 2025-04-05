
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

// Updated interface that makes the generic constraint more flexible
interface IsPrimaryFieldProps<T extends { is_primary: boolean | undefined | null }> {
  form: UseFormReturn<T>;
  label?: string;
}

export function IsPrimaryField<T extends { is_primary: boolean | undefined | null }>({ 
  form, 
  label = "Set as primary" 
}: IsPrimaryFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name="is_primary" as const
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
