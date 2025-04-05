
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { UnifiedContactFormData } from '@/types/form-types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ContactAdditionalFieldsProps {
  form: UseFormReturn<UnifiedContactFormData>;
}

export function ContactAdditionalFields({ form }: ContactAdditionalFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Office phone" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="phone_landline"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Landline (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Landline phone" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="mobile"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mobile (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Mobile phone" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="job_title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Title (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Job title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Company name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Added new fields for managers */}
      <FormField
        control={form.control}
        name="account_manager"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Account Manager (Optional)</FormLabel>
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
            <FormLabel>State Manager (Optional)</FormLabel>
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
            <FormLabel>National Manager (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="National manager name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="preferred_communication"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Communication</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred method" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="portal">Portal</SelectItem>
              </SelectContent>
            </Select>
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
                placeholder="Additional notes about this contact"
                className="min-h-[80px]" 
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
