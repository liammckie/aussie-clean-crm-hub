
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Edit, Trash, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UnifiedAddressRecord, AddressType } from '@/services/client';

interface AddressTableProps {
  addresses: UnifiedAddressRecord[];
  onEdit?: (address: UnifiedAddressRecord) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  showEntityType?: boolean;
}

export const AddressTable = ({ 
  addresses, 
  onEdit, 
  onDelete, 
  onAdd,
  showEntityType = false
}: AddressTableProps) => {
  // Function to format the full address as a single string
  const formatFullAddress = (address: UnifiedAddressRecord): string => {
    const parts = [address.address_line_1];
    if (address.address_line_2) parts.push(address.address_line_2);
    parts.push(`${address.suburb}, ${address.state} ${address.postcode}`);
    if (address.country !== 'Australia') parts.push(address.country);
    return parts.join(', ');
  };

  // Function to get badge color for address type
  const getAddressTypeColor = (type: AddressType): string => {
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

  // Function to format entity type for display
  const formatEntityType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div>
      {onAdd && (
        <div className="mb-4 flex justify-end">
          <Button onClick={onAdd} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Address
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {showEntityType && <TableHead>Entity Type</TableHead>}
            <TableHead>Address Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="hidden md:table-cell">Street Address</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addresses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showEntityType ? 6 : 5} className="text-center py-8 text-muted-foreground">
                No addresses found
              </TableCell>
            </TableRow>
          ) : (
            addresses.map((address) => (
              <TableRow key={address.id}>
                {showEntityType && (
                  <TableCell>
                    <Badge variant="outline">{formatEntityType(address.entity_type)}</Badge>
                  </TableCell>
                )}
                <TableCell className="font-medium">
                  {address.name || 'Unnamed Address'}
                  {address.is_primary && (
                    <Badge className="ml-2 bg-primary text-primary-foreground">Primary</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getAddressTypeColor(address.address_type)}>
                    {address.address_type.charAt(0).toUpperCase() + address.address_type.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{address.address_line_1}</span>
                  </div>
                  {address.address_line_2 && (
                    <span className="text-xs text-muted-foreground block ml-6">
                      {address.address_line_2}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {address.suburb}, {address.state} {address.postcode}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <span className="sr-only">Open menu</span>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(address)}>
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem 
                          onClick={() => onDelete(address.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AddressTable;
