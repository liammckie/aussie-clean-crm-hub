
import React from "react";
import { 
  Card, 
  CardContent,
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
    <div className="space-y-6">
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
      {!isLoadingClients && !clientsError && !isPending && filteredClients.length > 0 ? (
        <>
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
        </>
      ) : !isLoadingClients && !clientsError && !isPending ? (
        <Card>
          <CardContent className="p-6">
            <EmptyState clearFilters={clearFilters} />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default ClientsContent;
