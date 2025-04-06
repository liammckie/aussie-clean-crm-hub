
import React from 'react';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { SupplierForm } from '@/components/suppliers/SupplierForm';
import { useSuppliers } from '@/hooks/use-suppliers';
import { AppLogger, LogCategory } from '@/utils/logging';
import { SupplierCreateData } from '@/services/supplier/types';

const NewSupplier = () => {
  const { createSupplier, isCreatingSupplier } = useSuppliers();
  
  const handleCreateSupplier = async (data: SupplierCreateData) => {
    AppLogger.info(LogCategory.SUPPLIER, 'Creating new supplier', data);
    return await createSupplier(data);
  };
  
  return (
    <div className="container mx-auto p-6">
      <Heading
        title="Create New Supplier"
        description="Add a new supplier or subcontractor to the system"
      />
      <Separator className="my-4" />
      
      <SupplierForm
        onSubmit={handleCreateSupplier}
        isSubmitting={isCreatingSupplier}
      />
    </div>
  );
};

export default NewSupplier;
