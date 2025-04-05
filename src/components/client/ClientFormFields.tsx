
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClientFormData } from '@/services/client/types';
import { AddressFieldsSection } from './AddressFieldsSection';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { UseFormReturn } from 'react-hook-form';

interface ClientFormFieldsProps {
  form: UseFormReturn<ClientFormData>;
}

export function ClientFormFields({ form }: ClientFormFieldsProps) {
  return (
    <>
      {/* Business Information */}
      <div>
        <FormField
          control={form.control}
          name="business_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Aussie Clean Pty Ltd" {...field} />
              </FormControl>
              <FormDescription>The official name of the business.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormField
          control={form.control}
          name="trading_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trading Name (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Aussie Cleaning Co." {...field} />
              </FormControl>
              <FormDescription>The name the business uses for trading, if different.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="abn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ABN (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="12345678901" {...field} />
              </FormControl>
              <FormDescription>Australian Business Number.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="acn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ACN (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="123456789" {...field} />
              </FormControl>
              <FormDescription>Australian Company Number.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Cleaning Services" {...field} />
              </FormControl>
              <FormDescription>The industry the client operates in.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Client Status */}
      <div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Prospect">Prospect</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>The current status of the client.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Onboarding Date */}
      <div>
        <FormField
          control={form.control}
          name="onboarding_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Onboarding Date (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => date ? field.onChange(date.toISOString().split('T')[0]) : field.onChange('')}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>The date the client was onboarded.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Source */}
      <div>
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Referral, Website, etc." {...field} />
              </FormControl>
              <FormDescription>How the client was acquired.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Address Fields */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-medium mb-4">Address Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AddressFieldsSection form={form} showHeading={false} />
        </div>
      </div>

      {/* Billing Information */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-medium mb-4">Billing Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="billing_cycle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Cycle (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Monthly, Quarterly, etc." {...field} />
                </FormControl>
                <FormDescription>How often the client is billed.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="payment_terms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Terms (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Net 30, Due on Receipt, etc." {...field} />
                </FormControl>
                <FormDescription>The terms for client payments.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Credit Card, Bank Transfer, etc." {...field} />
                </FormControl>
                <FormDescription>The method the client uses to pay.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tax_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Status (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="GST, VAT, etc." {...field} />
                </FormControl>
                <FormDescription>The tax status of the client.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mt-4">
          <FormField
            control={form.control}
            name="credit_limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credit Limit (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="10000" 
                    {...field} 
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormDescription>The credit limit for the client.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}
