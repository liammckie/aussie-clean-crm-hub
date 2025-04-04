
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { mockClients } from "@/data/mockClients"; // We'll create this file next

const getStatusColor = (status: string) => {
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
  const [activeTab, setActiveTab] = useState("overview");
  
  // Find client by ID from mock data
  const client = mockClients.find(client => client.id === id);
  
  if (!client) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Client Not Found</h2>
          <p className="mb-4 text-muted-foreground">
            The client you're looking for doesn't exist or has been removed.
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
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/clients">Clients</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{client.businessName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Client Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-semibold">
                {client.businessName.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{client.businessName}</h1>
                {client.tradingName !== client.businessName && (
                  <p className="text-muted-foreground">Trading as: {client.tradingName}</p>
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

      {/* Tabs Navigation */}
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
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Info Card */}
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
                      <span>{client.businessName}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Trading Name</h4>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{client.tradingName}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">ABN</h4>
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-muted-foreground" />
                      <span>{client.abn}</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Industry</h4>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span>{client.industry}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Client Since</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(client.onboardingDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Primary Contact</CardTitle>
                <CardDescription>Main point of contact for this client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-700 text-white rounded-full w-10 h-10 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">{client.primaryContact}</h4>
                    <p className="text-sm text-muted-foreground">Primary Contact</p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{client.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Stats Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Quick Overview</CardTitle>
                <CardDescription>Summary of client relationship</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/40 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Sites</h3>
                    <p className="text-2xl font-bold">{client.sites}</p>
                  </div>
                  <div className="bg-slate-800/40 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Active Contracts</h3>
                    <p className="text-2xl font-bold">{client.contracts}</p>
                  </div>
                  <div className="bg-slate-800/40 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Last Activity</h3>
                    <p className="text-2xl font-bold">3 days ago</p>
                  </div>
                  <div className="bg-slate-800/40 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Revenue YTD</h3>
                    <p className="text-2xl font-bold">$45,250</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Contacts Tab */}
        <TabsContent value="contacts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Client Contacts</CardTitle>
                <CardDescription>Manage all contacts associated with this client</CardDescription>
              </div>
              <Button size="sm">
                <User className="mr-2 h-4 w-4" /> Add Contact
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{client.primaryContact}</TableCell>
                    <TableCell>Primary Contact</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Jane Wilson</TableCell>
                    <TableCell>Financial Officer</TableCell>
                    <TableCell>j.wilson@example.com</TableCell>
                    <TableCell>0412 987 654</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sites Tab */}
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Main Office</TableCell>
                    <TableCell>123 Business Ave, Sydney NSW 2000</TableCell>
                    <TableCell>Office</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Warehouse B</TableCell>
                    <TableCell>45 Industrial Dr, Wetherill Park NSW 2164</TableCell>
                    <TableCell>Warehouse</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contracts Tab */}
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract ID</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">C-2023-001</TableCell>
                    <TableCell>Office Cleaning</TableCell>
                    <TableCell>01/06/2023</TableCell>
                    <TableCell>31/05/2024</TableCell>
                    <TableCell>$24,000</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">C-2023-015</TableCell>
                    <TableCell>Warehouse Maintenance</TableCell>
                    <TableCell>15/07/2023</TableCell>
                    <TableCell>14/07/2024</TableCell>
                    <TableCell>$18,500</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-500">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Billing Tab */}
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
                      <p>Monthly</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Payment Terms</h4>
                      <p>Net 14</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Payment Method</h4>
                      <p>Direct Debit</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Credit Limit</h4>
                      <p>$10,000</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Edit className="mr-2 h-4 w-4" /> Edit Settings
                  </Button>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Recent Invoices</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>INV-2023-042</TableCell>
                        <TableCell>15/03/2023</TableCell>
                        <TableCell>$2,450</TableCell>
                        <TableCell>
                          <Badge>Paid</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>INV-2023-036</TableCell>
                        <TableCell>15/02/2023</TableCell>
                        <TableCell>$2,450</TableCell>
                        <TableCell>
                          <Badge>Paid</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <Button variant="outline" size="sm" className="mt-4">View All Invoices</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Documents Tab */}
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Service Agreement</TableCell>
                    <TableCell>Contract</TableCell>
                    <TableCell>15/05/2023</TableCell>
                    <TableCell>14/05/2024</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Insurance Certificate</TableCell>
                    <TableCell>Certificate</TableCell>
                    <TableCell>10/01/2023</TableCell>
                    <TableCell>10/01/2024</TableCell>
                    <TableCell className="flex gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Activity Tab */}
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
                    <FileText className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Contract C-2023-015 created</p>
                    <p className="text-xs text-muted-foreground">15/07/2023 at 10:34 AM by John Doe</p>
                    <div className="mt-2 rounded border p-2">
                      <p className="text-sm">Warehouse Maintenance contract added with annual value of $18,500</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="mt-0.5 h-6 w-6 rounded-full border border-white/20 bg-slate-800 flex items-center justify-center">
                    <Mail className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email communication</p>
                    <p className="text-xs text-muted-foreground">10/07/2023 at 2:15 PM by Jane Smith</p>
                    <div className="mt-2 rounded border p-2">
                      <p className="text-sm">Sent quote proposal for warehouse maintenance services.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="mt-0.5 h-6 w-6 rounded-full border border-white/20 bg-slate-800 flex items-center justify-center">
                    <Phone className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone call</p>
                    <p className="text-xs text-muted-foreground">05/07/2023 at 11:20 AM by John Doe</p>
                    <div className="mt-2 rounded border p-2">
                      <p className="text-sm">Discussed potential expansion of services to include warehouse site.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="mt-6">
                Show More Activity
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetail;
