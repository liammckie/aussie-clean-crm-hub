
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { 
  ArrowLeft, 
  Building, 
  Phone, 
  Users, 
  Map, 
  Mail, 
  FileText,
  Clock,
  CalendarClock
} from 'lucide-react';
import { useClients } from '@/hooks/use-clients';
import { ClientRecord } from '@/types/clients';
import { isApiError } from '@/types/api-response';
import { toast } from 'sonner';
import { clientService } from '@/services';

const ClientDetail = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [activeTab, setActiveTab] = useState('details');
  const [clientData, setClientData] = useState<ClientRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const { isLoading: isLoadingClient } = useClients();

  useEffect(() => {
    if (!clientId) return;
    
    clientService.getClientById(clientId)
      .then(response => {
        if (isApiError(response)) {
          toast.error(`Failed to load client: ${response.message}`);
          return;
        }
        
        const fetchedClientData = response.data as ClientRecord;
        setClientData(fetchedClientData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading client data:', error);
        toast.error(`Failed to load client: ${error.message}`);
        setLoading(false);
      });
  }, [clientId]);

  if (loading || isLoadingClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 border rounded bg-red-50 text-red-800">
          Client not found or failed to load client data.
        </div>
        <Link to="/clients" className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
          Return to Clients
        </Link>
      </div>
    );
  }

  // Now clientData is properly typed as ClientRecord
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
            <BreadcrumbPage>{clientData.business_name}</BreadcrumbPage>
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
        <h1 className="text-2xl font-bold">{clientData.business_name}</h1>
        <Button asChild variant="outline">
          <Link to={`/clients/edit/${clientId}`}>Edit Client</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Business Name</h3>
                <p className="mt-1">{clientData.business_name}</p>
              </div>
              {clientData.trading_name && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Trading Name</h3>
                  <p className="mt-1">{clientData.trading_name || clientData.business_name}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    clientData.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    clientData.status === 'On Hold' ? 'bg-yellow-100 text-yellow-800' : 
                    clientData.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {clientData.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">ABN</h3>
                  <p className="mt-1">{clientData.abn || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">ACN</h3>
                  <p className="mt-1">{clientData.acn || 'Not provided'}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Industry</h3>
                <p className="mt-1">{clientData.industry || 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Key Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Building className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{clientData.status}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <CalendarClock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Onboarding Date</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {clientData.onboarding_date 
                      ? new Date(clientData.onboarding_date).toLocaleDateString() 
                      : 'Not specified'}
                  </p>
                </div>
              </div>
              
              {clientData.phone && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Phone</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{clientData.phone}</p>
                  </div>
                </div>
              )}
              
              {/* Display primary contact if available */}
              {clientData.client_contacts && clientData.client_contacts.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Primary Contact</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {clientData.client_contacts.find(c => c.is_primary)?.name || 
                       clientData.client_contacts[0]?.name || 'No contacts'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Onboarding Date</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {clientData.onboarding_date 
                      ? new Date(clientData.onboarding_date).toLocaleDateString() 
                      : 'Not specified'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Client Status</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{clientData.status}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Last Updated</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {clientData.updated_at 
                      ? new Date(clientData.updated_at).toLocaleDateString() 
                      : 'No data'}
                  </p>
                </div>
              </div>
              
              {clientData.payment_terms && (
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Payment Terms</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{clientData.payment_terms}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">
            <Building className="h-4 w-4 mr-2" />
            Details
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
          <Card>
            <CardHeader>
              <CardTitle>Client Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Contact Information</h3>
                {clientData.client_contacts && clientData.client_contacts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {clientData.client_contacts.slice(0, 2).map((contact, index) => (
                      <div key={index} className="border p-4 rounded-md">
                        <h4 className="font-medium">{contact.name} {contact.is_primary && <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-0.5 ml-2">Primary</span>}</h4>
                        <div className="mt-2 space-y-1 text-sm">
                          {contact.position && <p className="text-muted-foreground">{contact.position}</p>}
                          {contact.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">{contact.email}</a>
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No contact information available.</p>
                )}
              </div>
              
              {/* Billing Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Billing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Billing Cycle</h4>
                    <p className="mt-1">{clientData.billing_cycle || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Payment Terms</h4>
                    <p className="mt-1">{clientData.payment_terms || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Payment Method</h4>
                    <p className="mt-1">{clientData.payment_method || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Credit Limit</h4>
                    <p className="mt-1">{clientData.credit_limit ? `$${clientData.credit_limit.toLocaleString()}` : 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4 pt-4">
                <Button asChild variant="outline">
                  <Link to={`/clients/edit/${clientData.id}`}>Edit Client</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Client Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Client contacts would be listed here */}
              <div className="mb-4">
                <Button asChild variant="outline">
                  <Link to={`/clients/${clientId}/contacts/new`}>Add Contact</Link>
                </Button>
              </div>
              
              {clientData.client_contacts && clientData.client_contacts.length > 0 ? (
                <div className="space-y-4">
                  {clientData.client_contacts.map((contact, index) => (
                    <div key={index} className="border p-4 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{contact.name}</h4>
                          {contact.is_primary && <span className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-0.5">Primary</span>}
                        </div>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                      <div className="mt-2 space-y-2 text-sm">
                        {contact.position && <p className="text-muted-foreground">{contact.position}</p>}
                        {contact.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">{contact.email}</a>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No contacts found for this client.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sites">
          <Card>
            <CardHeader>
              <CardTitle>Client Sites</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Sites information would go here */}
              <div className="mb-4">
                <Button asChild variant="outline">
                  <Link to={`/clients/${clientId}/sites/new`}>Add Site</Link>
                </Button>
              </div>
              
              <p>Site information not available.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contracts">
          <Card>
            <CardHeader>
              <CardTitle>Client Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Contracts information would go here */}
              <div className="mb-4">
                <Button asChild variant="outline">
                  <Link to={`/contracts/new?client=${clientId}`}>Add Contract</Link>
                </Button>
              </div>
              
              <p>Contract information not available.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 pt-6 border-t">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div>
            <span>Last updated: </span>
            <time dateTime={clientData.updated_at}>{clientData.updated_at ? new Date(clientData.updated_at).toLocaleString() : 'Unknown'}</time>
          </div>
          <div>
            <span>Created: </span>
            <time dateTime={clientData.created_at}>{clientData.created_at ? new Date(clientData.created_at).toLocaleString() : 'Unknown'}</time>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
