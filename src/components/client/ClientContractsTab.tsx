
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
import { toast } from 'sonner';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

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
    // Fetch contracts on component mount
    refetchContracts();
  }, [clientId, refetchContracts]);

  const handleAddContract = () => {
    // For now just redirect to a new contract page
    // Later can implement an in-page form
    setIsAddDialogOpen(false);
    navigate(`/contracts/new?clientId=${clientId}`);
  };

  const handleViewContract = (contractId: string) => {
    navigate(`/contracts/${contractId}`);
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
          <div className="text-center py-4">Loading contracts...</div>
        ) : contractsError ? (
          <div className="p-4 border rounded bg-red-50 text-red-800">
            Error loading contracts: {contractsError instanceof Error ? contractsError.message : 'Unknown error'}
          </div>
        ) : contracts && contracts.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Weekly Value</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">{contract.contract_name}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        contract.status === 'active' ? 'bg-green-100 text-green-800' :
                        contract.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        contract.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{contract.start_date}</TableCell>
                    <TableCell>{contract.end_date || (contract.is_ongoing ? 'Ongoing' : 'Not set')}</TableCell>
                    <TableCell>${contract.total_weekly_value ? contract.total_weekly_value.toLocaleString() : '0'}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewContract(contract.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 border rounded-md">
            <p className="text-muted-foreground mb-4">No contracts found for this client</p>
            <Button onClick={() => setIsAddDialogOpen(true)} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create First Contract
            </Button>
          </div>
        )}

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Contract</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <p className="text-muted-foreground">
                You'll be redirected to the contract creation page.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddContract}>
                  Continue
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
