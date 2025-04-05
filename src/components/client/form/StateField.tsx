
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
import { UseFormReturn } from 'react-hook-form';
import { UnifiedAddressFormData } from '@/services/unified';

interface StateFieldProps {
  form: UseFormReturn<UnifiedAddressFormData>;
}

export function StateField({ form }: StateFieldProps) {
  const australianStates = [
    'New South Wales',
    'Victoria',
    'Queensland',
    'South Australia',
    'Western Australia',
    'Tasmania',
    'Northern Territory',
    'Australian Capital Territory',
  ];

  const stateAbbreviations: Record<string, string> = {
    'New South Wales': 'NSW',
    'Victoria': 'VIC',
    'Queensland': 'QLD',
    'South Australia': 'SA',
    'Western Australia': 'WA',
    'Tasmania': 'TAS',
    'Northern Territory': 'NT',
    'Australian Capital Territory': 'ACT'
  };

  return (
    <FormField
      control={form.control}
      name="state"
      render={({ field }) => (
        <FormItem>
          <FormLabel>State</FormLabel>
          <Select 
            onValueChange={(value) => field.onChange(stateAbbreviations[value] || value)} 
            defaultValue={Object.keys(stateAbbreviations).find(
              key => stateAbbreviations[key] === field.value
            ) || field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {australianStates.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
