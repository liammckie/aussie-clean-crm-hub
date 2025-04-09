
import React from 'react';
import { useForm } from 'react-hook-form';
import { ClientFormData } from '@/services/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { prepareClientDataForSubmission, validateBusinessIdentifiers } from '@/utils/clientUtils';
import { toast } from 'sonner';
import { clientService } from '@/services';
import { ClientFormFields } from './ClientFormFields';
import { isApiError } from '@/types/api-response';
import { AppLogger, LogCategory } from '@/utils/logging';

interface ClientDetailsTabProps {
  clientId: string;
  onSaveSuccess?: () => void;
  initialData: ClientFormData;
}

export function ClientDetailsTab({ clientId, onSaveSuccess, initialData }: ClientDetailsTabProps) {
  const form = useForm<ClientFormData>({
    defaultValues: initialData,
  });

  const onSubmit = async (data: ClientFormData) => {
    const identifierError = validateBusinessIdentifiers(data);
    if (identifierError) {
      toast.error(identifierError.message);
      form.setError(identifierError.details?.field as keyof ClientFormData, {
        type: 'manual',
        message: identifierError.message,
      });
      return;
    }

    // Convert potential string date to Date object for form handling
    const preparedData = {
      ...prepareClientDataForSubmission(data),
      onboarding_date: data.onboarding_date instanceof Date
        ? data.onboarding_date.toISOString().split('T')[0]
        : data.onboarding_date
    };

    AppLogger.info(LogCategory.CLIENT, `Updating client ${clientId}`, { 
      clientId, 
      businessName: preparedData.business_name 
    });

    try {
      const response = await clientService.updateClient(clientId, preparedData);
      
      if (isApiError(response)) {
        AppLogger.error(LogCategory.API, `Failed to update client: ${response.message}`, {
          clientId,
          errorCategory: response.category,
          details: response.details
        });
        toast.error(response.message);
        return;
      }
      
      AppLogger.info(LogCategory.CLIENT, 'Client updated successfully', { clientId });
      toast.success('Client updated successfully!');
      
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error: any) {
      AppLogger.error(LogCategory.ERROR, `Exception updating client: ${error.message}`, { 
        clientId, 
        error 
      });
      toast.error(`Failed to update client: ${error.message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Client</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Use the shared ClientFormFields component */}
            <ClientFormFields form={form} />
            
            <Button type="submit">Update Client</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
