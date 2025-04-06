
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadSampleButton } from '@/components/ui/load-sample-button';

import { 
  contractFormSchema, 
  createDefaultContractValues,
  ContractFormData,
  ContractCreateData,
  ServiceType
} from '@/types/contract-types';
import { useContracts } from '@/hooks/use-contracts';
import { AppLogger, LogCategory } from '@/utils/logging';

interface ContractFormProps {
  clientId?: string;
  contractId?: string;
  isEdit?: boolean;
}

export function ContractForm({ clientId, contractId, isEdit = false }: ContractFormProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlClientId = searchParams.get('clientId') || clientId;
  const [sampleLoaded, setSampleLoaded] = useState(false);
  
  const { 
    createContract, 
    isCreatingContract, 
    updateContract, 
    isUpdatingContract, 
    useContractDetails
  } = useContracts(urlClientId);
  
  // Fetch client details (to show client name)
  const { data: clientData } = useQuery({
    queryKey: ['client', urlClientId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/clients/${urlClientId}`);
        if (!response.ok) throw new Error('Failed to fetch client');
        return await response.json();
      } catch (error) {
        console.error('Error fetching client:', error);
        return null;
      }
    },
    enabled: !!urlClientId,
  });
  
  // Fetch contract details if editing
  const { data: contractData, isLoading: isLoadingContract } = useContractDetails(contractId);

  // Set up form with schema validation
  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: createDefaultContractValues({ client_id: urlClientId || '' }),
    mode: 'onChange',
  });
  
  // Update form when contract data is loaded (for edit mode)
  useEffect(() => {
    if (contractData && isEdit) {
      AppLogger.debug(LogCategory.CONTRACT, 'Setting form values with contract data', contractData);
      const formData = {
        ...contractData,
        start_date: contractData.start_date ? new Date(contractData.start_date).toISOString().split('T')[0] : '',
        end_date: contractData.end_date ? new Date(contractData.end_date).toISOString().split('T')[0] : '',
      };
      form.reset(formData);
    }
  }, [contractData, form, isEdit]);

  // Handle form submission
  const onSubmit = async (data: ContractFormData) => {
    try {
      // Make sure client_id is set
      if (!data.client_id && urlClientId) {
        data.client_id = urlClientId;
      }
      
      // Calculate values if not explicitly provided
      if (data.total_weekly_value) {
        // Auto-calculate monthly and annual values if not provided
        if (!data.total_monthly_value) {
          data.total_monthly_value = data.total_weekly_value * 4.33;
        }
        if (!data.total_annual_value) {
          data.total_annual_value = data.total_weekly_value * 52;
        }
      }
      
      AppLogger.info(
        LogCategory.CONTRACT, 
        `${isEdit ? 'Updating' : 'Creating'} contract`, 
        { data }
      );

      // Ensure all required fields are present for contract creation
      const contractData: ContractCreateData = {
        contract_name: data.contract_name,
        contract_code: data.contract_code,
        client_id: data.client_id,
        service_type: data.service_type || 'commercial_cleaning',
        status: data.status || 'draft',
        start_date: data.start_date,
        is_ongoing: data.is_ongoing || false,
        // Include all optional fields
        description: data.description,
        end_date: data.end_date,
        delivery_mode: data.delivery_mode,
        account_manager: data.account_manager,
        state_manager: data.state_manager,
        national_manager: data.national_manager,
        billing_frequency: data.billing_frequency,
        billing_type: data.billing_type,
        payment_terms: data.payment_terms,
        payment_method: data.payment_method,
        total_weekly_value: data.total_weekly_value,
        total_monthly_value: data.total_monthly_value,
        total_annual_value: data.total_annual_value,
        sla_requirements: data.sla_requirements,
        client_representative_name: data.client_representative_name,
        client_representative_contact: data.client_representative_contact,
        notes: data.notes
      };
      
      if (isEdit && contractId) {
        // Update existing contract
        const result = await updateContract({ id: contractId, data: contractData });
        toast.success('Contract updated successfully!');
        navigate(`/contracts/${contractId}`);
      } else {
        // Create new contract
        const result = await createContract(contractData);
        toast.success('Contract created successfully!');
        // Navigate to the new contract or back to client
        if (result?.id) {
          navigate(`/contracts/${result.id}`);
        } else if (urlClientId) {
          navigate(`/clients/${urlClientId}?tab=contracts`);
        } else {
          navigate('/contracts');
        }
      }
    } catch (error) {
      AppLogger.error(
        LogCategory.CONTRACT, 
        `Error ${isEdit ? 'updating' : 'creating'} contract`, 
        { error }
      );
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} contract. Please check the form and try again.`);
    }
  };
  
  const handleSampleData = () => {
    if (sampleLoaded) {
      // Clear sample data
      form.reset(createDefaultContractValues({ client_id: urlClientId || '' }));
      setSampleLoaded(false);
    } else {
      // Load sample data
      const sampleContract: Partial<ContractFormData> = {
        client_id: urlClientId || '',
        contract_name: 'Commercial Office Cleaning',
        contract_code: `CNT-${Math.floor(1000 + Math.random() * 9000)}`,
        service_type: 'commercial_cleaning',
        status: 'draft',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        description: 'Regular commercial cleaning services for office premises',
        is_ongoing: false,
        delivery_mode: 'employee',
        account_manager: 'Sarah Johnson',
        state_manager: 'Michael Brown',
        billing_frequency: 'monthly',
        billing_type: 'fixed',
        payment_terms: 'Net 30',
        total_weekly_value: 1250,
        total_monthly_value: 5000,
        total_annual_value: 60000,
        sla_requirements: 'Cleaning must be completed before 9am each weekday',
        notes: 'Client requires staff to have security clearance',
      };
      form.reset(createDefaultContractValues(sampleContract));
      setSampleLoaded(true);
    }
  };

  if (isLoadingContract && isEdit) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>
            {isEdit ? 'Edit Contract' : 'New Contract'}
          </CardTitle>
          <CardDescription>
            {clientData?.business_name 
              ? `Client: ${clientData.business_name}` 
              : urlClientId 
                ? 'Loading client information...' 
                : 'Create a new service contract'}
          </CardDescription>
        </div>
        {!isEdit && (
          <LoadSampleButton
            onLoadSample={handleSampleData}
            isLoaded={sampleLoaded}
            className="mr-2"
          />
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Contract Details</TabsTrigger>
                <TabsTrigger value="financial">Financial Information</TabsTrigger>
                <TabsTrigger value="management">Management</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <Input placeholder="CNT-1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="service_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="commercial_cleaning">Commercial Cleaning</SelectItem>
                            <SelectItem value="industrial_cleaning">Industrial Cleaning</SelectItem>
                            <SelectItem value="residential_cleaning">Residential Cleaning</SelectItem>
                            <SelectItem value="window_cleaning">Window Cleaning</SelectItem>
                            <SelectItem value="carpet_cleaning">Carpet Cleaning</SelectItem>
                            <SelectItem value="waste_management">Waste Management</SelectItem>
                            <SelectItem value="grounds_maintenance">Grounds Maintenance</SelectItem>
                            <SelectItem value="pest_control">Pest Control</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
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
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="on_hold">On Hold</SelectItem>
                            <SelectItem value="pending_approval">Pending Approval</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          <Input 
                            type="date" 
                            {...field} 
                            disabled={form.watch('is_ongoing')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="is_ongoing"
                    render={({ field }) => (
                      <FormItem className="flex items-end space-x-2 h-[5.25rem]">
                        <FormControl>
                          <Checkbox 
                            checked={field.value} 
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              if (checked) {
                                form.setValue('end_date', '');
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="mt-0">Ongoing Contract (No End Date)</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the contract scope and services..."
                          className="min-h-20"
                          {...field} 
                        />
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
                        <Textarea 
                          placeholder="Enter any service level agreement requirements..."
                          className="min-h-20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="financial" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="total_weekly_value"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Weekly Contract Value ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.00"
                            value={value === undefined ? '' : value}
                            onChange={(e) => {
                              const val = e.target.value !== '' ? parseFloat(e.target.value) : undefined;
                              onChange(val);
                              // Auto-calculate monthly and annual if weekly changes
                              if (val) {
                                form.setValue('total_monthly_value', val * 4.33);
                                form.setValue('total_annual_value', val * 52);
                              }
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="total_monthly_value"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Monthly Contract Value ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.00"
                            value={value === undefined ? '' : value}
                            onChange={(e) => {
                              const val = e.target.value !== '' ? parseFloat(e.target.value) : undefined;
                              onChange(val);
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="total_annual_value"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Annual Contract Value ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.00"
                            value={value === undefined ? '' : value}
                            onChange={(e) => {
                              const val = e.target.value !== '' ? parseFloat(e.target.value) : undefined;
                              onChange(val);
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="billing_frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select billing frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="fortnightly">Fortnightly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select billing type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed</SelectItem>
                            <SelectItem value="variable">Variable</SelectItem>
                            <SelectItem value="time_materials">Time & Materials</SelectItem>
                            <SelectItem value="retainer">Retainer</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="payment_terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Terms</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Net 30" {...field} />
                        </FormControl>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="direct_debit">Direct Debit</SelectItem>
                            <SelectItem value="credit_card">Credit Card</SelectItem>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="cheque">Cheque</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="management" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="delivery_mode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Mode</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select delivery mode" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="employee">Employee</SelectItem>
                            <SelectItem value="contractor">Contractor</SelectItem>
                            <SelectItem value="hybrid">Hybrid</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="account_manager"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Manager</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
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
                          <Input placeholder="Enter name" {...field} />
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
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="client_representative_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Representative Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
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
                          <Input placeholder="Email or phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Additional notes about this contract..."
                          className="min-h-20"
                          {...field} 
                        />
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
                onClick={() => {
                  if (urlClientId) {
                    navigate(`/clients/${urlClientId}?tab=contracts`);
                  } else {
                    navigate('/contracts');
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isCreatingContract || isUpdatingContract}
              >
                {(isCreatingContract || isUpdatingContract) ? 'Saving...' : isEdit ? 'Update Contract' : 'Create Contract'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
