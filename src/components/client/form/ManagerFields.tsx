
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { UnifiedContactFormData } from '@/types/form-types';

interface ManagerFieldsProps {
  form: UseFormReturn<UnifiedContactFormData>;
}

export function ManagerFields({ form }: ManagerFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="account_manager"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Account Manager</FormLabel>
            <FormControl>
              <Input placeholder="Account manager name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="state_manager"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State Manager</FormLabel>
            <FormControl>
              <Input placeholder="State manager name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="national_manager"
        render={({ field }) => (
          <FormItem>
            <FormLabel>National Manager</FormLabel>
            <FormControl>
              <Input placeholder="National manager name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
