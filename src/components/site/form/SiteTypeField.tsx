
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SiteType } from '@/services/site';
import { UseFormReturn } from 'react-hook-form';
import { SiteFormData } from '../SiteFormTypes';

interface SiteTypeFieldProps {
  form: UseFormReturn<SiteFormData>;
}

export function SiteTypeField({ form }: SiteTypeFieldProps) {
  // Create an array of site types from the enum values
  const siteTypes = [
    SiteType.RESIDENTIAL,
    SiteType.INDUSTRIAL,
    SiteType.RETAIL,
    SiteType.HOSPITALITY,
    SiteType.OFFICE,
    SiteType.WAREHOUSE,
    SiteType.EDUCATIONAL,
    SiteType.MEDICAL
  ];

  return (
    <FormField
      control={form.control}
      name="site_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Site Type</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value} 
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select site type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {siteTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
