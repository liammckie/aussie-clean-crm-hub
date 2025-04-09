
import React, { useState } from 'react';
import { useEntityQueries } from '@/hooks/unified/use-entity-queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EntityType } from '@/types/form-types';
import { UnifiedAddressForm } from './UnifiedAddressForm';
import { Pencil, Trash } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle, 
  DialogDescription
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UnifiedAddressRecord } from '@/services/unified/types';
import { useAddressMutations } from '@/hooks/unified/use-address-mutations';

interface UnifiedAddressListProps {
  entityType: EntityType;
  entityId: string;
}

export function UnifiedAddressList({ entityType, entityId }: UnifiedAddressListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<UnifiedAddressRecord | null>(null);

  // Get entity queries and address mutations
  const { useEntityAddresses } = useEntityQueries();
  const addressQuery = useEntityAddresses(entityType, entityId);
  const { 
    createAddress, 
    updateAddress, 
    deleteAddress,
    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress
  } = useAddressMutations();
  
  const addresses = addressQuery.data || [];
  const isLoading = addressQuery.isLoading;
  const error = addressQuery.error;
  
  // Handle add new address
  const handleAddAddress = async (data: any) => {
    await createAddress(
      { 
        entityType, 
        entityId, 
        addressData: data 
      }, 
      {
        onSuccess: () => {
          setIsAddDialogOpen(false);
          addressQuery.refetch();
        }
      }
    );
  };

  // Handle edit address
  const handleEditAddress = async (data: any) => {
    if (!selectedAddress) return;
    
    await updateAddress(
      { 
        addressId: selectedAddress.id, 
        addressData: data 
      },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setSelectedAddress(null);
          addressQuery.refetch();
        }
      }
    );
  };

  // Handle delete address
  const handleDeleteAddress = async () => {
    if (!selectedAddress) return;
    
    await deleteAddress(
      { addressId: selectedAddress.id },
      {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setSelectedAddress(null);
          addressQuery.refetch();
        }
      }
    );
  };

  // Handle edit button click
  const handleEditClick = (address: UnifiedAddressRecord) => {
    setSelectedAddress(address);
    setIsEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (address: UnifiedAddressRecord) => {
    setSelectedAddress(address);
    setIsDeleteDialogOpen(true);
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading addresses...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading addresses: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-semibold">Addresses</h3>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add Address</Button>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center text-gray-500">
            No addresses found. Click "Add Address" to create one.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>{address.address_type.charAt(0).toUpperCase() + address.address_type.slice(1)} Address</span>
                  {address.is_primary && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Primary</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{address.address_line_1}</p>
                {address.address_line_2 && <p>{address.address_line_2}</p>}
                <p>
                  {address.suburb}, {address.state} {address.postcode}
                </p>
                <p>{address.country}</p>

                <div className="mt-4 flex justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(address)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-500" onClick={() => handleDeleteClick(address)}>
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Address Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>
              Enter the address details below.
            </DialogDescription>
          </DialogHeader>
          <UnifiedAddressForm 
            onSubmit={handleAddAddress} 
            isLoading={isCreatingAddress} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>
              Update the address details below.
            </DialogDescription>
          </DialogHeader>
          {selectedAddress && (
            <UnifiedAddressForm 
              onSubmit={handleEditAddress} 
              isLoading={isUpdatingAddress}
              initialData={selectedAddress}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the address from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAddress}
              disabled={isDeletingAddress}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingAddress ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
