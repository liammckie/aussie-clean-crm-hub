
import React from 'react';
import { useSuppliers } from '@/hooks/use-suppliers';
import { SuppliersList } from '@/components/suppliers/SuppliersList';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { AppLogger, LogCategory } from '@/utils/logging';

export default function Suppliers() {
  const { data: suppliers, isLoading, error } = useSuppliers();
  
  // Log page access
  React.useEffect(() => {
    AppLogger.info(LogCategory.SUPPLIER, 'Viewing suppliers list');
  }, []);
  
  return (
    <div className="container py-6">
      <Heading 
        title="Suppliers" 
        description="Manage your suppliers and subcontractors"
      />
      
      <Separator className="my-4" />
      
      <SuppliersList 
        suppliers={suppliers || []} 
        isLoading={isLoading}
        error={error instanceof Error ? error : null}
      />
    </div>
  );
}
