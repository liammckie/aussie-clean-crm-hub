
import React from 'react';
import { useSuppliers } from '@/hooks/use-suppliers';
import { SuppliersList } from '@/components/suppliers/SuppliersList';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Suppliers() {
  const { data: suppliers, error, isLoading } = useSuppliers();
  const navigate = useNavigate();

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Heading>Supplier Management</Heading>
        <Button onClick={() => navigate('/new-supplier')} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Supplier
        </Button>
      </div>
      <SuppliersList 
        suppliers={suppliers || []} 
        isLoading={isLoading} 
        error={error instanceof Error ? error : null} 
      />
    </div>
  );
}
