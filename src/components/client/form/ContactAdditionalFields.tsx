
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
import { UnifiedContactFormData, PreferredCommunication } from '@/types/form-types';
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
              <Input placeholder="Office phone" {...field} value={field.value || ''} />
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
              <Input placeholder="Landline phone" {...field} value={field.value || ''} />
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
              <Input placeholder="Mobile phone" {...field} value={field.value || ''} />
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
              <Input placeholder="Job title" {...field} value={field.value || ''} />
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
              <Input placeholder="Company name" {...field} value={field.value || ''} />
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
            <Select 
              onValueChange={(value: PreferredCommunication) => field.onChange(value)} 
              value={field.value || undefined}
            >
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
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
