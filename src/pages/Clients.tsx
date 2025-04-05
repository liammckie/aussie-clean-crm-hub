
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useClients } from '@/hooks/use-clients';
import ClientsTable from "@/components/clients/ClientsTable";
import ClientCards from "@/components/clients/ClientCards";
import SearchFilterBar from "@/components/clients/SearchFilterBar";
import EmptyState from "@/components/clients/EmptyState";
import LoadingState from "@/components/clients/LoadingState";
import ErrorState from "@/components/clients/ErrorState";
import { getStatusColor, formatDate } from "@/components/clients/utils/StatusBadgeUtil";

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { clients, isLoadingClients, clientsError, refetchClients } = useClients();
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(null);

  // Filter clients based on search term and status
  const filterClients = () => {
    if (!clients) return;
    
    let filtered = [...clients];
    
    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        client => 
          client.business_name?.toLowerCase().includes(search) ||
          client.trading_name?.toLowerCase().includes(search) ||
          client.abn?.includes(search) ||
          client.industry?.toLowerCase().includes(search) ||
          // Add address fields to search
          client.address_line_1?.toLowerCase().includes(search) ||
          client.address_line_2?.toLowerCase().includes(search) ||
          client.suburb?.toLowerCase().includes(search) ||
          client.state?.toLowerCase().includes(search) ||
          client.postcode?.includes(search)
      );
    }
    
    // Apply status filter
    if (activeStatusFilter) {
      filtered = filtered.filter(client => client.status === activeStatusFilter);
    }
    
    setFilteredClients(filtered);
  };

  // Update filters when clients data or filters change
  useEffect(() => {
    if (clients) {
      filterClients();
    }
  }, [clients, searchTerm, activeStatusFilter]);

  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Handle status filter
  const handleStatusFilter = (status: string | null) => {
    setActiveStatusFilter(status === activeStatusFilter ? null : status);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setActiveStatusFilter(null);
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
          <SearchFilterBar
            searchTerm={searchTerm}
            activeStatusFilter={activeStatusFilter}
            handleSearch={handleSearch}
            handleStatusFilter={handleStatusFilter}
            refetchClients={refetchClients}
          />

          {/* Loading State */}
          {isLoadingClients && <LoadingState />}

          {/* Error State */}
          {clientsError && <ErrorState error={clientsError} refetch={refetchClients} />}

          {/* Client Table */}
          {!isLoadingClients && !clientsError && filteredClients.length > 0 ? (
            <div>
              {/* Desktop View */}
              <div className="hidden sm:block">
                <ClientsTable 
                  clients={filteredClients} 
                  formatDate={formatDate}
                  getStatusColor={getStatusColor} 
                />
              </div>
              
              {/* Mobile View */}
              <div className="sm:hidden">
                <ClientCards 
                  clients={filteredClients}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                />
              </div>
            </div>
          ) : !isLoadingClients && !clientsError ? (
            <EmptyState clearFilters={clearFilters} />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
