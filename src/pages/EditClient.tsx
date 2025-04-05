
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ClientFormData, ClientWithContacts } from '@/services/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, Map } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { toast } from 'sonner';
import { clientService } from '@/services';
import { useClients } from '@/hooks/use-clients';
import { ClientDetailsTab } from '@/components/client/ClientDetailsTab';
import { ClientContactsTab } from '@/components/client/ClientContactsTab';
import { ClientSitesTab } from '@/components/client/ClientSitesTab';

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
    if (id) {
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
          toast.error(`Failed to load client data: ${error.message}`);
        });
    }
  }, [id]);

  if (!isLoaded || isLoadingClient) {
    return <div>Loading...</div>;
  }

  if (!id) {
    toast.error('Client ID is missing.');
    return <div>Error: Client ID is missing</div>;
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
        <h1 className="text-2xl font-bold">{client?.business_name || 'Edit Client'}</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Client Details</TabsTrigger>
          <TabsTrigger value="contacts">
            <Users className="h-4 w-4 mr-2" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="sites">
            <Map className="h-4 w-4 mr-2" />
            Sites
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
            contacts={client?.client_contacts || []} 
            onContactAdded={() => refetchClient()} 
          />
        </TabsContent>
        
        <TabsContent value="sites">
          <ClientSitesTab clientId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditClient;
