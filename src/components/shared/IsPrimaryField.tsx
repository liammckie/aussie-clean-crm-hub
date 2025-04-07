
import React from 'react';
import { UseFormReturn, Path } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

interface IsPrimaryFieldProps<T extends Record<string, any>> {
  form: UseFormReturn<T>;
  name: Path<T>;  // Updated to use Path<T> directly
  label: string;
  description?: string;
}

export function IsPrimaryField<T extends Record<string, any>>({
  form,
  name,
  label,
  description
}: IsPrimaryFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <Switch
              checked={field.value === true}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
