
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ClientFormData, clientService, ValidationErrorResponse } from '@/services/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { prepareClientDataForSubmission } from '@/utils/clientUtils';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ClientFormFields } from '@/components/client/ClientFormFields';
import { loadSampleClientData } from '@/utils/clientUtils';
import { LoadSampleButton } from '@/components/ui/load-sample-button';

const NewClient = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [isSampleLoaded, setIsSampleLoaded] = useState(false);

  const form = useForm<ClientFormData>({
    defaultValues: {
      business_name: '',
      trading_name: '',
      abn: '',
      acn: '',
      industry: '',
      status: 'Prospect',
      onboarding_date: new Date().toISOString().split('T')[0], // Default to today
      source: '',
      billing_cycle: '',
      payment_terms: '',
      payment_method: '',
      tax_status: '',
      credit_limit: undefined,
      // Address fields with defaults
      address_line_1: '',
      address_line_2: '',
      suburb: '',
      state: '',
      postcode: '',
      country: 'Australia',
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    setIsCreating(true);
    try {
      // Prepare data to match database schema requirements
      const preparedData = prepareClientDataForSubmission(data);
      console.log('Submitting client data:', preparedData);
      
      const response = await clientService.createClient(preparedData);

      if ('category' in response && response.category === 'validation') {
        // Cast the response to ValidationErrorResponse to access its properties safely
        const validationError = response as ValidationErrorResponse;
        
        // Now TypeScript knows this object has the expected properties
        if (validationError.details && validationError.details.field) {
          form.setError(validationError.details.field as keyof ClientFormData, {
            type: 'manual',
            message: validationError.message,
          });
          toast.error(validationError.message);
        } else {
          // General validation error without specific field
          toast.error(validationError.message || 'Validation error occurred');
        }
      } else if ('category' in response) {
        // Handle other error types
        toast.error(response.message || 'An error occurred');
      } else {
        // Success case
        toast.success('Client created successfully!');
        navigate('/clients');
      }
    } catch (error: any) {
      console.error('Error creating client:', error);
      toast.error(error?.message || 'Failed to create client');
    } finally {
      setIsCreating(false);
    }
  };

  const handleLoadSampleData = () => {
    loadSampleClientData(data => {
      // Reset the form and set all fields
      Object.entries(data).forEach(([key, value]) => {
        form.setValue(key as keyof ClientFormData, value);
      });
      setIsSampleLoaded(true);
    });
    toast.success('Sample data loaded! Check the form fields and submit to test.');
  };

  const handleClearSampleData = () => {
    form.reset();
    setIsSampleLoaded(false);
    toast.info('Form cleared');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/clients">Clients</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>New Client</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create New Client</h1>
        <LoadSampleButton 
          onLoadSample={isSampleLoaded ? handleClearSampleData : handleLoadSampleData}
          isLoaded={isSampleLoaded}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
          <CardDescription>Enter the client's business and contact information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Use a refactored component for client form fields */}
              <ClientFormFields form={form} />
              
              <Button type="submit" disabled={isCreating} className="mt-6">
                {isCreating ? 'Creating...' : 'Create Client'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewClient;
