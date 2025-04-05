
import React, { useEffect, useState, useRef } from "react";
import { useContracts } from "@/hooks/use-contracts-table";
import { ContractsTable } from "@/components/contracts/ContractsTable";
import { BulkManagerAssign } from "@/components/contracts/BulkManagerAssign";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { contractService } from "@/services/contract";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { TabulatorTable } from "@/components/contracts/TabulatorTable";
import { LoadSampleContracts } from "@/components/contracts/LoadSampleContracts";

export default function Contracts() {
  const { contracts, isLoadingContracts, contractsError, refetchContracts } = useContracts();
  const [selectedContracts, setSelectedContracts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>("tabulator");

  const handleContractsSelected = (contracts: any[]) => {
    setSelectedContracts(contracts);
  };

  if (isLoadingContracts) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary m-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading contracts data...</p>
        </div>
      </div>
    );
  }

  if (contractsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center p-6 bg-destructive/10 rounded-lg max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to load contracts</h2>
          <p className="text-muted-foreground mb-4">
            There was an error loading the contracts data. Please try again.
          </p>
          <Button onClick={() => refetchContracts()}>Retry</Button>
        </div>
      </div>
    );
  }

  const hasContracts = contracts && contracts.length > 0;

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <Heading title="Contract Management" description="Manage and assign contracts" />
          <Separator className="my-4" />
        </div>
        
        {!hasContracts && (
          <LoadSampleContracts onContractsLoaded={refetchContracts} />
        )}
      </header>

      {!hasContracts ? (
        <Card className="p-6 text-center">
          <div className="py-12">
            <h3 className="text-xl font-medium mb-2">No Contracts Found</h3>
            <p className="text-muted-foreground mb-6">
              There are no contracts in the system yet. Click the button above to generate sample contracts.
            </p>
          </div>
        </Card>
      ) : (
        <Tabs defaultValue="tabulator" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="tabulator">Tabulator View</TabsTrigger>
            <TabsTrigger value="standard">Standard View</TabsTrigger>
          </TabsList>

          <TabsContent value="tabulator" className="space-y-4">
            <Card className="p-6">
              {selectedContracts.length > 0 && (
                <div className="mb-4">
                  <BulkManagerAssign 
                    selectedContracts={selectedContracts}
                    onUpdate={() => {
                      // Force a refresh of the table after updates
                      refetchContracts();
                      toast.success(`Updated ${selectedContracts.length} contracts`);
                      setSelectedContracts([]);
                    }}
                  />
                </div>
              )}
              <TabulatorTable 
                contracts={contracts || []}
                onSelectionChange={handleContractsSelected}
              />
            </Card>
          </TabsContent>

          <TabsContent value="standard" className="space-y-4">
            <Card className="p-6">
              <ContractsTable contracts={contracts || []} />
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
