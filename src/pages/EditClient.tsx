
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ClientFormData, ClientWithContacts } from '@/services/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Map, FileText, Building } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { toast } from 'sonner';
import { clientService } from '@/services';
import { useClients } from '@/hooks/use-clients';
import { ClientDetailsTab } from '@/components/client/ClientDetailsTab';
import { ClientContactsTab } from '@/components/client/ClientContactsTab';
import { ClientSitesTab } from '@/components/client/ClientSitesTab';
import { ClientContractsTab } from '@/components/client/ClientContractsTab';

const EditClient = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [clientData, setClientData] = useState<ClientFormData>({
    business_name: '',
    trading_name: '',
    abn: '',
    acn: '',
    industry: '',
    status: 'Prospect',
    onboarding_date: undefined,
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
  });
  
  const { useClientDetails } = useClients();
  const { data: client, isLoading: isLoadingClient, refetch: refetchClient } = useClientDetails(id);

  useEffect(() => {
    if (id && !isLoaded) {
      clientService.getClientById(id)
        .then(response => {
          if (!response || 'category' in response || !response.data) {
            const errorMessage = 'category' in response ? response.message || 'Unknown error' : 'Unknown error';
            toast.error(`Failed to load client data: ${errorMessage}`);
            return;
          }

          const clientData = response.data;
          setClientData({
            business_name: clientData.business_name,
            trading_name: clientData.trading_name || '',
            abn: clientData.abn || '',
            acn: clientData.acn || '',
            industry: clientData.industry || '',
            status: clientData.status,
            onboarding_date: clientData.onboarding_date || undefined,
            source: clientData.source || '',
            billing_cycle: clientData.billing_cycle || '',
            payment_terms: clientData.payment_terms || '',
            payment_method: clientData.payment_method || '',
            tax_status: clientData.tax_status || '',
            credit_limit: clientData.credit_limit || undefined,
            // Load address fields - use null coalescing to handle potentially undefined fields
            address_line_1: clientData.address_line_1 || '',
            address_line_2: clientData.address_line_2 || '',
            suburb: clientData.suburb || '',
            state: clientData.state || '',
            postcode: clientData.postcode || '',
            country: clientData.country || 'Australia',
          });
          setIsLoaded(true);
        })
        .catch(error => {
          console.error('Error loading client data:', error);
          toast.error(`Failed to load client data: ${error.message}`);
        });
    } else if (client && !isLoaded) {
      // Use client data from React Query if available
      setClientData({
        business_name: client.business_name,
        trading_name: client.trading_name || '',
        abn: client.abn || '',
        acn: client.acn || '',
        industry: client.industry || '',
        status: client.status,
        onboarding_date: client.onboarding_date || undefined,
        source: client.source || '',
        billing_cycle: client.billing_cycle || '',
        payment_terms: client.payment_terms || '',
        payment_method: client.payment_method || '',
        tax_status: client.tax_status || '',
        credit_limit: client.credit_limit || undefined,
        address_line_1: client.address_line_1 || '',
        address_line_2: client.address_line_2 || '',
        suburb: client.suburb || '',
        state: client.state || '',
        postcode: client.postcode || '',
        country: client.country || 'Australia',
      });
      setIsLoaded(true);
    }
  }, [id, client, isLoaded]);

  if (!isLoaded && isLoadingClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!id) {
    toast.error('Client ID is missing.');
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 border rounded bg-red-50 text-red-800">
          Error: Client ID is missing
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-4">
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
            <BreadcrumbPage>Edit Client</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-4">
        <Link to="/clients" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{client?.business_name || clientData.business_name || 'Edit Client'}</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">
            <Building className="h-4 w-4 mr-2" />
            Client Details
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <Users className="h-4 w-4 mr-2" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="sites">
            <Map className="h-4 w-4 mr-2" />
            Sites
          </TabsTrigger>
          <TabsTrigger value="contracts">
            <FileText className="h-4 w-4 mr-2" />
            Contracts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <ClientDetailsTab 
            clientId={id} 
            initialData={clientData}
            onSaveSuccess={() => navigate('/clients')} 
          />
        </TabsContent>
        
        <TabsContent value="contacts">
          <ClientContactsTab 
            clientId={id} 
            onContactAdded={() => refetchClient()} 
          />
        </TabsContent>
        
        <TabsContent value="sites">
          <ClientSitesTab clientId={id} />
        </TabsContent>
        
        <TabsContent value="contracts">
          <ClientContractsTab clientId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditClient;
