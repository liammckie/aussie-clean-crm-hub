
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UnifiedAddressRecord } from '@/services/unified/types';
import { AddressType } from '@/types/database-schema'; // Import from database schema
import { Badge } from '@/components/ui/badge';
import { Edit, MapPin, Trash } from 'lucide-react';

interface AddressTableProps {
  addresses: UnifiedAddressRecord[];
  onEdit?: (address: UnifiedAddressRecord) => void;
  onDelete?: (addressId: string) => void;
  onAdd?: () => void;
  isLoading?: boolean;
}

export function AddressTable({ 
  addresses = [], 
  onEdit,
  onDelete,
  onAdd,
  isLoading = false
}: AddressTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="font-medium text-lg mb-2">No Addresses Added</h3>
        <p className="text-muted-foreground mb-4">There are no addresses associated with this entity yet.</p>
        {onAdd && (
          <Button onClick={onAdd}>
            Add First Address
          </Button>
        )}
      </div>
    );
  }

  const getAddressTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
  };

  const getAddressSummary = (address: UnifiedAddressRecord) => {
    const parts = [];
    if (address.address_line_1) parts.push(address.address_line_1);
    if (address.suburb) parts.push(address.suburb);
    if (address.state) parts.push(address.state);
    if (address.postcode) parts.push(address.postcode);
    return parts.join(', ');
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead className="hidden md:table-cell">Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addresses.map((address) => (
            <TableRow key={address.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{getAddressTypeLabel(address.address_type as string)}</span>
                  {address.is_primary && (
                    <Badge variant="outline" className="bg-primary/10">Primary</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {address.name || '-'}
              </TableCell>
              <TableCell className="max-w-[200px] md:max-w-none truncate">
                {getAddressSummary(address)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {onEdit && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(address)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  )}
                  {onDelete && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(address.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
