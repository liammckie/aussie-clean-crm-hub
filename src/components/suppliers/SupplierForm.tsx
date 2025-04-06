
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SupplierData, SupplierCreateData } from '@/services/supplier/types';
import { AppLogger, LogCategory } from '@/utils/logging';

// Define the schema for supplier form validation
const supplierFormSchema = z.object({
  business_name: z.string().min(1, 'Business name is required'),
  abn: z.string().optional(),
  acn: z.string().optional(),
  status: z.enum(['active', 'on_hold', 'suspended', 'terminated']),
  supplier_code: z.string().optional(),
  supplier_type: z.string().optional(),
  primary_contact_name: z.string().optional(),
  primary_contact_phone: z.string().optional(),
  primary_contact_email: z.string().email('Invalid email').optional().or(z.literal('')),
  billing_email: z.string().email('Invalid email').optional().or(z.literal('')),
  invoice_email: z.string().email('Invalid email').optional().or(z.literal('')),
  services_provided: z.string().optional(),
  date_onboarded: z.string().optional(),
  date_terminated: z.string().optional().nullable(),
  notes: z.string().optional(),
  bank_details: z.object({
    account_name: z.string().optional(),
    bsb: z.string().optional(),
    account_number: z.string().optional(),
    bank_name: z.string().optional(),
    payment_reference: z.string().optional(),
  }).optional(),
});

// Create type for form data
type SupplierFormData = z.infer<typeof supplierFormSchema>;

const createDefaultSupplierValues = (initialData?: Partial<SupplierFormData>): SupplierFormData => {
  return {
    business_name: initialData?.business_name || '',
    abn: initialData?.abn || '',
    acn: initialData?.acn || '',
    status: initialData?.status || 'active',
    supplier_code: initialData?.supplier_code || '',
    supplier_type: initialData?.supplier_type || 'Service',
    primary_contact_name: initialData?.primary_contact_name || '',
    primary_contact_phone: initialData?.primary_contact_phone || '',
    primary_contact_email: initialData?.primary_contact_email || '',
    billing_email: initialData?.billing_email || '',
    invoice_email: initialData?.invoice_email || '',
    services_provided: initialData?.services_provided || '',
    date_onboarded: initialData?.date_onboarded || new Date().toISOString().split('T')[0],
    date_terminated: initialData?.date_terminated || null,
    notes: initialData?.notes || '',
    bank_details: initialData?.bank_details || {
      account_name: '',
      bsb: '',
      account_number: '',
      bank_name: '',
      payment_reference: ''
    },
  };
};

interface SupplierFormProps {
  supplierId?: string;
  supplierData?: SupplierData;
  isEdit?: boolean;
  onSubmit: (data: SupplierCreateData | Partial<SupplierData>) => Promise<any>;
  isSubmitting: boolean;
}

