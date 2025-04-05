
import React, { useState, useEffect } from 'react';
import { useClients } from '@/hooks/use-clients';
import { AddressFormData, AddressType, UnifiedAddressRecord } from '@/services/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AddressForm } from '@/components/client/AddressForm';
import { Plus, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

interface ClientAddressTabProps {
  clientId: string;
  onAddressAdded?: () => void;
}

export function ClientAddressTab({ clientId, onAddressAdded }: ClientAddressTabProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState<AddressType>('billing');
  const [unifiedAddresses, setUnifiedAddresses] = useState<UnifiedAddressRecord[]>([]);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  
  const { useClientAddresses, createAddress, isCreatingAddress, deleteAddress, isDeletingAddress } = useClients();
  const { data: addresses, isLoading, error, refetch } = useClientAddresses(clientId);

  // Convert client addresses to unified format for the table
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const transformed: UnifiedAddressRecord[] = addresses.map(address => ({
        id: address.id,
        entity_type: 'client',
        entity_id: clientId,
        address_line_1: address.street,
        address_line_2: address.street_2,
        suburb: address.suburb,
        state: address.state,
        postcode: address.postcode,
        country: address.country,
        address_type: address.address_type,
        created_at: address.created_at,
        updated_at: address.updated_at,
        is_primary: address.address_type === 'billing' // Assuming billing is primary
      }));
      setUnifiedAddresses(transformed);
    } else {
      setUnifiedAddresses([]);
    }
  }, [addresses, clientId]);

  const handleAddAddress = async (data: Omit<AddressFormData, 'client_id'>) => {
    createAddress(
      { 
        clientId, 
        addressData: data 
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

  const handleEditAddress = (address: UnifiedAddressRecord) => {
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
            addresses={unifiedAddresses}
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
            <AddressForm 
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
