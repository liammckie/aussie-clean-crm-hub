
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
import { UseFormReturn } from 'react-hook-form';
import { SiteFormData } from '../SiteFormTypes';
import { SiteStatus } from '@/services/site';

interface SiteStatusFieldProps {
  form: UseFormReturn<SiteFormData>;
}

export function SiteStatusField({ form }: SiteStatusFieldProps) {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Site Status</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value} 
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value={SiteStatus.ACTIVE}>Active</SelectItem>
              <SelectItem value={SiteStatus.INACTIVE}>Inactive</SelectItem>
              <SelectItem value={SiteStatus.PENDING_ACTIVATION}>Pending Activation</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
