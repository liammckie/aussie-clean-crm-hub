
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
import { 
  ContractsList, 
  ContractsEmptyState,
  ContractsLoadingState,
  AddContractDialog
} from './contracts';

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
      refetchContracts();
    }
  }, [clientId, refetchContracts]);

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
            onViewContract={handleViewContract}
            onEditContract={handleEditContract}
          />
        ) : (
          <ContractsEmptyState onAddContract={() => setIsAddDialogOpen(true)} />
        )}

        <AddContractDialog 
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAddContract={handleAddContract}
        />
      </CardContent>
    </Card>
  );
}
