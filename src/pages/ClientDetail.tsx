
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
  CalendarClock,
  DollarSign,
  Percent,
} from 'lucide-react';
import { useClients } from '@/hooks/use-clients';
import { ClientRecord } from '@/types/clients';
import { isApiError } from '@/types/api-response';
import { toast } from 'sonner';
import { clientService } from '@/services';
import { useClientSites } from '@/hooks/use-sites';

const ClientDetail = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [activeTab, setActiveTab] = useState('details');
  const [clientData, setClientData] = useState<ClientRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const { isLoading: isLoadingClient } = useClients();
  const { sites } = useClientSites(clientId || '');
  
  // Calculate financial metrics for the client
  const [financialMetrics, setFinancialMetrics] = useState({
    totalSites: 0,
    annualRevenue: 0,
    annualCost: 0,
    grossProfit: 0,
    grossProfitMargin: 0
  });

  useEffect(() => {
    if (sites && sites.length > 0) {
      // In a real application, we would calculate these metrics based on actual data
      // For now, let's use dummy values based on the number of sites
      const siteCount = sites.length;
      const avgRevenuePerSite = 50000;  // Example average annual revenue per site
      const avgCostPerSite = 35000;     // Example average annual cost per site
      
      const totalRevenue = siteCount * avgRevenuePerSite;
      const totalCost = siteCount * avgCostPerSite;
      const profit = totalRevenue - totalCost;
      const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
      
      setFinancialMetrics({
        totalSites: siteCount,
        annualRevenue: totalRevenue,
        annualCost: totalCost,
        grossProfit: profit,
        grossProfitMargin: profitMargin
      });
    }
  }, [sites]);

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
                  <p className="mt-1">{clientData.trading_name}</p>
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
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Industry</h3>
                <p className="mt-1">{clientData.industry || 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Map className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Sites</h3>
                  <p className="mt-1 text-lg font-semibold">{financialMetrics.totalSites}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Annual Revenue</h3>
                  <p className="mt-1 text-lg font-semibold text-green-600">
                    ${financialMetrics.annualRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Annual Cost</h3>
                  <p className="mt-1 text-lg font-semibold text-red-600">
                    ${financialMetrics.annualCost.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Percent className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Gross Profit</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-lg font-semibold">
                      ${financialMetrics.grossProfit.toLocaleString()}
                    </p>
                    <span className="text-sm font-medium bg-green-100 text-green-800 px-2 py-0.5 rounded">
                      {financialMetrics.grossProfitMargin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
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
              {/* Detailed Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">ABN</h4>
                    <p className="mt-1">{clientData.abn || 'Not provided'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">ACN</h4>
                    <p className="mt-1">{clientData.acn || 'Not provided'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Industry</h4>
                    <p className="mt-1">{clientData.industry || 'Not specified'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Onboarding Date</h4>
                    <p className="mt-1">
                      {clientData.onboarding_date 
                        ? new Date(clientData.onboarding_date).toLocaleDateString() 
                        : 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
              
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
              
              {sites && sites.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Name</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sites.map((site) => (
                        <tr key={site.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{site.site_name}</div>
                            <div className="text-sm text-gray-500">{site.site_code}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{site.address_line_1}</div>
                            <div className="text-sm text-gray-500">{site.suburb}, {site.state}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              site.status === 'active' ? 'bg-green-100 text-green-800' : 
                              site.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {site.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link 
                              to={`/sites/${site.id}`} 
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              View
                            </Link>
                            <Link 
                              to={`/sites/${site.id}/edit`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No sites found for this client.</p>
              )}
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
