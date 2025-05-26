
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupplierById, useUpdateSupplier } from '@/hooks/use-suppliers';
import { SupplierForm } from '@/components/suppliers/SupplierForm';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { AppLogger, LogCategory } from '@/utils/logging';
import { dbDataToDisplayData, displayDataToFormData, formDataToDbData } from '@/utils/supplierDataTransforms';

export default function EditSupplier() {
  const { supplierId } = useParams<{ supplierId: string }>();
  const navigate = useNavigate();
  const { data: supplier, isLoading, error } = useSupplierById(supplierId);
  const { mutateAsync: updateSupplier, isPending } = useUpdateSupplier();
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const handleSubmit = async (data: any) => {
    try {
      setSubmitError(null);
      
      if (!supplierId) {
        throw new Error("Supplier ID is missing");
      }
      
      AppLogger.info(
        LogCategory.SUPPLIER,
        `Updating supplier ${supplier?.business_name}`,
        { supplierId }
      );
      
      const dbData = formDataToDbData(data);
      await updateSupplier({ supplierId, data: dbData });
      navigate(`/suppliers/${supplierId}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred while updating the supplier');
      AppLogger.error(
        LogCategory.SUPPLIER,
        'Error updating supplier',
        { supplierId, error: err }
      );
    }
  };
  
  const handleBack = () => {
    navigate(`/suppliers/${supplierId}`);
  };
  
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
          <Button variant="ghost" size="icon" onClick={() => navigate('/suppliers')}>
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
            onClick={() => navigate('/suppliers')}
          >
            Return to Suppliers
          </Button>
        </div>
      </div>
    );
  }

  const displayData = dbDataToDisplayData(supplier);
  const formData = displayDataToFormData(displayData);
  
  return (
    <div className="container py-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Heading 
          title={`Edit Supplier: ${supplier.business_name}`} 
          description="Update supplier details" 
        />
      </div>
      
      <Separator className="my-4" />
      
      <SupplierForm 
        onSubmit={handleSubmit}
        isSubmitting={isPending}
        error={submitError}
        initialData={formData}
        buttonText="Update Supplier"
      />
    </div>
  );
}
