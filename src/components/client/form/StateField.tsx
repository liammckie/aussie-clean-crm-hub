
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn, FieldPath } from 'react-hook-form';

// Create a generic type that requires at least the state field
export interface StateFieldFormData {
  state: string;
}

interface StateFieldProps<T extends StateFieldFormData> {
  form: UseFormReturn<T>;
}

export function StateField<T extends StateFieldFormData>({ form }: StateFieldProps<T>) {
  const australianStates = [
    { value: 'NSW', label: 'New South Wales' },
    { value: 'VIC', label: 'Victoria' },
    { value: 'QLD', label: 'Queensland' },
    { value: 'SA', label: 'South Australia' },
    { value: 'WA', label: 'Western Australia' },
    { value: 'TAS', label: 'Tasmania' },
    { value: 'NT', label: 'Northern Territory' },
    { value: 'ACT', label: 'Australian Capital Territory' }
  ];

  return (
    <FormField
      control={form.control}
      name={"state" as FieldPath<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>State</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {australianStates.map((state) => (
                <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
