
import React, { useState, useEffect } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { isAuthenticated } from '@/integrations/supabase/client';

const NewClient = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [isSampleLoaded, setIsSampleLoaded] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const { isAuthenticated: contextAuth } = useAuth();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = await isAuthenticated();
        console.log('Authentication check result:', auth);
        setIsUserAuthenticated(auth);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setAuthChecked(true);
      }
    };
    
    checkAuth();
  }, []);

  // Monitor authentication from context
  useEffect(() => {
    console.log('Auth context changed:', contextAuth);
  }, [contextAuth]);

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
    // Double-check authentication before submitting
    const auth = await isAuthenticated();
    if (!auth) {
      toast.error('You need to be logged in to create clients');
      navigate('/login', { state: { from: '/clients/new' } });
      return;
    }

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
        
        // If it's an authentication error, redirect to login
        if (response.category === 'authentication') {
          setTimeout(() => navigate('/login', { state: { from: '/clients/new' } }), 1500);
        }
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

  // Display authentication warning if not authenticated
  if (authChecked && !isUserAuthenticated && !contextAuth) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You need to be logged in to create clients. Redirecting to login page...
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/login', { state: { from: '/clients/new' } })}>
          Go to Login
        </Button>
      </div>
    );
  }

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

      {/* Authentication status indicator for debugging */}
      {import.meta.env.DEV && (
        <div className="mb-4 p-2 border rounded bg-slate-800 text-xs">
          <p>Auth Status (Context): {contextAuth ? 'Authenticated' : 'Not Authenticated'}</p>
          <p>Auth Status (Direct): {isUserAuthenticated ? 'Authenticated' : 'Not Authenticated'}</p>
        </div>
      )}

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
