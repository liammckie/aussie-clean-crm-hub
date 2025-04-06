
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, UserX, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/spinner';
import { useContractSuppliers, useRemoveSupplierFromContract } from '@/hooks/use-supplier-contracts';
import { useNavigate } from 'react-router-dom';
import { AssignSupplierDialog } from './AssignSupplierDialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ContractSuppliersTabProps {
  contractId: string;
}

export function ContractSuppliersTab({ contractId }: ContractSuppliersTabProps) {
  const navigate = useNavigate();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [removingSupplierId, setRemovingSupplierId] = useState<string | null>(null);
  const { data: suppliers, isLoading, error, refetch } = useContractSuppliers(contractId);
  const { mutateAsync: removeSupplier, isPending: isRemoving } = useRemoveSupplierFromContract();
  
  const handleViewSupplier = (supplierId: string) => {
    navigate(`/suppliers/${supplierId}`);
  };
  
  const confirmRemoveSupplier = (supplierId: string) => {
    setRemovingSupplierId(supplierId);
  };
  
  const handleRemoveSupplier = async () => {
    if (!removingSupplierId) return;
    
    try {
      await removeSupplier({ 
        supplierId: removingSupplierId, 
        contractId 
      });
      refetch();
    } catch (error) {
      console.error('Failed to remove supplier:', error);
    } finally {
      setRemovingSupplierId(null);
    }
  };
  
  const handleAssignComplete = () => {
    refetch();
  };
  
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'primary':
        return 'default';
      case 'secondary':
        return 'outline';
      case 'subcontractor':
        return 'secondary';
      default:
        return 'outline';
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Suppliers</CardTitle>
            <CardDescription>Suppliers assigned to this contract</CardDescription>
          </div>
          <Button onClick={() => setIsAssignDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Assign Supplier
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>Error loading suppliers: {error instanceof Error ? error.message : 'Unknown error'}</span>
            </div>
          ) : suppliers?.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <p className="text-muted-foreground">No suppliers assigned to this contract yet.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsAssignDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Assign First Supplier
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers?.map((item) => (
                    <TableRow key={item.link_id}>
                      <TableCell className="font-medium">
                        {item.suppliers?.supplier_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(item.role)}>
                          {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.services || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewSupplier(item.supplier_id)}
                          >
                            View
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => confirmRemoveSupplier(item.supplier_id)}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Supplier Assignment Dialog */}
      <AssignSupplierDialog
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        contractId={contractId}
        onAssigned={handleAssignComplete}
      />

      {/* Remove Supplier Confirmation Dialog */}
      <AlertDialog 
        open={!!removingSupplierId} 
        onOpenChange={(open) => !open && setRemovingSupplierId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Supplier from Contract</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this supplier from the contract? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemoveSupplier}
              disabled={isRemoving}
              className="bg-destructive text-destructive-foreground"
            >
              {isRemoving ? <LoadingSpinner size="sm" className="mr-2" /> : null}
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
