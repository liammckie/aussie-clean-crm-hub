
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ClientFormData } from '@/services/client';

interface AddressFieldsSectionProps {
  form: UseFormReturn<ClientFormData>;
  showHeading?: boolean;
}

export function AddressFieldsSection({ form, showHeading = true }: AddressFieldsSectionProps) {
  const australianStates = [
    'New South Wales', 'Victoria', 'Queensland', 'South Australia',
    'Western Australia', 'Tasmania', 'Northern Territory', 'Australian Capital Territory'
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
    <>
      {showHeading && (
        <div className="col-span-2 mt-6 mb-4">
          <h3 className="text-lg font-medium text-gray-700">Address Details</h3>
        </div>
      )}
      
      <FormField
        control={form.control}
        name="address_line_1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 1</FormLabel>
            <FormControl>
              <Input placeholder="Street address" {...field} />
            </FormControl>
            <FormDescription>Primary street address</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="address_line_2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 2 (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Suite, unit, building, etc." {...field} />
            </FormControl>
            <FormDescription>Additional address information</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="suburb"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Suburb/City</FormLabel>
            <FormControl>
              <Input placeholder="Suburb or City" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
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
      
      <FormField
        control={form.control}
        name="postcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Postcode</FormLabel>
            <FormControl>
              <Input placeholder="Postcode" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input placeholder="Country" defaultValue="Australia" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
