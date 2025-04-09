
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ClientFormData, clientService } from '@/services/client';
import { parseClientData } from '@/utils/clientUtils';
import { ClientFormFields } from './ClientFormFields';
import { isApiError } from '@/types/api-response';
import { ClientStatus } from '@/types/database-schema';
import { ClientAddressTab } from './ClientAddressTab';
import { LoadSampleButton } from '@/components/ui/load-sample-button';
import { ErrorReporting } from '@/utils/errorReporting';

interface ClientDetailsTabProps {
  clientId: string;
  initialData?: Partial<ClientFormData>;
  onSaveSuccess?: () => void;
}

export function ClientDetailsTab({ clientId, initialData, onSaveSuccess }: ClientDetailsTabProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSampleLoaded, setIsSampleLoaded] = useState(false);

  const form = useForm<ClientFormData>({
    defaultValues: {
      business_name: initialData?.business_name || '',
      trading_name: initialData?.trading_name || '',
      abn: initialData?.abn || '',
      acn: initialData?.acn || '',
      industry: initialData?.industry || '',
      status: initialData?.status || ClientStatus.PROSPECT,
      onboarding_date: initialData?.onboarding_date || new Date().toISOString().split('T')[0],
      source: initialData?.source || '',
      billing_cycle: initialData?.billing_cycle || '',
      payment_terms: initialData?.payment_terms || '',
      payment_method: initialData?.payment_method || '',
      tax_status: initialData?.tax_status || '',
      credit_limit: initialData?.credit_limit || undefined,
      address_line_1: initialData?.address_line_1 || '',
      address_line_2: initialData?.address_line_2 || '',
      suburb: initialData?.suburb || '',
      state: initialData?.state || '',
      postcode: initialData?.postcode || '',
      country: initialData?.country || 'Australia',
    }
  });

  const onSubmit = async (data: ClientFormData) => {
    setIsUpdating(true);
    try {
      // Prepare data for submission
      const preparedData = parseClientData(data);
      
      // Validate business identifiers
      const isValidABN = data.abn ? /^\d{11}$/.test(data.abn.replace(/\s/g, '')) : true;
      const isValidACN = data.acn ? /^\d{9}$/.test(data.acn.replace(/\s/g, '')) : true;
      
      if (!isValidABN) {
        form.setError('abn', { 
          type: 'manual', 
          message: 'ABN must be 11 digits' 
        });
        setIsUpdating(false);
        return;
      }
      
      if (!isValidACN) {
        form.setError('acn', { 
          type: 'manual', 
          message: 'ACN must be 9 digits' 
        });
        setIsUpdating(false);
        return;
      }
      
      const response = await clientService.updateClient(clientId, preparedData);

      if (isApiError(response)) {
        toast.error(`Failed to update client: ${response.message}`);
        
        // Set form errors if validation issues
        if (response.category === 'validation' && response.details?.field) {
          form.setError(response.details.field as any, {
            type: 'manual',
            message: response.message
          });
        }
        
        ErrorReporting.captureException(new Error(`Client update failed: ${response.message}`));
      } else {
        toast.success('Client updated successfully!');
        if (onSaveSuccess) onSaveSuccess();
      }
    } catch (error: any) {
      console.error('Error updating client:', error);
      toast.error(error?.message || 'Failed to update client');
      ErrorReporting.captureException(error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleLoadSampleData = () => {
    // Example sample data
    const sampleData = {
      business_name: 'Sample Business',
      trading_name: 'Sample Trading',
      abn: '12345678901',
      acn: '123456789',
      industry: 'Technology',
      status: ClientStatus.ACTIVE,
      onboarding_date: new Date().toISOString().split('T')[0],
      source: 'Website',
      billing_cycle: 'Monthly',
      payment_terms: 'Net 30',
      payment_method: 'Direct Deposit',
      tax_status: 'GST Registered',
      credit_limit: 10000,
      address_line_1: '123 Sample St',
      address_line_2: 'Suite 101',
      suburb: 'Sample Suburb',
      state: 'VIC',
      postcode: '3000',
      country: 'Australia'
    };

    Object.entries(sampleData).forEach(([key, value]) => {
      form.setValue(key as keyof ClientFormData, value);
    });
    
    setIsSampleLoaded(true);
    toast.success('Sample data loaded!');
  };
  
  const handleClearSampleData = () => {
    form.reset();
    setIsSampleLoaded(false);
    toast.info('Form cleared');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 flex justify-end">
            <LoadSampleButton 
              onLoadSample={isSampleLoaded ? handleClearSampleData : handleLoadSampleData} 
              isLoaded={isSampleLoaded}
            />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <ClientFormFields form={form} />
              
              <Button type="submit" disabled={isUpdating} className="mt-6">
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <ClientAddressTab clientId={clientId} />
    </div>
  );
}

export default ClientDetailsTab;
