
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { useClients } from "@/hooks/use-clients";
import ClientsTable from "@/components/clients/ClientsTable";
import ClientCards from "@/components/clients/ClientCards";
import SearchFilterBar from "@/components/clients/SearchFilterBar";
import EmptyState from "@/components/clients/EmptyState";
import LoadingState from "@/components/clients/LoadingState";
import ErrorState from "@/components/clients/ErrorState";
import { getStatusColor, formatDate } from "@/components/clients/utils/StatusBadgeUtil";
import { useClientFilters } from "@/contexts/ClientFiltersContext";
import { getClientPrimaryAddress } from "./ClientDataProcessor";
import { useTransition } from "react";

interface ClientsContentProps {
  isPending?: boolean;
}

const ClientsContent: React.FC<ClientsContentProps> = ({ isPending = false }) => {
  const { isLoadingClients, clientsError, refetchClients } = useClients();
  const { 
    searchTerm, 
    activeStatusFilter, 
    filteredClients, 
    setSearchTerm, 
    setActiveStatusFilter, 
    clearFilters 
  } = useClientFilters();
  
  const [_, startTransition] = useTransition();

  // Process clients for display
  const displayClients = React.useMemo(() => {
    if (filteredClients.length === 0) return [];
    
    return filteredClients.map(client => ({
      ...client,
      displayAddress: getClientPrimaryAddress(client)
    }));
  }, [filteredClients]);

  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Handle status filter
  const handleStatusFilter = (status: string | null) => {
    setActiveStatusFilter(status === activeStatusFilter ? null : status);
  };

  // Handle safe refetching
  const handleRefetch = () => {
    startTransition(() => {
      refetchClients();
    });
  };

  return (
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
          refetchClients={handleRefetch}
        />

        {/* Loading State */}
        {(isLoadingClients || isPending) && <LoadingState />}

        {/* Error State */}
        {clientsError && !isPending && <ErrorState error={clientsError} refetch={handleRefetch} />}

        {/* Client Table */}
        {!isLoadingClients && !clientsError && !isPending && displayClients.length > 0 ? (
          <div>
            {/* Desktop View */}
            <div className="hidden sm:block">
              <ClientsTable 
                clients={displayClients} 
                formatDate={formatDate}
                getStatusColor={getStatusColor} 
              />
            </div>
            
            {/* Mobile View */}
            <div className="sm:hidden">
              <ClientCards 
                clients={displayClients}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
              />
            </div>
          </div>
        ) : !isLoadingClients && !clientsError && !isPending ? (
          <EmptyState clearFilters={clearFilters} />
        ) : null}
      </CardContent>
    </Card>
  );
};

export default ClientsContent;
