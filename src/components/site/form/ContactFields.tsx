
import React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { SiteFormData } from '../SiteFormTypes';

interface ContactFieldsProps {
  form: UseFormReturn<SiteFormData>;
}

export function ContactFields({ form }: ContactFieldsProps) {
  return (
    <>
      <div className="col-span-2">
        <h3 className="font-medium text-gray-700 mb-2">Onsite Contact Details</h3>
      </div>
      
      <FormField
        control={form.control}
        name="site_contact_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Name (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Onsite contact name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="site_contact_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email (Optional)</FormLabel>
            <FormControl>
              <Input type="email" placeholder="contact@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="site_contact_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Phone (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Phone number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
