import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  SearchX, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  User,
  Building,
  CalendarClock
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { mockClients } from "@/data/mockClients";

// Status badge color mapping
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

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState(mockClients);

  // Filter clients based on search term
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    
    if (value === "") {
      setFilteredClients(mockClients);
    } else {
      const filtered = mockClients.filter(
        client => 
          client.businessName.toLowerCase().includes(value) ||
          client.tradingName.toLowerCase().includes(value) ||
          client.abn.includes(value) ||
          client.primaryContact.toLowerCase().includes(value) ||
          client.email.toLowerCase().includes(value)
      );
      setFilteredClients(filtered);
    }
  };

  return (
    <div className="container mx-auto px-0 max-w-full">
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
            <BreadcrumbPage>Clients</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Button asChild>
          <Link to="/clients/new">
            <Plus className="mr-2 h-4 w-4" /> New Client
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Client Management</CardTitle>
          <CardDescription>
            Manage client information, contacts, sites, and contracts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full sm:w-auto flex-1">
              <Input
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search clients..."
                className="pl-10"
              />
              <div className="absolute left-3 top-3 text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>All</DropdownMenuItem>
                  <DropdownMenuItem>Active</DropdownMenuItem>
                  <DropdownMenuItem>Prospect</DropdownMenuItem>
                  <DropdownMenuItem>On Hold</DropdownMenuItem>
                  <DropdownMenuItem>Cancelled</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Client Table */}
          {filteredClients.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Business Name</TableHead>
                    <TableHead>ABN</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Primary Contact</TableHead>
                    <TableHead>Sites</TableHead>
                    <TableHead>Contracts</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        <Link 
                          to={`/clients/${client.id}`} 
                          className="hover:underline flex items-center gap-2"
                        >
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div>{client.businessName}</div>
                            {client.tradingName !== client.businessName && (
                              <div className="text-xs text-muted-foreground">
                                Trading as: {client.tradingName}
                              </div>
                            )}
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>{client.abn}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div>{client.primaryContact}</div>
                            <div className="text-xs text-muted-foreground">{client.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{client.sites}</TableCell>
                      <TableCell>{client.contracts}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/clients/${client.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/clients/${client.id}/edit`}>Edit Client</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Create Quote</DropdownMenuItem>
                            <DropdownMenuItem>Create Contract</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No clients found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any clients matching your search criteria.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setFilteredClients(mockClients);
              }}>Clear Search</Button>
            </div>
          )}

          {/* Client Cards for Mobile View - This would be shown only on small screens */}
          <div className="sm:hidden mt-4 flex flex-col gap-4">
            {filteredClients.map((client) => (
              <Card key={client.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{client.businessName}</h3>
                      <p className="text-sm text-muted-foreground">{client.tradingName}</p>
                    </div>
                    <Badge className={getStatusColor(client.status)}>
                      {client.status}
                    </Badge>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{client.primaryContact}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                      <span>Client since {new Date(client.onboardingDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sites: {client.sites}</span>
                      <span>Contracts: {client.contracts}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/clients/${client.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
