
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { SiteType } from '@/services/site';

// Define site form schema
const siteSchema = z.object({
  site_name: z.string().min(1, { message: "Site name is required" }),
  site_code: z.string().min(1, { message: "Site code is required" }),
  address_line_1: z.string().min(1, { message: "Address is required" }),
  address_line_2: z.string().optional(),
  suburb: z.string().min(1, { message: "Suburb is required" }),
  state: z.string().min(1, { message: "State is required" }),
  postcode: z.string().min(4, { message: "Postcode is required" }),
  site_contact_name: z.string().optional(),
  site_contact_email: z.string().email().optional().or(z.literal('')),
  site_contact_phone: z.string().optional(),
  notes: z.string().optional(),
  region: z.string().optional(),
  induction_required: z.boolean().default(false),
  status: z.enum(['active', 'inactive', 'pending_activation']).default('pending_activation'),
  site_type: z.enum(['residential', 'industrial', 'retail', 'hospitality', 'office', 'warehouse', 'educational', 'medical', 'commercial']).optional(),
  square_meters: z.number().optional(),
});

export type SiteFormData = z.infer<typeof siteSchema>;

interface SiteFormProps {
  onSubmit: (data: SiteFormData) => void;
  initialData?: Partial<SiteFormData>;
  isLoading?: boolean;
  buttonText?: string;
}

export function SiteForm({ 
  onSubmit, 
  initialData = {}, 
  isLoading = false,
  buttonText = "Save Site"
}: SiteFormProps) {
  const form = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
    defaultValues: {
      site_name: initialData.site_name || '',
      site_code: initialData.site_code || '',
      address_line_1: initialData.address_line_1 || '',
      address_line_2: initialData.address_line_2 || '',
      suburb: initialData.suburb || '',
      state: initialData.state || '',
      postcode: initialData.postcode || '',
      site_contact_name: initialData.site_contact_name || '',
      site_contact_email: initialData.site_contact_email || '',
      site_contact_phone: initialData.site_contact_phone || '',
      notes: initialData.notes || '',
      region: initialData.region || '',
      induction_required: initialData.induction_required || false,
      status: initialData.status || 'pending_activation',
      site_type: initialData.site_type || undefined,
      square_meters: initialData.square_meters || undefined,
    }
  });

  const siteTypes: SiteType[] = [
    'commercial', 'residential', 'industrial', 'retail', 
    'hospitality', 'office', 'warehouse', 'educational', 'medical'
  ];

  const australianStates = [
    'New South Wales', 'Victoria', 'Queensland', 'South Australia',
    'Western Australia', 'Tasmania', 'Northern Territory', 'Australian Capital Territory'
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Site Information */}
          <FormField
            control={form.control}
            name="site_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Name</FormLabel>
                <FormControl>
                  <Input placeholder="Site Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="site_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Code</FormLabel>
                <FormControl>
                  <Input placeholder="Site Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="square_meters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area (m²)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Area in square meters"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Address Information */}
          <div className="col-span-2">
            <h3 className="font-medium text-gray-700 mb-2">Address Details</h3>
          </div>
          
          <FormField
            control={form.control}
            name="address_line_1"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input placeholder="Street address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address_line_2"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Address Line 2 (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Suite, unit, building, etc." {...field} />
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
                  <Input placeholder="Suburb or City" {...field} />
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
                  <Input placeholder="Postcode" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Region" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Onsite Contact Information */}
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending_activation">Pending Activation</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
        </div>

        <Button type="submit" disabled={isLoading} className="mt-4">
          {isLoading ? "Saving..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}
