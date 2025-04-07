
import React, { useState, useEffect } from "react";
import { useClients } from "@/hooks/use-clients";
import { useContracts } from "@/hooks/use-contracts";
import { useSites } from "@/hooks/use-sites";
import { useClientFilters } from "@/contexts/ClientFiltersContext";

interface ClientDataProcessorProps {
  children: React.ReactNode;
}

export const getClientPrimaryAddress = (client: any) => {
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

const ClientDataProcessor: React.FC<ClientDataProcessorProps> = ({ children }) => {
  const { clients, setFilteredClients } = useClientFilters();
  const [isPending, setIsPending] = useState(true);
  const { contracts } = useContracts();
  const { sites } = useSites();
  
  useEffect(() => {
    if (!clients || !contracts || !sites) return;
    
    const enhancedClients = clients.map(client => {
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
    setIsPending(false);
  }, [clients, contracts, sites, setFilteredClients]);

  return (
    <>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { isPending });
        }
        return child;
      })}
    </>
  );
};

export default ClientDataProcessor;
