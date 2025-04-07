
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ClientRecord } from "@/types/clients";
import { AppLogger, LogCategory } from '@/utils/logging';

interface ClientFiltersContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeStatusFilter: string | null;
  setActiveStatusFilter: (status: string | null) => void;
  filteredClients: ClientRecord[];
  setFilteredClients: (clients: ClientRecord[]) => void;
  clearFilters: () => void;
}

const ClientFiltersContext = createContext<ClientFiltersContextType | undefined>(undefined);

export const useClientFilters = () => {
  const context = useContext(ClientFiltersContext);
  if (!context) {
    throw new Error("useClientFilters must be used within a ClientFiltersProvider");
  }
  return context;
};

interface ClientFiltersProviderProps {
  children: ReactNode;
}

export const ClientFiltersProvider: React.FC<ClientFiltersProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(null);
  const [filteredClients, setFilteredClients] = useState<ClientRecord[]>([]);

  const clearFilters = () => {
    setSearchTerm("");
    setActiveStatusFilter(null);
  };

  AppLogger.debug(LogCategory.UI, "ClientFiltersProvider state", { 
    searchTerm, 
    activeStatusFilter, 
    filteredClientsCount: filteredClients.length 
  });

  return (
    <ClientFiltersContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        activeStatusFilter,
        setActiveStatusFilter,
        filteredClients,
        setFilteredClients,
        clearFilters,
      }}
    >
      {children}
    </ClientFiltersContext.Provider>
  );
};
