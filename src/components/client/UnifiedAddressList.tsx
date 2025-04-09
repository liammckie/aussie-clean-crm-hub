
import React, { useState } from 'react';
import { useUnifiedAddresses } from '@/hooks/use-unified-addresses';
import { EntityType } from '@/types/database-schema';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Pencil, Trash2, Home } from 'lucide-react';
import { UnifiedAddressRecord } from '@/services/unified/types';
import { UnifiedAddressForm } from './UnifiedAddressForm';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { formatAddressDisplay } from '@/utils/formatters';

interface UnifiedAddressListProps {
  entityType: EntityType;
  entityId: string;
  title?: string;
  emptyMessage?: string;
  showAddButton?: boolean;
}

export function UnifiedAddressList({
  entityType,
  entityId,
  title = "Addresses",
  emptyMessage = "No addresses found",
  showAddButton = true
}: UnifiedAddressListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UnifiedAddressRecord | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  
  const { 
    addresses, 
    isLoading, 
    createAddress, 
    updateAddress,
    deleteAddress,
    isCreating,
    isUpdating,
    isDeleting
  } = useUnifiedAddresses(entityType, entityId, {
    onAddressCreated: () => setIsAddDialogOpen(false),
    onAddressUpdated: () => setEditingAddress(null)
  });

  const handleAddAddress = (data: any) => {
    createAddress(data);
  };

  const handleUpdateAddress = (data: any) => {
    if (editingAddress) {
      updateAddress({ addressId: editingAddress.id, addressData: data });
    }
  };

  const handleDeleteConfirm = () => {
    if (addressToDelete) {
      deleteAddress(addressToDelete);
      setAddressToDelete(null);
    }
  };

  const renderAddressItem = (address: UnifiedAddressRecord) => {
    const addressDisplay = formatAddressDisplay(address);

    return (
      <Card key={address.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {address.name && <span className="font-medium">{address.name}</span>}
              <Badge>{address.address_type}</Badge>
              {address.is_primary && (
                <Badge variant="outline" className="bg-primary/10 text-primary flex items-center gap-1">
                  <Home className="h-3 w-3" />
                  Primary
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setEditingAddress(address)}
                title="Edit address"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setAddressToDelete(address.id)}
                title="Delete address"
                disabled={address.is_primary && addresses.length > 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-2">
          <div className="text-sm">
            {addressDisplay.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {showAddButton && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Address
          </Button>
        )}
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {emptyMessage}
          </CardContent>
          {showAddButton && (
            <CardFooter className="flex justify-center pb-6 pt-0">
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Address
              </Button>
            </CardFooter>
          )}
        </Card>
      ) : (
        <div>
          {addresses.map(address => renderAddressItem(address))}
        </div>
      )}

      {/* Add Address Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>
              Add an address for this entity. You can set it as the primary address.
            </DialogDescription>
          </DialogHeader>
          <UnifiedAddressForm 
            onSubmit={handleAddAddress} 
            isLoading={isCreating}
            buttonText="Add Address"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog 
        open={editingAddress !== null} 
        onOpenChange={(open) => !open && setEditingAddress(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>
              Update the address information.
            </DialogDescription>
          </DialogHeader>
          {editingAddress && (
            <UnifiedAddressForm 
              initialData={{
                address_line_1: editingAddress.address_line_1,
                address_line_2: editingAddress.address_line_2,
                suburb: editingAddress.suburb,
                state: editingAddress.state,
                postcode: editingAddress.postcode,
                country: editingAddress.country,
                address_type: editingAddress.address_type,
                is_primary: editingAddress.is_primary,
                name: editingAddress.name
              }}
              onSubmit={handleUpdateAddress} 
              isLoading={isUpdating}
              buttonText="Update Address"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={addressToDelete !== null}
        onOpenChange={(open) => !open && setAddressToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the address.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default UnifiedAddressList;
