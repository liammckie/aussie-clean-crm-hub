
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UnifiedAddressForm } from '@/components/client/UnifiedAddressForm';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddressTable } from '@/components/shared/AddressTable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddressType, EntityType } from '@/types/database-schema';
import { UnifiedAddressRecord } from '@/services/unified/types';
import { useTypedTransition } from '@/hooks/use-suspense-transition';
import { AppLogger, LogCategory } from '@/utils/logging';
import { DataMigrationService } from '@/utils/migrationUtils';
import { unifiedAddressService } from '@/services/unified/address-service';
import { isApiError } from '@/types/api-response';

interface ClientAddressTabProps {
  clientId: string;
  onAddressAdded?: () => void;
}

export function ClientAddressTab({ clientId, onAddressAdded }: ClientAddressTabProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState<AddressType>(AddressType.BILLING);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<UnifiedAddressRecord | null>(null);
  const [addresses, setAddresses] = useState<UnifiedAddressRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isPending, startTypedTransition } = useTypedTransition<void>();
  
  // Load addresses when component mounts
  const loadAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First check if we need to migrate addresses
      await DataMigrationService.migrateClientAddresses(clientId);
      
      // Then load the addresses
      const response = await unifiedAddressService.getEntityAddresses(EntityType.CLIENT, clientId);
      
      if (isApiError(response)) {
        throw new Error(response.message);
      }
      
      setAddresses(response.data);
    } catch (error: any) {
      AppLogger.error(LogCategory.CLIENT, `Error loading addresses: ${error.message}`, { clientId, error });
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  React.useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleAddAddress = async (formData: any) => {
    try {
      AppLogger.debug(LogCategory.CLIENT, `Creating address for client ${clientId}`, { formData });
      
      const response = await unifiedAddressService.createAddress(
        EntityType.CLIENT,
        clientId,
        {
          ...formData,
          is_primary: Boolean(formData.is_primary)
        }
      );
      
      if (isApiError(response)) {
        throw new Error(response.message);
      }
      
      setOpenDialog(false);
      loadAddresses();
      toast.success("Address added successfully");
      
      if (onAddressAdded) {
        onAddressAdded();
      }
    } catch (error: any) {
      AppLogger.error(LogCategory.CLIENT, `Failed to add address: ${error.message}`, { clientId, error });
      toast.error(`Failed to add address: ${error.message}`);
    }
  };

  const handleEditAddress = async (formData: any) => {
    if (!addressToEdit) return;
    
    try {
      const response = await unifiedAddressService.updateAddress(
        addressToEdit.id,
        {
          ...formData,
          is_primary: Boolean(formData.is_primary)
        }
      );
      
      if (isApiError(response)) {
        throw new Error(response.message);
      }
      
      setEditDialogOpen(false);
      setAddressToEdit(null);
      loadAddresses();
      toast.success("Address updated successfully");
    } catch (error: any) {
      AppLogger.error(LogCategory.CLIENT, `Failed to update address: ${error.message}`, { clientId, error });
      toast.error(`Failed to update address: ${error.message}`);
    }
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    
    try {
      const response = await unifiedAddressService.deleteAddress(addressToDelete);
      
      if (isApiError(response)) {
        throw new Error(response.message);
      }
      
      toast.success("Address deleted successfully");
      loadAddresses();
      setDeleteAlertOpen(false);
      setAddressToDelete(null);
    } catch (error: any) {
      AppLogger.error(LogCategory.CLIENT, `Failed to delete address: ${error.message}`, { 
        clientId, 
        addressId: addressToDelete, 
        error 
      });
      toast.error(`Failed to delete address: ${error.message}`);
      setDeleteAlertOpen(false);
      setAddressToDelete(null);
    }
  };

  const handleAddClick = () => {
    setOpenDialog(true);
  };
  
  const handleEditClick = (address: UnifiedAddressRecord) => {
    setAddressToEdit(address);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteAlertOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Client Addresses</CardTitle>
          <CardDescription>Manage addresses for this client</CardDescription>
        </div>
        <Button variant="default" onClick={handleAddClick} disabled={isPending}>
          Add Address
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading || isPending ? (
          <div className="text-center py-4">Loading addresses...</div>
        ) : error ? (
          <div className="p-4 border rounded bg-red-50 text-red-800">
            Error loading addresses: {error.message}
          </div>
        ) : (
          <AddressTable 
            addresses={addresses}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onAdd={handleAddClick}
            isLoading={isLoading || isPending}
          />
        )}

        {/* Add Address Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
              <DialogDescription>
                Add an address for this client. Each client can have multiple addresses.
              </DialogDescription>
            </DialogHeader>
            <UnifiedAddressForm 
              onSubmit={handleAddAddress} 
              isLoading={isPending}
              initialData={{ address_type: selectedAddressType }}
              buttonText="Add Address"
            />
          </DialogContent>
        </Dialog>

        {/* Edit Address Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Address</DialogTitle>
              <DialogDescription>
                Update the address details below.
              </DialogDescription>
            </DialogHeader>
            {addressToEdit && (
              <UnifiedAddressForm 
                onSubmit={handleEditAddress} 
                isLoading={isPending}
                initialData={addressToEdit}
                buttonText="Update Address"
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this address?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the address from the client record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteAddress}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