export function SupplierForm({
  supplierId,
  supplierData,
  isEdit = false,
  onSubmit,
  isSubmitting
}: SupplierFormProps) {
  const navigate = useNavigate();
  const [sampleLoaded, setSampleLoaded] = useState(false);
  
  // Set up form with schema validation
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: createDefaultSupplierValues(),
    mode: 'onChange',
  });
  
  // Update form when supplier data is loaded (for edit mode)
  useEffect(() => {
    if (supplierData && isEdit) {
      AppLogger.debug(LogCategory.SUPPLIER, 'Setting form values with supplier data', supplierData);
      const formData: SupplierFormData = {
        business_name: supplierData.business_name,
        abn: supplierData.abn || '',
        acn: supplierData.acn || '',
        status: supplierData.status,
        supplier_code: supplierData.supplier_code || '',
        supplier_type: supplierData.supplier_type || '',
        primary_contact_name: supplierData.primary_contact_name || '',
        primary_contact_phone: supplierData.primary_contact_phone || '',
        primary_contact_email: supplierData.primary_contact_email || '',
        billing_email: supplierData.billing_email || '',
        invoice_email: supplierData.invoice_email || '',
        services_provided: supplierData.services_provided || '',
        date_onboarded: supplierData.date_onboarded || '',
        date_terminated: supplierData.date_terminated || null,
        notes: supplierData.notes || '',
        bank_details: supplierData.bank_details || {
          account_name: '',
          bsb: '',
          account_number: '',
          bank_name: '',
          payment_reference: ''
        },
      };
      form.reset(formData);
    }
  }, [supplierData, form, isEdit]);

  // Handle form submission
  const handleFormSubmit = async (data: SupplierFormData) => {
    try {
      AppLogger.info(
        LogCategory.SUPPLIER, 
        `${isEdit ? 'Updating' : 'Creating'} supplier`, 
        { data }
      );

      const result = await onSubmit(data);
      
      // Navigate after successful submission
      if (result?.id) {
        navigate(`/suppliers/${result.id}`);
      } else {
        navigate('/suppliers');
      }
    } catch (error) {
      AppLogger.error(
        LogCategory.SUPPLIER, 
        `Error ${isEdit ? 'updating' : 'creating'} supplier`, 
        { error }
      );
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} supplier. Please check the form and try again.`);
    }
  };

  // Load sample data for demonstration
  const handleSampleData = () => {
    if (sampleLoaded) {
      // Clear sample data
      form.reset(createDefaultSupplierValues());
      setSampleLoaded(false);
    } else {
      // Load sample data
      const sampleSupplier: Partial<SupplierFormData> = {
        business_name: 'ABC Cleaning Supplies',
        abn: '12345678901',
        acn: '987654321',
        status: 'active',
        supplier_code: 'SUP-1234',
        supplier_type: 'Consumable',
        primary_contact_name: 'John Smith',
        primary_contact_phone: '0412 345 678',
        primary_contact_email: 'john.smith@abccleaning.com.au',
        billing_email: 'accounts@abccleaning.com.au',
        invoice_email: 'invoices@abccleaning.com.au',
        services_provided: 'Cleaning supplies, equipment rental, chemicals',
        date_onboarded: new Date().toISOString().split('T')[0],
        notes: 'Preferred supplier for all cleaning consumables',
        bank_details: {
          account_name: 'ABC Cleaning Supplies Pty Ltd',
          bsb: '123-456',
          account_number: '12345678',
          bank_name: 'Commonwealth Bank',
          payment_reference: 'Invoice number'
        }
      };
      form.reset(createDefaultSupplierValues(sampleSupplier));
      setSampleLoaded(true);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>
            {isEdit ? 'Edit Supplier' : 'New Supplier'}
          </CardTitle>
          <CardDescription>
            {isEdit ? 'Update supplier details' : 'Create a new supplier or subcontractor'}
          </CardDescription>
        </div>
        {!isEdit && (
          <Button
            variant="outline"
            onClick={handleSampleData}
          >
            {sampleLoaded ? 'Clear Sample Data' : 'Load Sample Data'}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Supplier Details</TabsTrigger>
                <TabsTrigger value="contact">Contact Information</TabsTrigger>
                <TabsTrigger value="banking">Banking Information</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="business_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter business name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="supplier_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier Code</FormLabel>
                        <FormControl>
                          <Input placeholder="SUP-1234" {...field} />
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
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="on_hold">On Hold</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                            <SelectItem value="terminated">Terminated</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="supplier_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select supplier type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Service">Service</SelectItem>
                            <SelectItem value="Consumable">Consumable</SelectItem>
                            <SelectItem value="Equipment">Equipment</SelectItem>
                            <SelectItem value="Delivery">Delivery</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <FormLabel>ABN</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ABN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="acn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ACN</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ACN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date_onboarded"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Onboarded</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="date_terminated"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Terminated</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            value={field.value || ''} 
                            disabled={form.watch('status') !== 'terminated'}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="services_provided"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Services Provided</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter services provided" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter any additional notes..."
                          className="min-h-20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="contact" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="primary_contact_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Contact Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="primary_contact_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="primary_contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter primary email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Separator className="my-4" />
                <h3 className="text-lg font-medium">Financial Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="billing_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter billing email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="invoice_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter invoice email" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="banking" className="space-y-4">
                <h3 className="text-lg font-medium">Bank Details</h3>
                <p className="text-sm text-muted-foreground mb-4">This information is used for payments to the supplier.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bank_details.account_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter account name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bank_details.bank_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter bank name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bank_details.bsb"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>BSB</FormLabel>
                        <FormControl>
                          <Input placeholder="123-456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bank_details.account_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter account number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="bank_details.payment_reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Reference</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Invoice number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <CardFooter className="flex justify-between mt-6 px-0">
              <Button 
                type="button"
                variant="outline"
                onClick={() => navigate('/suppliers')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Update Supplier' : 'Create Supplier'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
