
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { useClients } from "@/hooks/use-clients";
import { useContracts } from "@/hooks/use-contracts";
import { useSites } from "@/hooks/use-sites";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientsGrid } from "@/components/clients/ClientsGrid";
import { ClientsSummary } from "@/components/clients/ClientsSummary";
import { ClientsToolbar } from "@/components/clients/ClientsToolbar";
import { ClientsEmptyState } from "@/components/clients/ClientsEmptyState";
import { ClientsLoadingState } from "@/components/clients/ClientsLoadingState";
import { ClientsErrorState } from "@/components/clients/ClientsErrorState";
import { useClientFilters } from "@/contexts/ClientFiltersContext";
import { ClientRecord } from "@/types/clients";
import { AppLogger, LogCategory } from "@/utils/logging";

export function ClientsDashboard() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const { useOptimizedClients } = useClients();
  const { data: clientsData, isLoading, error, refetch } = useOptimizedClients();
  
  const { contracts } = useContracts();
  const { sites } = useSites();
  const { 
    searchTerm, 
    activeStatusFilter, 
    filteredClients, 
    setSearchTerm, 
    setActiveStatusFilter, 
    clearFilters,
    setClients,
    setFilteredClients
  } = useClientFilters();
  
  // Process clients data with related information when it's available
  React.useEffect(() => {
    if (!clientsData || !contracts || !sites) return;
    
    try {
      // Get the typed client data from the API response
      const clients = clientsData as ClientRecord[];
      
      // Set the base clients in the context
      setClients(clients);
      
      // Enhance clients with calculated metrics
      const enhancedClients = clients.map(client => {
        // Calculate annual revenue (sum of all contracts' total_annual_value)
        const clientContracts = contracts.filter(c => c.client_id === client.id);
        const annual_revenue = clientContracts.reduce((sum, contract) => {
          return sum + (contract.total_annual_value || 0);
        }, 0);
        
        // Calculate site count
        const clientSites = sites.filter(s => s.client_id === client.id);
        const site_count = clientSites.length;
        
        // Calculate primary address display
        const addressParts = [
          client.address_line_1,
          client.suburb,
          client.state,
          client.postcode
        ].filter(Boolean);
        const displayAddress = addressParts.length > 0 ? addressParts.join(", ") : "-";
        
        // Return client with added properties
        return {
          ...client,
          annual_revenue,
          site_count,
          displayAddress
        };
      });
      
      // Update filtered clients in the context
      setFilteredClients(enhancedClients);
      
      AppLogger.info(LogCategory.CLIENT, `Processed ${enhancedClients.length} clients`);
    } catch (error) {
      AppLogger.error(LogCategory.CLIENT, "Error processing client data", { error });
      console.error("Error processing client data:", error);
    }
  }, [clientsData, contracts, sites, setClients, setFilteredClients]);

  const handleRefetch = () => {
    AppLogger.info(LogCategory.CLIENT, "Manually refetching client data");
    refetch();
  };

  // Handle loading state
  if (isLoading) {
    return <ClientsLoadingState />;
  }

  // Handle error state
  if (error) {
    return <ClientsErrorState error={error} refetch={handleRefetch} />;
  }

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <ClientsSummary clients={filteredClients} />
      
      {/* Toolbar with Search, Filters, and View Toggle */}
      <ClientsToolbar
        searchTerm={searchTerm}
        activeStatusFilter={activeStatusFilter}
        viewMode={viewMode}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setActiveStatusFilter}
        onViewModeChange={setViewMode}
        onRefresh={handleRefetch}
        onClearFilters={clearFilters}
      />
      
      {/* Client Listing */}
      {filteredClients.length > 0 ? (
        <>
          {/* Table View (Desktop) */}
          {viewMode === 'table' && (
            <div className="hidden md:block">
              <ClientsTable clients={filteredClients} />
            </div>
          )}
          
          {/* Grid View (Desktop) or Mobile View */}
          {(viewMode === 'grid' || true) && (
            <div className={`${viewMode === 'table' ? 'md:hidden' : ''}`}>
              <ClientsGrid clients={filteredClients} />
            </div>
          )}
        </>
      ) : (
        <Card className="p-6">
          <ClientsEmptyState searchTerm={searchTerm} onClearFilters={clearFilters} />
        </Card>
      )}
    </div>
  );
}
