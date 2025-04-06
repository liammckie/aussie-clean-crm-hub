
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Search, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSuppliers } from '@/hooks/use-suppliers';
import { useContractSuppliers, useAssignSupplierToContract, useRemoveSupplierFromContract } from '@/hooks/use-supplier-contracts';
import { SupplierData } from '@/types/supplier-types';
import { toast } from 'sonner';
import { AppLogger, LogCategory } from '@/utils/logging';

interface ContractSuppliersTabProps {
  contractId: string;
}

export function ContractSuppliersTab({ contractId }: ContractSuppliersTabProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierData | null>(null);
  const [selectedRole, setSelectedRole] = useState('subcontractor');
  
  const { data: suppliers = [], isLoading: loadingSuppliers } = useSuppliers();
  const { data: contractSuppliers = [], isLoading: loadingContractSuppliers } = useContractSuppliers(contractId);
  
  const { mutateAsync: assignSupplier, isPending: isAssigning } = useAssignSupplierToContract();
  const { mutateAsync: removeSupplier, isPending: isRemoving } = useRemoveSupplierFromContract();
  
  const filteredSuppliers = suppliers.filter(supplier => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      supplier.business_name?.toLowerCase().includes(query) ||
      supplier.abn?.toLowerCase().includes(query)
    );
  });
  
  const handleSelectSupplier = (supplier: SupplierData) => {
    setSelectedSupplier(supplier);
  };
  
  const handleAssignSupplier = async () => {
    if (!selectedSupplier) {
      toast.error('Please select a supplier first');
      return;
    }
    
    try {
      await assignSupplier({
        supplier_id: selectedSupplier.supplier_id || selectedSupplier.id,
        contract_id: contractId,
        role: selectedRole,
        status: 'active',
        notes: ''
      });
      
      toast.success('Supplier assigned successfully');
      setIsDialogOpen(false);
      setSelectedSupplier(null);
    } catch (error) {
      toast.error('Failed to assign supplier');
      AppLogger.error(LogCategory.SUPPLIER, 'Error assigning supplier to contract', { error });
    }
  };
  
  const handleRemoveSupplier = async (supplierId: string) => {
    try {
      await removeSupplier({ supplierId, contractId });
      toast.success('Supplier removed from contract');
    } catch (error) {
      toast.error('Failed to remove supplier');
      AppLogger.error(LogCategory.SUPPLIER, 'Error removing supplier from contract', { error });
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleReset = () => {
    setSelectedSupplier(null);
    setSearchQuery('');
    setSelectedRole('subcontractor');
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Contract Suppliers</CardTitle>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Assign Supplier
        </Button>
      </CardHeader>
      <CardContent>
        {loadingContractSuppliers ? (
          <div className="text-center py-4">Loading suppliers...</div>
        ) : contractSuppliers.length === 0 ? (
          <div className="text-center py-8 border rounded-md">
            <p className="text-muted-foreground mb-4">No suppliers assigned to this contract</p>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
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
                  <TableHead>ABN</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contractSuppliers.map((supplier) => (
                  <TableRow key={supplier.supplier_id}>
                    <TableCell className="font-medium">{supplier.business_name || 'Unknown'}</TableCell>
                    <TableCell>{supplier.role || 'Subcontractor'}</TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          supplier.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }
                      >
                        {supplier.status || 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell>{supplier.abn || 'Not specified'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSupplier(supplier.supplier_id)}
                        disabled={isRemoving}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Assign Supplier to Contract</DialogTitle>
              <DialogDescription>
                Select a supplier to assign to this contract.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="h-[250px] overflow-y-auto border rounded-md">
                {loadingSuppliers ? (
                  <div className="p-4 text-center">Loading suppliers...</div>
                ) : filteredSuppliers.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">No suppliers found</div>
                ) : (
                  <div className="divide-y">
                    {filteredSuppliers.map((supplier) => (
                      <div
                        key={supplier.id}
                        className={`p-2 cursor-pointer hover:bg-secondary ${
                          selectedSupplier?.id === supplier.id ? 'bg-secondary' : ''
                        }`}
                        onClick={() => handleSelectSupplier(supplier)}
                      >
                        <div className="font-medium">{supplier.business_name}</div>
                        {supplier.abn && <div className="text-sm text-muted-foreground">ABN: {supplier.abn}</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Supplier Role</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="subcontractor">Subcontractor</option>
                  <option value="service_provider">Service Provider</option>
                  <option value="consultant">Consultant</option>
                </select>
              </div>
              
              {selectedSupplier && (
                <div className="flex items-center p-2 bg-secondary rounded-md">
                  <div className="flex-1">
                    <div className="font-medium">{selectedSupplier.business_name}</div>
                    <div className="text-sm text-muted-foreground">
                      ABN: {selectedSupplier.abn || 'Not provided'}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setSelectedSupplier(null)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear Selection</span>
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter className="sm:justify-start">
              <div className="flex items-center justify-end space-x-2 w-full">
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button
                  onClick={handleAssignSupplier}
                  disabled={!selectedSupplier || isAssigning}
                >
                  {isAssigning ? 'Assigning...' : 'Assign Supplier'}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
