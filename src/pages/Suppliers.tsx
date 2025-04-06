
import React from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { SuppliersList } from '@/components/suppliers/SuppliersList';
import { useSuppliers } from '@/hooks/use-suppliers';

const Suppliers = () => {
  const { 
    suppliers, 
    isLoadingSuppliers, 
    deleteSupplier, 
    isDeletingSupplier 
  } = useSuppliers();
  
  const handleDeleteSupplier = async (id: string) => {
    await deleteSupplier(id);
  };

  return (
    <div className="container mx-auto p-6">
      <Heading
        title="Suppliers"
        description="Manage your suppliers and subcontractors"
      />
      <Separator className="my-4" />
      
      <SuppliersList
        suppliers={suppliers}
        isLoading={isLoadingSuppliers}
        onDelete={handleDeleteSupplier}
        isDeleting={isDeletingSupplier}
      />
    </div>
  );
};

export default Suppliers;
