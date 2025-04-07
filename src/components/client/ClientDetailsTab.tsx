
import React from 'react';
import { useForm } from 'react-hook-form';
import { ClientFormData } from '@/services/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { prepareClientDataForSubmission, validateBusinessIdentifiers } from '@/utils/clientUtils';
import { toast } from 'sonner';
import { clientService } from '@/services';
import { ClientFormFields } from './ClientFormFields';
import { isApiError } from '@/types/api-response';

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

    const preparedData = prepareClientDataForSubmission(data);

    clientService.updateClient(clientId, preparedData)
      .then(response => {
        if (isApiError(response)) {
          toast.error(response.message);
          return;
        }
        toast.success('Client updated successfully!');
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      })
      .catch(error => {
        toast.error(`Failed to update client: ${error.message}`);
      });
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
