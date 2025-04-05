
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { SiteFormData } from '../SiteFormTypes';

interface SiteAdditionalFieldsProps {
  form: UseFormReturn<SiteFormData>;
}

export function SiteAdditionalFields({ form }: SiteAdditionalFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="induction_required"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-4">
            <FormControl>
              <Checkbox 
                checked={field.value} 
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="cursor-pointer">
                Induction Required
              </FormLabel>
              <FormDescription>
                Check if site induction is required before service
              </FormDescription>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Notes (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter any additional notes about this site"
                className="resize-y min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
