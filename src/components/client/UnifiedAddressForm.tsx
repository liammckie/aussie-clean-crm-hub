
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
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AddressType } from '@/services/unified';

// Address schema for validation
const addressSchema = z.object({
  address_line_1: z.string().min(1, { message: 'Street address is required' }),
  address_line_2: z.string().optional(),
  suburb: z.string().min(1, { message: 'Suburb is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  postcode: z.string().min(4, { message: 'Postcode must be at least 4 characters' }),
  country: z.string().default('Australia'),
  address_type: z.enum(['billing', 'postal', 'physical']),
  is_primary: z.boolean().default(false),
});

export type UnifiedAddressFormData = z.infer<typeof addressSchema>;

interface UnifiedAddressFormProps {
  onSubmit: (data: UnifiedAddressFormData) => void;
  initialData?: Partial<UnifiedAddressFormData>;
  isLoading?: boolean;
  buttonText?: string;
  showAddressType?: boolean;
  showIsPrimary?: boolean;
}

export function UnifiedAddressForm({
  onSubmit,
  initialData = {},
  isLoading = false,
  buttonText = "Save Address",
  showAddressType = true,
  showIsPrimary = true,
}: UnifiedAddressFormProps) {
  const form = useForm<UnifiedAddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address_line_1: initialData.address_line_1 || '',
      address_line_2: initialData.address_line_2 || '',
      suburb: initialData.suburb || '',
      state: initialData.state || '',
      postcode: initialData.postcode || '',
      country: initialData.country || 'Australia',
      address_type: (initialData.address_type as AddressType) || 'billing',
      is_primary: initialData.is_primary || false,
    }
  });

  const australianStates = [
    'New South Wales',
    'Victoria',
    'Queensland',
    'South Australia',
    'Western Australia',
    'Tasmania',
    'Northern Territory',
    'Australian Capital Territory',
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

  const handleFormSubmit = (data: UnifiedAddressFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        {showAddressType && (
          <FormField
            control={form.control}
            name="address_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select address type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="postal">Postal</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="address_line_1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address_line_2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address Line 2 (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Apartment, suite, unit, etc." {...field} />
              </FormControl>
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
                <Input placeholder="Melbourne" {...field} />
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
                <Input placeholder="3000" {...field} />
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
                <Input placeholder="Australia" defaultValue="Australia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showIsPrimary && (
          <FormField
            control={form.control}
            name="is_primary"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal cursor-pointer">
                  Set as primary address
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isLoading} className="mt-4">
          {isLoading ? "Saving..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}
