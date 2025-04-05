
import React, { useState } from 'react';
import { useClients } from '@/hooks/use-clients';
import { AddressFormData, AddressType } from '@/services/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AddressForm } from '@/components/client/AddressForm';
import { Plus, MapPin, Pencil, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface ClientAddressTabProps {
  clientId: string;
  onAddressAdded?: () => void;
}

export function ClientAddressTab({ clientId, onAddressAdded }: ClientAddressTabProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState<AddressType>('billing');
  
  const { useClientAddresses, createAddress, isCreatingAddress } = useClients();
  const { data: addresses, isLoading, error, refetch } = useClientAddresses(clientId);

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
        },
        onError: (error: any) => {
          toast.error(`Failed to add address: ${error.message}`);
        }
      }
    );
  };

  const getAddressTypeLabel = (type: string): string => {
    switch (type) {
      case 'billing':
        return 'Billing';
      case 'postal':
        return 'Postal';
      case 'physical':
        return 'Physical';
      default:
        return type;
    }
  };

  const getAddressTypeColor = (type: string): string => {
    switch (type) {
      case 'billing':
        return 'bg-blue-100 text-blue-800';
      case 'postal':
        return 'bg-green-100 text-green-800';
      case 'physical':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Client Addresses</CardTitle>
          <CardDescription>Manage addresses for this client</CardDescription>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Address
            </Button>
          </DialogTrigger>
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
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading addresses...</div>
        ) : error ? (
          <div className="p-4 border rounded bg-red-50 text-red-800">
            Error loading addresses: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : addresses && addresses.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {addresses.map((address) => (
              <div key={address.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getAddressTypeColor(address.address_type)}>
                    {getAddressTypeLabel(address.address_type)}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                    <div>
                      <div>{address.street}</div>
                      {address.suburb && <div>{address.suburb}, {address.state} {address.postcode}</div>}
                      <div>{address.country}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border border-dashed rounded-lg">
            <MapPin className="h-10 w-10 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium mb-2">No addresses found</h3>
            <p className="text-gray-500 mb-4">This client doesn't have any addresses yet.</p>
            <Button onClick={() => setOpenDialog(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Address
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
