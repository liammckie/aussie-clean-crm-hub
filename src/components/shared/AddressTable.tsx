
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { PlusCircle, MoreHorizontal, Pencil, Trash2, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { EntityType } from '@/services/client/types';
import { AddressType } from '@/types/form-types';

// Define the unified address record structure
export interface UnifiedAddressRecord {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  name?: string;
  address_line_1: string;
  address_line_2?: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
  address_type: AddressType;
  is_primary?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AddressTableProps {
  addresses: UnifiedAddressRecord[];
  onEdit?: (address: UnifiedAddressRecord) => void;
  onDelete?: (addressId: string) => void;
  onAdd?: () => void;
  showEntityType?: boolean;
  isLoading?: boolean;
}

const AddressTable: React.FC<AddressTableProps> = ({ 
  addresses, 
  onEdit, 
  onDelete, 
  onAdd, 
  showEntityType = true,
  isLoading = false 
}) => {
  // Function to format address for display
  const formatAddress = (address: UnifiedAddressRecord): string => {
    const parts = [
      address.address_line_1,
      address.address_line_2,
      address.suburb,
      `${address.state} ${address.postcode}`,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  // Function to get address type label with proper formatting
  const getAddressTypeLabel = (type: AddressType): string => {
    const typeMap: Record<AddressType, string> = {
      'billing': 'Billing',
      'postal': 'Postal',
      'physical': 'Physical',
      'shipping': 'Shipping',
      'head_office': 'Head Office',
      'branch': 'Branch',
      'residential': 'Residential',
      'commercial': 'Commercial',
      'warehouse': 'Warehouse',
      'site': 'Site'
    };
    return typeMap[type] || type;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-medium">Addresses</h2>
        </div>
        {onAdd && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAdd} 
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Address</span>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground opacity-40 mb-4" />
            <p className="text-muted-foreground">No addresses found</p>
            {onAdd && (
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={onAdd}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add first address
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                {showEntityType && <TableHead>Entity</TableHead>}
                <TableHead className="w-[50%]">Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addresses.map((address) => (
                <TableRow key={address.id}>
                  <TableCell>
                    <span className="font-medium">
                      {getAddressTypeLabel(address.address_type)}
                      {address.is_primary && (
                        <span className="ml-2 text-xs bg-primary/20 text-primary py-0.5 px-1.5 rounded">
                          Primary
                        </span>
                      )}
                    </span>
                  </TableCell>
                  {showEntityType && (
                    <TableCell>
                      <span className="capitalize">
                        {address.name || address.entity_type}
                      </span>
                    </TableCell>
                  )}
                  <TableCell>{formatAddress(address)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onEdit && (
                          <DropdownMenuItem onClick={() => onEdit(address)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem 
                            onClick={() => onDelete(address.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AddressTable;
