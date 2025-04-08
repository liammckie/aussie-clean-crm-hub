
import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import ClientsContent from "@/components/clients/ClientsContent";
import ClientDataProcessor from "@/components/clients/ClientDataProcessor";
import { ClientFiltersProvider } from "@/contexts/ClientFiltersContext";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Clients = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8 max-w-full">
      <PageHeader
        title="Client Management"
        description="View and manage all client accounts, details and contracts."
        breadcrumbs={[{ label: "Clients" }]}
        actions={
          <Button onClick={() => navigate("/clients/new")}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        }
      />
      
      <ClientFiltersProvider>
        <ClientDataProcessor>
          <ClientsContent />
        </ClientDataProcessor>
      </ClientFiltersProvider>
    </div>
  );
};

export default Clients;
