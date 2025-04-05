
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const contactSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  position: z.string().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  company: z.string().optional(),
  contact_type: z.string().min(1, { message: "Contact type is required" }),
  is_primary: z.boolean().default(false),
});

export type UnifiedContactFormData = z.infer<typeof contactSchema>;

interface UnifiedContactFormProps {
  onSubmit: (data: UnifiedContactFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<UnifiedContactFormData>;
  contactTypes?: string[];
  buttonText?: string;
  showIsPrimary?: boolean;
}

export function UnifiedContactForm({ 
  onSubmit, 
  isLoading = false, 
  initialData = {}, 
  contactTypes = ['Primary', 'Billing', 'Operations', 'Emergency'],
  buttonText = "Add Contact",
  showIsPrimary = true
}: UnifiedContactFormProps) {
  const form = useForm<UnifiedContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      position: initialData.position || '',
      phone: initialData.phone || '',
      mobile: initialData.mobile || '',
      company: initialData.company || '',
      contact_type: initialData.contact_type || contactTypes[0],
      is_primary: initialData.is_primary || false,
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Contact name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="contact@company.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="Position" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contact_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a contact type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contactTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
        </div>
        
        {showIsPrimary && (
          <FormField
            control={form.control}
            name="is_primary"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-2">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">Primary contact</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}
