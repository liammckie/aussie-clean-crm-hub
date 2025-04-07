
import React from "react";
import ClientsHeader from "@/components/clients/ClientsHeader";
import ClientsContent from "@/components/clients/ClientsContent";
import ClientDataProcessor from "@/components/clients/ClientDataProcessor";
import { ClientFiltersProvider } from "@/contexts/ClientFiltersContext";

const Clients = () => {
  return (
    <div className="container mx-auto px-0 max-w-full">
      <ClientFiltersProvider>
        <ClientsHeader />
        <ClientDataProcessor>
          <ClientsContent />
        </ClientDataProcessor>
      </ClientFiltersProvider>
    </div>
  );
};

export default Clients;
