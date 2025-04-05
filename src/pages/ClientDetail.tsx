import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Building,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Tag,
  ClipboardList,
  FileText,
  Edit,
  ArrowLeft,
  User,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useClients } from "@/hooks/use-clients";
import { useClientRealtimeSync } from "@/hooks/use-realtime-sync";
import { useUnifiedEntities } from "@/hooks/use-unified-entities";
import { UnifiedContactForm } from "@/components/client/UnifiedContactForm";
import { toast } from "sonner";
import { UnifiedContactFormData } from "@/types/form-types";

const getStatusColor = (status: string | null | undefined) => {
  switch (status) {
    case "Active":
      return "bg-emerald-500 hover:bg-emerald-600";
    case "Prospect":
      return "bg-blue-500 hover:bg-blue-600";
    case "On Hold":
      return "bg-amber-500 hover:bg-amber-600";
    case "Cancelled":
      return "bg-slate-500 hover:bg-slate-600";
    default:
      return "bg-slate-500 hover:bg-slate-600";
  }
};

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  
  useClientRealtimeSync(id);
  
  const { useClientDetails, deleteClient, isDeletingClient } = useClients();
  const { data: client, isLoading, error, refetch } = useClientDetails(id);
  
  const { 
    useEntityContacts, 
    createContact, 
    isCreatingContact,
  } = useUnifiedEntities();
  
  const handleContactSubmit = async (data: UnifiedContactFormData) => {
    if (!id) return;
    
    try {
      await createContact(
        {
          entityType: 'client',
          entityId: id,
          contactData: {
            ...data,
            is_primary: data.is_primary ?? false
          }
        },
        {
          onSuccess: () => {
            toast.success('Contact added successfully!');
            setIsContactDialogOpen(false);
            refetch();
          },
          onError: (error: any) => {
            toast.error(`Failed to add contact: ${error.message}`);
          }
        }
      );
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error('Failed to add contact. Please try again.');
    }
  };
  
  const handleDeleteClient = async () => {
    if (!id) return;
    
    try {
      await deleteClient(id);
      navigate("/clients");
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };
  
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };
  
  const formatAddress = (client: any) => {
    const parts = [];
    if (client.address_line_1) parts.push(client.address_line_1);
    if (client.address_line_2) parts.push(client.address_line_2);
    
    let cityStatePostcode = '';
    if (client.suburb) cityStatePostcode += client.suburb;
    if (client.state) {
      cityStatePostcode += cityStatePostcode ? `, ${client.state}` : client.state;
    }
    if (client.postcode) {
      cityStatePostcode += cityStatePostcode ? ` ${client.postcode}` : client.postcode;
    }
    
    if (cityStatePostcode) parts.push(cityStatePostcode);
    if (client.country && client.country !== 'Australia') parts.push(client.country);
    
    return parts.length > 0 ? parts.join(', ') : 'No address on file';
  };
  
  const renderPrimaryAddress = (client: any) => {
    const hasAddress = client.address_line_1 || client.address_line_2 || client.suburb || client.state || client.postcode;
    
    if (hasAddress) {
      return (
        <div className="space-y-1">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <div>
              {client.address_line_1 && <div>{client.address_line_1}</div>}
              {client.address_line_2 && <div>{client.address_line_2}</div>}
              <div>
                {client.suburb && `${client.suburb}, `}
                {client.state && client.state} 
                {client.postcode && client.postcode}
              </div>
              {client.country && client.country !== 'Australia' && <div>{client.country}</div>}
            </div>
          </div>
        </div>
      );
    } else if (client.client_addresses && client.client_addresses.length > 0) {
      const primaryAddress = client.client_addresses[0];
      return (
        <div className="space-y-1">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <div>
              <div>{primaryAddress.street}</div>
              {primaryAddress.street_2 && <div>{primaryAddress.street_2}</div>}
              <div>
                {primaryAddress.suburb}, {primaryAddress.state} {primaryAddress.postcode}
              </div>
              {primaryAddress.country !== 'Australia' && <div>{primaryAddress.country}</div>}
              <Badge variant="outline" className="mt-1">
                {primaryAddress.address_type.charAt(0).toUpperCase() + primaryAddress.address_type.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-muted-foreground">No address information available</div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-lg text-muted-foreground">Loading client data...</span>
      </div>
    );
  }
  
  if (error || !client) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center rounded-full bg-red-100 p-6 mb-5">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Client Not Found</h2>
          <p className="mb-4 text-muted-foreground">
            {error?.message || "The client you're looking for doesn't exist or has been removed."}
          </p>
          <Button asChild>
            <Link to="/clients">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0 max-w-full">
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
            <BreadcrumbPage>{client.business_name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-semibold">
                {client.business_name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{client.business_name}</h1>
                {client.trading_name && client.trading_name !== client.business_name && (
                  <p className="text-muted-foreground">Trading as: {client.trading_name}</p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className={getStatusColor(client.status)}>
                {client.status}
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <Link to={`/clients/${client.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Client
                </Link>
              </Button>
              
              <AlertDialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the client
                      and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteClient}
                      disabled={isDeletingClient}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeletingClient ? "Deleting..." : "Delete Client"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button variant="outline" size="sm">
                Create Quote
              </Button>
              <Button size="sm">
                Create Contract
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 lg:w-fit">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
                <CardDescription>Basic details about this client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Business Name</h4>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{client.business_name}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Trading Name</h4>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{client.trading_name || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">ABN</h4>
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      <span>{client.abn || "N/A"}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">ACN</h4>
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      <span>{client.acn || "N/A"}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Industry</h4>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span>{client.industry || "N/A"}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Client Since</h4>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(client.onboarding_date)}</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Address</h4>
                  {renderPrimaryAddress(client)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Primary Contact</CardTitle>
                  <CardDescription>Main point of contact for this client</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={() => setIsContactDialogOpen(true)}>
                  <User className="mr-2 h-4 w-4" /> Add Contact
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {client.client_contacts && client.client_contacts.length > 0 ? (
                  <div className="space-y-4">
                    {client.client_contacts
                      .filter(contact => contact.is_primary)
                      .map(contact => (
                        <div key={contact.id}>
                          <div className="flex items-center gap-3">
                            <div className="bg-slate-700 text-white rounded-full w-10 h-10 flex items-center justify-center">
                              <User className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">{contact.name}</h4>
                              <p className="text-sm text-muted-foreground">{contact.position || "Primary Contact"}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3 mt-2">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{contact.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{contact.phone || contact.mobile || "N/A"}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center border rounded-md border-dashed">
                    <User className="h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-medium mb-1">No primary contact</h3>
                    <p className="text-sm text-muted-foreground mb-4">Add contact information for this client</p>
                    <Button size="sm" variant="outline" onClick={() => setIsContactDialogOpen(true)}>Add Contact</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Quick Overview</CardTitle>
                <CardDescription>Summary of client relationship</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/40 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Client Since</h3>
                    <p className="text-2xl font-bold">{formatDate(client.onboarding_date)}</p>
                  </div>
                  <div className="bg-slate-800/40 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <div className="mt-1">
                      <Badge className={getStatusColor(client.status)}>
                        {client.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="bg-slate-800/40 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Last Activity</h3>
                    <p className="text-2xl font-bold">
                      {formatDate(client.updated_at) || "N/A"}
                    </p>
                  </div>
                  <div className="bg-slate-800/40 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Payment Terms</h3>
                    <p className="text-2xl font-bold">{client.payment_terms || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="contacts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Client Contacts</CardTitle>
                <CardDescription>Manage all contacts associated with this client</CardDescription>
              </div>
              <Button size="sm" onClick={() => setIsContactDialogOpen(true)}>
                <User className="mr-2 h-4 w-4" /> Add Contact
              </Button>
            </CardHeader>
            <CardContent>
              {client.client_contacts && client.client_contacts.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.client_contacts.map(contact => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contact.position || "-"}</TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.phone || contact.mobile || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={contact.is_primary ? "default" : "outline"}>
                            {contact.contact_type}
                            {contact.is_primary ? " (Primary)" : ""}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md border-dashed">
                  <User className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
                  <p className="text-muted-foreground mb-4">
                    This client doesn't have any contacts yet.
                  </p>
                  <Button>Add First Contact</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sites">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Client Sites</CardTitle>
                <CardDescription>Locations where services are provided</CardDescription>
              </div>
              <Button size="sm">
                <MapPin className="mr-2 h-4 w-4" /> Add Site
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md border-dashed">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sites yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add the first site for this client to start managing services
                </p>
                <Button>Add First Site</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contracts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Contracts</CardTitle>
                <CardDescription>Active and historical service agreements</CardDescription>
              </div>
              <Button size="sm">
                <FileText className="mr-2 h-4 w-4" /> New Contract
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md border-dashed">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No contracts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create the first contract for this client to start tracking services
                </p>
                <Button>Create First Contract</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Financial settings and payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Payment Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Billing Cycle</h4>
                      <p>{client.billing_cycle || "Not set"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Payment Terms</h4>
                      <p>{client.payment_terms || "Not set"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Payment Method</h4>
                      <p>{client.payment_method || "Not set"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Credit Limit</h4>
                      <p>{client.credit_limit ? `$${client.credit_limit}` : "Not set"}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4" asChild>
                    <Link to={`/clients/${client.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Settings
                    </Link>
                  </Button>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Recent Invoices</h3>
                  <div className="flex flex-col items-center justify-center py-8 text-center border rounded-md border-dashed">
                    <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-medium mb-1">No invoices yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Invoices will appear here when contracts are created
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Client Documents</CardTitle>
                <CardDescription>Contracts, agreements, certificates and other files</CardDescription>
              </div>
              <Button size="sm">
                <FileText className="mr-2 h-4 w-4" /> Upload Document
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center border rounded-md border-dashed">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload important documents related to this client
                </p>
                <Button>Upload Document</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Recent interactions with this client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-0.5 h-6 w-6 rounded-full border border-white/20 bg-slate-800 flex items-center justify-center">
                    <Edit className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Client details updated</p>
                    <p className="text-xs text-muted-foreground">{formatDate(client.updated_at)}</p>
                    <div className="mt-2 rounded border p-2">
                      <p className="text-sm">Client information was modified</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="mt-0.5 h-6 w-6 rounded-full border border-white/20 bg-slate-800 flex items-center justify-center">
                    <User className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Client created</p>
                    <p className="text-xs text-muted-foreground">{formatDate(client.created_at)}</p>
                    <div className="mt-2 rounded border p-2">
                      <p className="text-sm">New client record was created</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <UnifiedContactForm 
            onSubmit={handleContactSubmit}
            isLoading={isCreatingContact}
            contactTypes={['Primary', 'Billing', 'Operations', 'Emergency']}
            buttonText="Add Contact"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDetail;
