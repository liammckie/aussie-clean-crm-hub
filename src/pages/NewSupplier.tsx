
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heading } from '@/components/ui/heading';
import { SupplierForm } from '@/components/suppliers/SupplierForm';
import { useCreateSupplier } from '@/hooks/use-suppliers';
import { SupplierCreateData } from '@/types/supplier-types';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function NewSupplier() {
  const navigate = useNavigate();
  const { mutateAsync: createSupplier, isPending } = useCreateSupplier();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: SupplierCreateData) => {
    try {
      setError(null);
      const supplier = await createSupplier(data);
      navigate(`/suppliers/${supplier.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the supplier');
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/suppliers')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Heading title="New Supplier" />
      </div>
      
      <SupplierForm 
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        error={error}
      />
    </div>
  );
}
