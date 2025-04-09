
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useContracts } from '@/hooks/use-contracts';
import { useNavigate } from 'react-router-dom';
import { AppLogger, LogCategory } from '@/utils/logging';

interface ClientContractsTabProps {
  clientId: string;
}

export function ClientContractsTab({ clientId }: ClientContractsTabProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const {
    contracts,
    isLoadingContracts,
    contractsError,
    refetchContracts
  } = useContracts(clientId);
  
  useEffect(() => {
    if (clientId) {
      AppLogger.info(
        LogCategory.CONTRACT, 
        `Fetching contracts for client: ${clientId}`
      );
    }
  }, [clientId]);

  const handleAddContract = () => {
    setIsAddDialogOpen(false);
    navigate(`/contracts/new?clientId=${clientId}`);
  };

  const handleViewContract = (contractId: string) => {
    navigate(`/contracts/${contractId}`);
  };
  
  const handleEditContract = (contractId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering the row click
    navigate(`/contracts/${contractId}/edit`);
  };

  // Simple ContractsList component for rendering
  const ContractsList = ({ contracts, onView, onEdit }: any) => (
    <div className="space-y-2">
      {contracts.map((contract: any) => (
        <div 
          key={contract.id}
          className="p-4 border rounded cursor-pointer hover:bg-accent"
          onClick={() => onView(contract.id)}
        >
          <div className="flex justify-between">
            <div>
              <h4 className="font-medium">{contract.contract_name || contract.contract_code}</h4>
              <p className="text-sm text-muted-foreground">{contract.status}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => onEdit(contract.id, e)}
            >
              Edit
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state component
  const ContractsEmptyState = () => (
    <div className="text-center py-8 border rounded-md">
      <p className="text-gray-500">No contracts found for this client</p>
      <Button variant="outline" className="mt-4" onClick={handleAddContract}>
        Add First Contract
      </Button>
    </div>
  );

  // Loading state component
  const ContractsLoadingState = () => (
    <div className="flex items-center justify-center h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  // Add dialog component
  const AddContractDialog = ({ isOpen, onClose, onConfirm }: any) => (
    <div className={isOpen ? "fixed inset-0 bg-black/50 flex items-center justify-center" : "hidden"}>
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-medium mb-4">Add New Contract</h3>
        <p className="mb-6">Create a new contract for this client?</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onConfirm}>Create Contract</Button>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Client Contracts</CardTitle>
          <CardDescription>Manage contracts for this client</CardDescription>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} variant="default">
          <Plus className="mr-2 h-4 w-4" />
          Add Contract
        </Button>
      </CardHeader>
      <CardContent>
        {isLoadingContracts ? (
          <ContractsLoadingState />
        ) : contractsError ? (
          <div className="p-4 border rounded bg-destructive/10 text-destructive">
            <p className="font-semibold">Error loading contracts</p>
            <p className="text-sm mt-1">{contractsError instanceof Error ? contractsError.message : 'Unknown error'}</p>
          </div>
        ) : contracts && contracts.length > 0 ? (
          <ContractsList 
            contracts={contracts}
            onView={handleViewContract}
            onEdit={handleEditContract}
          />
        ) : (
          <ContractsEmptyState />
        )}
      </CardContent>

      <AddContractDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onConfirm={handleAddContract}
      />
    </Card>
  );
}
