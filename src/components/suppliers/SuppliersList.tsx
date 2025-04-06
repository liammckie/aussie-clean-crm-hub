
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Plus, Search, MoreVertical, Edit, Trash, FileText } from 'lucide-react';
import { SupplierData } from '@/services/supplier/types';
import { AppLogger, LogCategory } from '@/utils/logging';

interface SuppliersListProps {
  suppliers: SupplierData[] | undefined;
  isLoading: boolean;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function SuppliersList({ 
  suppliers, 
  isLoading, 
  onDelete, 
  isDeleting 
}: SuppliersListProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);

  // Filter suppliers based on search query
  const filteredSuppliers = suppliers?.filter(supplier => {
    const searchLower = searchQuery.toLowerCase();
    return (
      supplier.business_name?.toLowerCase().includes(searchLower) ||
      supplier.primary_contact_name?.toLowerCase().includes(searchLower) ||
      supplier.supplier_code?.toLowerCase().includes(searchLower) ||
      supplier.abn?.toLowerCase().includes(searchLower) ||
      supplier.acn?.toLowerCase().includes(searchLower) ||
      supplier.services_provided?.toLowerCase().includes(searchLower)
    );
  });

  const handleDeleteSupplier = async () => {
    if (!supplierToDelete) return;
    
    try {
      await onDelete(supplierToDelete);
      setSupplierToDelete(null);
    } catch (error) {
      AppLogger.error(
        LogCategory.SUPPLIER, 
        `Error deleting supplier: ${error}`, 
        { supplierId: supplierToDelete }
      );
      // Error is already handled by the useMutation hook
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Suppliers</CardTitle>
            <CardDescription>Manage your suppliers and subcontractors</CardDescription>
          </div>
          <Button onClick={() => navigate('/suppliers/new')}>
            <Plus className="mr-2 h-4 w-4" /> Add Supplier
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
            </div>
          ) : filteredSuppliers && filteredSuppliers.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>ABN</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow 
                      key={supplier.id} 
                      className="cursor-pointer"
                      onClick={() => navigate(`/suppliers/${supplier.id}`)}
                    >
                      <TableCell className="font-medium">{supplier.business_name}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          supplier.status === 'active' ? 'bg-green-100 text-green-800' : 
                          supplier.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' : 
                          supplier.status === 'suspended' ? 'bg-orange-100 text-orange-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {supplier.status}
                        </div>
                      </TableCell>
                      <TableCell>{supplier.supplier_type || 'Service'}</TableCell>
                      <TableCell>{supplier.primary_contact_name || 'Not specified'}</TableCell>
                      <TableCell>{supplier.abn || 'Not specified'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/suppliers/${supplier.id}`);
                            }}>
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/suppliers/${supplier.id}/edit`);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSupplierToDelete(supplier.id);
                              }}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">No suppliers found</p>
              <Button onClick={() => navigate('/suppliers/new')}>
                <Plus className="mr-2 h-4 w-4" /> Add Your First Supplier
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!supplierToDelete} onOpenChange={() => setSupplierToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the supplier
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSupplier}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
