
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ClientFormData, clientService, ClientStatus } from '@/services/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { prepareClientDataForSubmission, validateBusinessIdentifiers } from '@/utils/clientUtils';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Map } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContactForm } from '@/components/client/ContactForm';
import { ContactsList } from '@/components/client/ContactsList';
import { SiteForm, SiteFormData } from '@/components/site/SiteForm';
import { useClients } from '@/hooks/use-clients';
import { useSites } from '@/hooks/use-sites';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const EditClient = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isSiteDialogOpen, setIsSiteDialogOpen] = useState(false);
  
  const { useClientDetails, createClient: addContact } = useClients();
  const { data: client, isLoading: isLoadingClient } = useClientDetails(id);
  const { 
    sites, 
    isLoadingSites, 
    createSite 
  } = useSites(id);

  const form = useForm<ClientFormData>({
    defaultValues: {
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
    },
  });

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
          form.reset({
            business_name: clientData.business_name,
            trading_name: clientData.trading_name || '',
            abn: clientData.abn || '',
            acn: clientData.acn || '',
            industry: clientData.industry || '',
            status: clientData.status,
            onboarding_date: clientData.onboarding_date ? new Date(clientData.onboarding_date).toLocaleDateString('en-CA') : undefined,
            source: clientData.source || '',
            billing_cycle: clientData.billing_cycle || '',
            payment_terms: clientData.payment_terms || '',
            payment_method: clientData.payment_method || '',
            tax_status: clientData.tax_status || '',
            credit_limit: clientData.credit_limit || undefined,
          });
          setIsLoaded(true);
        })
        .catch(error => {
          toast.error(`Failed to load client data: ${error.message}`);
        });
    }
  }, [id, form]);

  const onSubmit = async (data: ClientFormData) => {
    if (!id) {
      toast.error('Client ID is missing.');
      return;
    }

    // Validate business identifiers before submission
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

    clientService.updateClient(id, preparedData)
      .then(response => {
        if ('category' in response) {
          toast.error(response.message);
          return;
        }
        toast.success('Client updated successfully!');
        navigate('/clients');
      })
      .catch(error => {
        toast.error(`Failed to update client: ${error.message}`);
      });
  };
  
  // Handle contact submission
  const handleContactSubmit = (data: any) => {
    if (!id) return;
    
    // Add client_id to the contact data
    const contactData = { ...data, client_id: id };
    
    clientService.createClientContact(id, data)
      .then(response => {
        if ('category' in response) {
          toast.error(response.message);
          return;
        }
        toast.success('Contact added successfully!');
        setIsContactDialogOpen(false);
      })
      .catch(error => {
        toast.error(`Failed to add contact: ${error.message}`);
      });
  };
  
  // Handle site submission
  const handleSiteSubmit = (data: SiteFormData) => {
    if (!id) return;
    
    // Add client_id to the site data
    createSite({ ...data, client_id: id });
    setIsSiteDialogOpen(false);
  };

  if (!isLoaded || isLoadingClient) {
    return <div>Loading...</div>;
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
        
        {/* Client Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Edit Client</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="business_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Business Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="trading_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trading Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Trading Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="abn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ABN (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="ABN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="acn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ACN (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="ACN" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Industry" {...field} />
                        </FormControl>
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
                              <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Prospect">Prospect</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="On Hold">On Hold</SelectItem>
                            <SelectItem value="Cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="onboarding_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Onboarding Date (Optional)</FormLabel>
                        <FormControl>
                          <DatePicker
                            className={cn(
                              "w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                              field.value ? "text-foreground" : "text-muted-foreground"
                            )}
                            onSelect={field.onChange}
                            value={field.value ? new Date(field.value) : undefined}
                          />
                        </FormControl>
                        <FormDescription>
                          Date when the client was onboarded.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Source" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billing_cycle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Cycle (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Billing Cycle" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="payment_terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Terms (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Payment Terms" {...field} />
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
                        <FormLabel>Payment Method (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Payment Method" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tax_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Status (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Tax Status" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="credit_limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credit Limit (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Credit Limit" 
                            {...field} 
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Update Client</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contacts Tab */}
        <TabsContent value="contacts">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Client Contacts</CardTitle>
              <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="ml-2" size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                  </DialogHeader>
                  <ContactForm onSubmit={handleContactSubmit} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {client?.client_contacts && client.client_contacts.length > 0 ? (
                <ContactsList contacts={client.client_contacts} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No contacts have been added yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsContactDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first contact
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sites Tab */}
        <TabsContent value="sites">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Client Sites</CardTitle>
              <Dialog open={isSiteDialogOpen} onOpenChange={setIsSiteDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="ml-2" size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add Site
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Site</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[80vh] overflow-y-auto py-4">
                    <SiteForm onSubmit={handleSiteSubmit} />
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoadingSites ? (
                <div className="text-center py-8">Loading sites...</div>
              ) : sites && sites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sites.map((site) => (
                    <Card key={site.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{site.site_name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <p className="text-muted-foreground">Site Code: <span className="text-foreground">{site.site_code}</span></p>
                          <p className="text-muted-foreground">Address: <span className="text-foreground">
                            {site.address_line_1}
                            {site.address_line_2 && `, ${site.address_line_2}`}, 
                            {site.suburb}, {site.state} {site.postcode}
                          </span></p>
                          {site.site_type && (
                            <p className="text-muted-foreground">Type: <span className="text-foreground capitalize">{site.site_type}</span></p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No sites have been added yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsSiteDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first site
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditClient;
