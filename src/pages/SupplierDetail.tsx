
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupplierById } from '@/hooks/use-suppliers';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Edit, Trash } from 'lucide-react';
import { SupplierDetailsTab } from '@/components/suppliers/SupplierDetailsTab';
import { SupplierComplianceTab } from '@/components/suppliers/SupplierComplianceTab';
import { SupplierContractsTab } from '@/components/suppliers/SupplierContractsTab';
import { SupplierDeleteDialog } from '@/components/suppliers/SupplierDeleteDialog';
import { AppLogger, LogCategory } from '@/utils/logging';

export default function SupplierDetail() {
  const { supplierId } = useParams<{ supplierId: string }>();
  const navigate = useNavigate();
  
  const { data: supplier, isLoading, error, refetch } = useSupplierById(supplierId);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleEdit = () => {
    navigate(`/suppliers/${supplierId}/edit`);
  };
  
  const handleBack = () => {
    navigate('/suppliers');
  };
  
  // Log view access
  React.useEffect(() => {
    if (supplier) {
      AppLogger.info(
        LogCategory.SUPPLIER,
        `Viewing supplier details for ${supplier.supplier_name}`,
        { supplierId }
      );
    }
  }, [supplier, supplierId]);
  
  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Heading title="Loading Supplier..." />
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (error || !supplier) {
    return (
      <div className="container py-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Heading title="Supplier Not Found" />
        </div>
        <div className="bg-destructive/10 p-6 rounded-md mt-4">
          <p className="text-destructive">
            {error instanceof Error ? error.message : "Unable to load supplier details"}
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={handleBack}
          >
            Return to Suppliers
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <Heading title={supplier.supplier_name} />
            <p className="text-sm text-muted-foreground mt-1">
              {supplier.supplier_type} • {supplier.status}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <Tabs defaultValue="details">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <SupplierDetailsTab supplier={supplier} onUpdate={refetch} />
        </TabsContent>
        
        <TabsContent value="compliance">
          <SupplierComplianceTab supplierId={supplier.supplier_id} />
        </TabsContent>
        
        <TabsContent value="contracts">
          <SupplierContractsTab supplierId={supplier.supplier_id} />
        </TabsContent>
      </Tabs>
      
      <SupplierDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        supplierId={supplier.supplier_id}
        supplierName={supplier.supplier_name}
        onDeleted={() => navigate('/suppliers')}
      />
    </div>
  );
}
