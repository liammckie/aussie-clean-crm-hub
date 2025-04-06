
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { SiteFormData } from '../SiteFormTypes';

interface SiteAdditionalFieldsProps {
  form: UseFormReturn<SiteFormData>;
}

export function SiteAdditionalFields({ form }: SiteAdditionalFieldsProps) {
  return (
    <div className="space-y-4 col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="North, South, East, West" {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>Geographic region of the site</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="square_meters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area (m²) (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Total floor area in square meters" 
                  {...field}
                  onChange={event => field.onChange(event.target.value ? Number(event.target.value) : undefined)}
                  value={field.value === undefined ? '' : field.value}
                />
              </FormControl>
              <FormDescription>Total area of the site in square meters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Detailed site description" 
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>Additional details about the site</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes (Optional)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Any additional notes or special requirements" 
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>Any special considerations or requirements</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="induction_required"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Induction Required</FormLabel>
              <FormDescription>
                Check if site induction is required before service
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
