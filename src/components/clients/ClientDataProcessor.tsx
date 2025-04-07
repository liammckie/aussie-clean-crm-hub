
import React, { useEffect, useTransition } from "react";
import { useClientFilters } from "@/contexts/ClientFiltersContext";
import { useClients } from "@/hooks/use-clients";
import { ClientRecord } from "@/types/clients";
import { AppLogger, LogCategory } from '@/utils/logging';

interface ClientDataProcessorProps {
  children: React.ReactNode;
}

export const getClientPrimaryAddress = (client: any) => {
  if (client.address_line_1) {
    let address = client.address_line_1;
    if (client.suburb) address += `, ${client.suburb}`;
    if (client.state) address += `, ${client.state}`;
    if (client.postcode) address += ` ${client.postcode}`;
    return address;
  } else if (client.client_addresses && client.client_addresses.length > 0) {
    const primaryAddress = client.client_addresses[0];
    let address = primaryAddress.street;
    if (primaryAddress.suburb) address += `, ${primaryAddress.suburb}`;
    if (primaryAddress.state) address += `, ${primaryAddress.state}`;
    if (primaryAddress.postcode) address += ` ${primaryAddress.postcode}`;
    return address;
  }
  return "No address";
};

const ClientDataProcessor: React.FC<ClientDataProcessorProps> = ({ children }) => {
  const [isPending, startTransition] = useTransition();
  const { clients, isLoadingClients, clientsError } = useClients();
  const { 
    searchTerm, 
    activeStatusFilter, 
    setFilteredClients 
  } = useClientFilters();

  // Filter clients based on search term and status
  const filterClients = () => {
    if (!clients) return;
    
    startTransition(() => {
      let filtered = [...(clients as ClientRecord[])];
      
      // Apply search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filtered = filtered.filter(
          client => 
            client.business_name?.toLowerCase().includes(search) ||
            client.trading_name?.toLowerCase().includes(search) ||
            client.abn?.includes(search) ||
            client.industry?.toLowerCase().includes(search) ||
            // Address fields for search
            client.address_line_1?.toLowerCase().includes(search) ||
            client.address_line_2?.toLowerCase().includes(search) ||
            client.suburb?.toLowerCase().includes(search) ||
            client.state?.toLowerCase().includes(search) ||
            client.postcode?.includes(search) ||
            // Client address relation search
            client.client_addresses?.some(addr => 
              addr.street?.toLowerCase().includes(search) || 
              addr.suburb?.toLowerCase().includes(search) ||
              addr.state?.toLowerCase().includes(search) ||
              addr.postcode?.includes(search)
            )
        );
      }
      
      // Apply status filter
      if (activeStatusFilter) {
        filtered = filtered.filter(client => client.status === activeStatusFilter);
      }
      
      setFilteredClients(filtered);
    });
  };

  // Update filters when clients data or filters change
  useEffect(() => {
    AppLogger.debug(LogCategory.UI, "Updating client filters", { 
      clientsCount: clients?.length || 0,
      searchTerm,
      activeStatusFilter
    });
    
    if (clients) {
      filterClients();
    }
  }, [clients, searchTerm, activeStatusFilter]);

  // Pass the isPending state to the children
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { isPending });
    }
    return child;
  });

  return <>{childrenWithProps}</>;
};

export default ClientDataProcessor;
