
import React from 'react';
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { UnifiedContactFormData } from '@/types/form-types';

interface IsPrimaryFieldProps {
  form: UseFormReturn<UnifiedContactFormData>;
  label?: string;
  description?: string;
}

export function IsPrimaryField({ 
  form, 
  label = "Mark as primary", 
  description = "Primary contacts are displayed prominently and used as default contacts"
}: IsPrimaryFieldProps) {
  return (
    <FormField
      control={form.control}
      name="is_primary"
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
