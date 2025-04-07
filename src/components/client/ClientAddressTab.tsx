import React, { useState, useCallback } from 'react';
import { useUnifiedEntities } from '@/hooks/use-unified-entities';
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
import { AddressType } from '@/types/form-types';
import { EntityType } from '@/services/client/types';
import { UnifiedAddressRecord } from '@/services/unified/types';
import { useTypedTransition } from '@/hooks/use-suspense-transition';
import { AppLogger, LogCategory } from '@/utils/logging';
import { AddressType as DbAddressType } from '@/types/database-schema';

interface ClientAddressTabProps {
  clientId: string;
  onAddressAdded?: () => void;
}

export function ClientAddressTab({ clientId, onAddressAdded }: ClientAddressTabProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState<AddressType>(DbAddressType.BILLING);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const { isPending, startTypedTransition } = useTypedTransition<void>();
  
  const { 
    useEntityAddresses, 
    createAddress, 
    isCreatingAddress, 
    deleteAddress, 
    isDeletingAddress 
  } = useUnifiedEntities();
  
  const { 
    data: addresses, 
    isLoading, 
    error, 
    refetch 
  } = useEntityAddresses(EntityType.CLIENT, clientId);

  const handleAddAddress = useCallback((formData: any) => {
    AppLogger.debug(LogCategory.CLIENT, `Creating address for client ${clientId}`, { formData });
    
    startTypedTransition(() => {
      createAddress(
        { 
          entityType: EntityType.CLIENT, 
          entityId: clientId, 
          addressData: {
            ...formData,
            is_primary: formData.is_primary || false
          }
        },
        {
          onSuccess: () => {
            setOpenDialog(false);
            if (onAddressAdded) {
              onAddressAdded();
            }
            refetch();
            toast.success("Address added successfully");
          },
          onError: (error: Error) => {
            AppLogger.error(LogCategory.ERROR, `Failed to add address: ${error.message}`, { clientId, error });
            toast.error(`Failed to add address: ${error.message}`);
          }
        }
      );
    });
  }, [clientId, createAddress, onAddressAdded, refetch, startTypedTransition]);

  const handleEditAddress = (address: UnifiedAddressRecord) => {
    toast.info("Edit functionality will be implemented in future sprint");
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteAlertOpen(true);
  };

  const confirmDeleteAddress = useCallback(() => {
    if (!addressToDelete) return;
    
    AppLogger.debug(LogCategory.CLIENT, `Deleting address ${addressToDelete} for client ${clientId}`);
    
    startTypedTransition(() => {
      deleteAddress(
        { addressId: addressToDelete },
        {
          onSuccess: () => {
            toast.success("Address deleted successfully");
            refetch();
            setDeleteAlertOpen(false);
            setAddressToDelete(null);
          },
          onError: (error: Error) => {
            AppLogger.error(LogCategory.ERROR, `Failed to delete address: ${error.message}`, { clientId, addressId: addressToDelete, error });
            toast.error(`Failed to delete address: ${error.message}`);
            setDeleteAlertOpen(false);
            setAddressToDelete(null);
          }
        }
      );
    });
  }, [addressToDelete, clientId, deleteAddress, refetch, startTypedTransition]);

  const handleAddClick = () => {
    setOpenDialog(true);
  };

  const typedAddresses = React.useMemo(() => {
    if (!addresses) return [] as UnifiedAddressRecord[];
    
    return (addresses as any[]).map((address: any): UnifiedAddressRecord => ({
      id: address.id,
      entity_id: address.entity_id,
      entity_type: address.entity_type,
      address_type: address.address_type,
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2,
      suburb: address.suburb,
      state: address.state,
      postcode: address.postcode,
      country: address.country || 'Australia',
      is_primary: Boolean(address.is_primary),
      name: address.name,
      created_at: address.created_at,
      updated_at: address.updated_at
    }));
  }, [addresses]);

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
            Error loading addresses: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : (
          <AddressTable 
            addresses={typedAddresses}
            onEdit={handleEditAddress}
            onDelete={handleDeleteAddress}
            onAdd={handleAddClick}
            isLoading={isLoading || isDeletingAddress || isPending}
          />
        )}

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
              isLoading={isCreatingAddress || isPending}
              initialData={{ address_type: selectedAddressType }}
              buttonText="Add Address"
            />
          </DialogContent>
        </Dialog>

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
                disabled={isDeletingAddress || isPending}
              >
                {isDeletingAddress || isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
