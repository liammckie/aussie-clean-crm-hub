
import React, { useState, useEffect } from "react";
import { useClients } from "@/hooks/use-clients";
import { useContracts } from "@/hooks/use-contracts";
import { useSites } from "@/hooks/use-sites";
import { useClientFilters } from "@/contexts/ClientFiltersContext";
import { ClientRecord } from "@/types/clients";

interface ClientDataProcessorProps {
  children: React.ReactNode;
}

export const getClientPrimaryAddress = (client: ClientRecord) => {
  // Extract address parts
  const addressParts = [
    client.address_line_1,
    client.suburb,
    client.state,
    client.postcode
  ].filter(Boolean);
  
  // Join the address parts with commas
  return addressParts.length > 0 ? addressParts.join(", ") : "-";
};

// Interface for components that can accept isPending prop
interface WithPendingProp {
  isPending?: boolean;
}

const ClientDataProcessor: React.FC<ClientDataProcessorProps> = ({ children }) => {
  const { clients: fetchedClients, setFilteredClients, setClients } = useClientFilters();
  const [isProcessing, setIsProcessing] = useState(true);
  const { contracts } = useContracts();
  const { sites } = useSites();
  const { clients: apiClients } = useClients();
  
  // Set the initial clients from the API
  useEffect(() => {
    if (apiClients && apiClients.length > 0) {
      setClients(apiClients);
    }
  }, [apiClients, setClients]);
  
  useEffect(() => {
    if (!fetchedClients || !contracts || !sites) return;
    
    const enhancedClients = fetchedClients.map(client => {
      // Calculate annual revenue (sum of all contracts' total_annual_value)
      const clientContracts = contracts ? contracts.filter(c => c.client_id === client.id) : [];
      const annual_revenue = clientContracts.reduce((sum, contract) => {
        return sum + (contract.total_annual_value || 0);
      }, 0);
      
      // Calculate site count
      const clientSites = sites ? sites.filter(s => s.client_id === client.id) : [];
      const site_count = clientSites.length;
      
      // Return client with added properties
      return {
        ...client,
        annual_revenue,
        site_count,
        displayAddress: getClientPrimaryAddress(client)
      };
    });
    
    setFilteredClients(enhancedClients);
    setIsProcessing(false);
  }, [fetchedClients, contracts, sites, setFilteredClients]);

  // Fix the TypeScript error by properly typing and cloning children
  return (
    <>
      {React.Children.map(children, child => {
        // Check if the child is a valid React element
        if (React.isValidElement<WithPendingProp>(child)) {
          // Now TypeScript knows we can pass isPending to this child
          return React.cloneElement(child, {
            isPending: isProcessing
          });
        }
        return child;
      })}
    </>
  );
};

export default ClientDataProcessor;
