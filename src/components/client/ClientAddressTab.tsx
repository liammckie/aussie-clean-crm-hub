
import React, { useState } from 'react';
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
  DialogFooter,
} from '@/components/ui/dialog';
import AddressTable from '@/components/shared/AddressTable';
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

interface ClientAddressTabProps {
  clientId: string;
  onAddressAdded?: () => void;
}

export function ClientAddressTab({ clientId, onAddressAdded }: ClientAddressTabProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState<AddressType>('billing');
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  
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
  } = useEntityAddresses('client', clientId);

  const handleAddAddress = async (formData: any) => {
    createAddress(
      { 
        entityType: 'client', 
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
        onError: (error: any) => {
          toast.error(`Failed to add address: ${error.message}`);
        }
      }
    );
  };

  const handleEditAddress = (address: any) => {
    // Implementation for editing - would open a dialog with the form pre-populated
    toast.info("Edit functionality will be implemented in future sprint");
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteAlertOpen(true);
  };

  const confirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    
    deleteAddress(
      { addressId: addressToDelete },
      {
        onSuccess: () => {
          toast.success("Address deleted successfully");
          refetch();
          setDeleteAlertOpen(false);
          setAddressToDelete(null);
        },
        onError: (error: any) => {
          toast.error(`Failed to delete address: ${error.message}`);
          setDeleteAlertOpen(false);
          setAddressToDelete(null);
        }
      }
    );
  };

  const handleAddClick = () => {
    setOpenDialog(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Client Addresses</CardTitle>
          <CardDescription>Manage addresses for this client</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading addresses...</div>
        ) : error ? (
          <div className="p-4 border rounded bg-red-50 text-red-800">
            Error loading addresses: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : (
          <AddressTable 
            addresses={addresses || []}
            onEdit={handleEditAddress}
            onDelete={handleDeleteAddress}
            onAdd={handleAddClick}
            showEntityType={false}
            isLoading={isLoading || isDeletingAddress}
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
              isLoading={isCreatingAddress}
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
                disabled={isDeletingAddress}
              >
                {isDeletingAddress ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
