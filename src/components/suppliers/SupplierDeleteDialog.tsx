
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supplierService } from '@/services/supplier';
import { AppLogger, LogCategory } from '@/utils/logging';

interface SupplierDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  supplierId: string;
  supplierName: string;
  onDeleted: () => void;
}

export function SupplierDeleteDialog({
  isOpen,
  onClose,
  supplierId,
  supplierName,
  onDeleted,
}: SupplierDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      AppLogger.info(
        LogCategory.SUPPLIER,
        `Attempting to delete supplier ${supplierName}`,
        { supplierId }
      );
      
      const response = await supplierService.deleteSupplier(supplierId);
      
      if ('category' in response) {
        toast.error(`Failed to delete supplier: ${response.message}`);
        AppLogger.error(
          LogCategory.SUPPLIER,
          `Error deleting supplier: ${response.message}`,
          { supplierId, error: response }
        );
      } else {
        toast.success(`Supplier "${supplierName}" deleted successfully`);
        AppLogger.info(
          LogCategory.SUPPLIER,
          `Successfully deleted supplier ${supplierName}`,
          { supplierId }
        );
        onDeleted();
      }
    } catch (error) {
      toast.error('An unexpected error occurred while deleting the supplier');
      AppLogger.error(
        LogCategory.SUPPLIER,
        'Exception deleting supplier',
        { supplierId, error }
      );
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Supplier</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete supplier "{supplierName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
