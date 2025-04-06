
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Plus, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useSupplierContracts } from '@/hooks/use-supplier-contracts';

interface SupplierContractsTabProps {
  supplierId: string;
}

export function SupplierContractsTab({ supplierId }: SupplierContractsTabProps) {
  const navigate = useNavigate();
  const { data: contracts, isLoading, error } = useSupplierContracts(supplierId);
  
  const handleViewContract = (contractId: string) => {
    navigate(`/contracts/${contractId}`);
  };
  
  const handleAssignContract = () => {
    // This would typically show a modal to assign a contract
    // For now, just navigate to contracts page
    navigate('/contracts');
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Contracts</CardTitle>
          <CardDescription>Contracts associated with this supplier</CardDescription>
        </div>
        <Button size="sm" onClick={handleAssignContract}>
          <Plus className="h-4 w-4 mr-2" />
          Assign Contract
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            <p>Error loading contracts: {error instanceof Error ? error.message : 'Unknown error'}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        ) : contracts && contracts.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract Number</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.contract_id}>
                    <TableCell className="font-medium">{contract.contract_number}</TableCell>
                    <TableCell>{contract.client_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{contract.status}</Badge>
                    </TableCell>
                    <TableCell>${contract.contract_value?.toLocaleString() || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={contract.supplier_role === 'primary' ? 'default' : 'secondary'}>
                        {contract.supplier_role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewContract(contract.contract_id)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <p className="mt-2 text-muted-foreground">No contracts associated with this supplier</p>
            <Button variant="outline" className="mt-4" onClick={handleAssignContract}>
              <Plus className="h-4 w-4 mr-2" />
              Assign First Contract
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
