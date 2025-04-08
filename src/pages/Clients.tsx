
import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ClientsDashboard } from "@/components/clients/ClientsDashboard";
import { ClientFiltersProvider } from "@/contexts/ClientFiltersContext";

const Clients = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6 max-w-full">
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
        <ClientsDashboard />
      </ClientFiltersProvider>
    </div>
  );
};

export default Clients;
