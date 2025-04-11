
import React, { useState, useEffect } from 'react';
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

interface SiteAddressTabProps {
  siteId: string;
  onAddressAdded?: () => void;
}

export function SiteAddressTab({ siteId, onAddressAdded }: SiteAddressTabProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState<AddressType>(AddressType.SITE);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<UnifiedAddressRecord | null>(null);
  const [addresses, setAddresses] = useState<UnifiedAddressRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isPending, startTypedTransition } = useTypedTransition<void>();
  
  // Load addresses when component mounts
  const loadAddresses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // First check if we need to migrate addresses
      await DataMigrationService.migrateSiteAddress(siteId);
      
      // Then load the addresses
      const response = await unifiedAddressService.getEntityAddresses(EntityType.SITE, siteId);
      
      if (isApiError(response)) {
        throw new Error(response.message);
      }
      
      setAddresses(response.data);
    } catch (error: any) {
      AppLogger.error(LogCategory.SITE, `Error loading addresses: ${error.message}`, { siteId, error });
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [siteId]);

  const handleAddAddress = async (formData: any) => {
    try {
      AppLogger.debug(LogCategory.SITE, `Creating address for site ${siteId}`, { formData });
      
      const response = await unifiedAddressService.createAddress(
        EntityType.SITE,
        siteId,
        {
          ...formData,
          is_primary: Boolean(formData.is_primary),
          entity_id: siteId,
          entity_type: EntityType.SITE
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
      AppLogger.error(LogCategory.SITE, `Failed to add address: ${error.message}`, { siteId, error });
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
      AppLogger.error(LogCategory.SITE, `Failed to update address: ${error.message}`, { siteId, error });
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
      AppLogger.error(LogCategory.SITE, `Failed to delete address: ${error.message}`, { 
        siteId, 
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
          <CardTitle>Site Addresses</CardTitle>
          <CardDescription>Manage addresses for this site</CardDescription>
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
                Add an address for this site.
              </DialogDescription>
            </DialogHeader>
            <UnifiedAddressForm 
              onSubmit={handleAddAddress} 
              isLoading={isPending}
              initialData={{ 
                address_type: selectedAddressType,
                entity_id: siteId,
                entity_type: EntityType.SITE 
              }}
              buttonText="Add Address"
              showLocationFields={true}
              showNotes={true}
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
                showLocationFields={true}
                showNotes={true}
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
                This action cannot be undone. This will permanently delete the address from the site record.
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
