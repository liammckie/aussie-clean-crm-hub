
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ClientRecord } from '@/types/clients';

interface ClientFiltersContextProps {
  searchTerm: string;
  activeStatusFilter: string | null;
  clients: ClientRecord[];
  filteredClients: ClientRecord[];
  setSearchTerm: (term: string) => void;
  setActiveStatusFilter: (status: string | null) => void;
  clearFilters: () => void;
  setClients: (clients: ClientRecord[]) => void;
  setFilteredClients: (clients: ClientRecord[]) => void;
}

const ClientFiltersContext = createContext<ClientFiltersContextProps | undefined>(undefined);

export function ClientFiltersProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(null);
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [filteredClients, setFilteredClients] = useState<ClientRecord[]>([]);
  
  // Filter clients based on search term and status filter
  const filterClients = useCallback((clients: ClientRecord[]) => {
    return clients.filter(client => {
      // Filter by search term
      const matchesSearch = !searchTerm || (
        (client.business_name && client.business_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.trading_name && client.trading_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.abn && client.abn.includes(searchTerm)) ||
        (client.industry && client.industry.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      // Filter by status
      const matchesStatus = !activeStatusFilter || client.status === activeStatusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, activeStatusFilter]);
  
  // Update filtered clients when search term or status filter changes
  React.useEffect(() => {
    const filtered = filterClients(clients);
    setFilteredClients(filtered);
  }, [clients, searchTerm, activeStatusFilter, filterClients]);
  
  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setActiveStatusFilter(null);
  }, []);
  
  const value = {
    searchTerm,
    activeStatusFilter,
    clients,
    filteredClients,
    setSearchTerm,
    setActiveStatusFilter,
    clearFilters,
    setClients,
    setFilteredClients
  };
  
  return (
    <ClientFiltersContext.Provider value={value}>
      {children}
    </ClientFiltersContext.Provider>
  );
}

export function useClientFilters() {
  const context = useContext(ClientFiltersContext);
  if (context === undefined) {
    throw new Error('useClientFilters must be used within a ClientFiltersProvider');
  }
  return context;
}
