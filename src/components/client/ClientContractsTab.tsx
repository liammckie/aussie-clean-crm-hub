
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Eye, Loader2 } from 'lucide-react';
import { useContracts } from '@/hooks/use-contracts';
import { useNavigate } from 'react-router-dom';
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
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
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
    // Fetch contracts on component mount
    if (clientId) {
      AppLogger.info(
        LogCategory.CONTRACT, 
        `Fetching contracts for client: ${clientId}`
      );
      refetchContracts();
    }
  }, [clientId, refetchContracts]);

  const handleAddContract = () => {
    // For now just redirect to a new contract page
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

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '$0';
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending_approval':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'on_hold':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
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
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : contractsError ? (
          <div className="p-4 border rounded bg-destructive/10 text-destructive">
            <p className="font-semibold">Error loading contracts</p>
            <p className="text-sm mt-1">{contractsError instanceof Error ? contractsError.message : 'Unknown error'}</p>
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
                  <TableRow 
                    key={contract.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleViewContract(contract.id)}
                  >
                    <TableCell className="font-medium">{contract.contract_name}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getStatusBadgeStyles(contract.status)}
                      >
                        {contract.status.charAt(0).toUpperCase() + contract.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(contract.start_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {contract.end_date 
                        ? new Date(contract.end_date).toLocaleDateString() 
                        : (contract.is_ongoing ? 'Ongoing' : 'Not set')}
                    </TableCell>
                    <TableCell>{formatCurrency(contract.total_weekly_value)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewContract(contract.id);
                          }}
                          title="View contract details"
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => handleEditContract(contract.id, e)}
                          title="Edit contract"
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                      </div>
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
              <DialogDescription>
                Create a new contract for this client. You'll be redirected to the contract creation page.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
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
