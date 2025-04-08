
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ContractFormData,
  contractFormSchema,
  createDefaultContractValues
} from '@/types/contract-types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useClients } from '@/hooks/use-clients';
import { useNavigate } from 'react-router-dom';
import { useContracts } from '@/hooks/use-contracts';
import { toast } from 'sonner';
import { AppLogger, LogCategory } from '@/utils/logging';
import { BILLING_FREQUENCY_OPTIONS, PAYMENT_TERMS_OPTIONS } from '@/utils/constants';
import { isApiError } from '@/types/api-response';

interface ContractFormProps {
  contractId?: string;
  clientId?: string;
  isEdit?: boolean;
}

export function ContractForm({ contractId, clientId, isEdit = false }: ContractFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const { useClientsList } = useClients();
  const { data: clients, isLoading: isClientsLoading, refetch } = useClientsList();
  
  const { useContractDetails, useUpdateContract, useCreateContract } = useContracts();
  const { data: contract, isLoading: isContractLoading } = useContractDetails(contractId);
  const updateContract = useUpdateContract();
  const createContract = useCreateContract();

  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: createDefaultContractValues({ client_id: clientId })
  });

  useEffect(() => {
    if (clientId && !isClientsLoading && clients) {
      // Set client ID if passed as a query parameter
      form.setValue("client_id", clientId);
    }
  }, [clientId, clients, isClientsLoading, form]);
  
  useEffect(() => {
    if (contract && isEdit) {
      // Populate form with contract details for editing
      form.reset(contract);
    }
  }, [contract, isEdit, form]);

  const onSubmit = async (data: ContractFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = isEdit 
        ? await updateContract(contractId as string, data)
        : await createContract(data);
      
      if (!isApiError(response)) {
        toast.success(`Contract ${isEdit ? 'updated' : 'created'} successfully!`);
        AppLogger.info(
          LogCategory.CONTRACT, 
          `Contract ${isEdit ? 'updated' : 'created'} successfully`, 
          { contractId: response.data?.id }
        );
        navigate('/contracts');
      } else {
        toast.error(response.message || 'Failed to save contract. Please try again.');
        AppLogger.error(
          LogCategory.CONTRACT, 
          `Failed to ${isEdit ? 'update' : 'create'} contract`, 
          { error: response.message }
        );
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message || 'Failed to save contract.'}`);
      AppLogger.error(
        LogCategory.ERROR, 
        `Exception during contract ${isEdit ? 'update' : 'creation'}`, 
        { error: error.message }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="service">Service Details</TabsTrigger>
            <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contract_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contract Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contract name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contract_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contract Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter contract code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isClientsLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients?.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.business_name}
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
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending_approval">Pending Approval</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="terminated">Terminated</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_ongoing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Is Ongoing</FormLabel>
                        <FormDescription>
                          Check if the contract is ongoing with no fixed end date.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Financial Tab */}
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Financial Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contract_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contract Value</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter contract value" 
                            {...field} 
                            value={field.value === undefined ? '' : field.value}
                            onChange={(e) => {
                              const value = e.target.value === '' ? undefined : Number(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="profit_margin_percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profit Margin (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter profit margin percentage" 
                            {...field} 
                            value={field.value === undefined ? '' : field.value}
                            onChange={(e) => {
                              const value = e.target.value === '' ? undefined : Number(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="total_weekly_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Weekly Value</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter total weekly value" 
                            {...field} 
                            value={field.value === undefined ? '' : field.value}
                            onChange={(e) => {
                              const value = e.target.value === '' ? undefined : Number(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="total_monthly_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Monthly Value</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter total monthly value" 
                            {...field} 
                            value={field.value === undefined ? '' : field.value}
                            onChange={(e) => {
                              const value = e.target.value === '' ? undefined : Number(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="total_annual_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Annual Value</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter total annual value" 
                            {...field} 
                            value={field.value === undefined ? '' : field.value}
                            onChange={(e) => {
                              const value = e.target.value === '' ? undefined : Number(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="supplier_cost_weekly"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier Cost Weekly</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter supplier cost weekly" 
                            {...field}
                            value={field.value === undefined ? '' : field.value}
                            onChange={(e) => {
                              const value = e.target.value === '' ? undefined : Number(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="supplier_cost_monthly"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier Cost Monthly</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter supplier cost monthly" 
                            {...field}
                            value={field.value === undefined ? '' : field.value}
                            onChange={(e) => {
                              const value = e.target.value === '' ? undefined : Number(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="supplier_cost_annual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supplier Cost Annual</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter supplier cost annual" 
                            {...field}
                            value={field.value === undefined ? '' : field.value}
                            onChange={(e) => {
                              const value = e.target.value === '' ? undefined : Number(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Service Details Tab */}
          <TabsContent value="service">
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="service_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter service type" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sla_requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SLA Requirements</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter SLA requirements" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Scheduling Tab */}
          <TabsContent value="scheduling">
            <Card>
              <CardHeader>
                <CardTitle>Scheduling Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="delivery_mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Mode</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter delivery mode" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Remove the billing_cycle field since it's not in the schema */}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="account_manager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Manager</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter account manager" {...field} />
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
                          <Input placeholder="Enter state manager" {...field} />
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
                          <Input placeholder="Enter national manager" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <CardTitle className="text-md mb-2">Service Days</CardTitle>
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="monday"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center p-1 space-x-2 space-y-0 rounded-md border">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal pl-0">Monday</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tuesday"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center p-1 space-x-2 space-y-0 rounded-md border">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal pl-0">Tuesday</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="wednesday"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center p-1 space-x-2 space-y-0 rounded-md border">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal pl-0">Wednesday</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="thursday"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center p-1 space-x-2 space-y-0 rounded-md border">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal pl-0">Thursday</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="friday"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center p-1 space-x-2 space-y-0 rounded-md border">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal pl-0">Friday</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="saturday"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center p-1 space-x-2 space-y-0 rounded-md border">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal pl-0">Saturday</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sunday"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center p-1 space-x-2 space-y-0 rounded-md border">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal pl-0">Sunday</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Updated billing_frequency field to use dropdown */}
                  <FormField
                    control={form.control}
                    name="billing_frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Billing Frequency
                          {form.watch('status') === 'active' && <span className="text-red-500">*</span>}
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select billing frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BILLING_FREQUENCY_OPTIONS.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
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
                    name="billing_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Fixed, Variable" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Updated payment_terms field to use dropdown */}
                  <FormField
                    control={form.control}
                    name="payment_terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Payment Terms
                          {form.watch('status') === 'active' && <span className="text-red-500">*</span>}
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment terms" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PAYMENT_TERMS_OPTIONS.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
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
                    name="payment_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Bank Transfer, Credit Card" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="client_representative_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Representative Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter client representative name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="client_representative_contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Representative Contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter client representative contact" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="contract_document_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Document URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contract document URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="scope_document_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scope Document URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter scope document URL" {...field} />
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
                        <Textarea placeholder="Enter notes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => navigate('/contracts')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Save Contract'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
