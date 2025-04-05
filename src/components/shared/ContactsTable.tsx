
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
import { Mail, Phone, User, Building, Edit, Trash, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UnifiedContactRecord, EntityType } from '@/services/client';

interface ContactsTableProps {
  contacts: UnifiedContactRecord[];
  onEdit?: (contact: UnifiedContactRecord) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
  showEntityType?: boolean;
  compact?: boolean;
}

export const ContactsTable = ({ 
  contacts, 
  onEdit, 
  onDelete, 
  onAdd,
  showEntityType = false,
  compact = false
}: ContactsTableProps) => {
  // Function to format entity type for display
  const formatEntityType = (type: EntityType): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Function to get contact type badge color
  const getContactTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'primary':
        return 'bg-blue-100 text-blue-800';
      case 'billing':
        return 'bg-green-100 text-green-800';
      case 'operations':
        return 'bg-amber-100 text-amber-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {onAdd && (
        <div className="mb-4 flex justify-end">
          <Button onClick={onAdd} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {showEntityType && <TableHead>Entity Type</TableHead>}
            <TableHead>Name</TableHead>
            {!compact && <TableHead>Position</TableHead>}
            <TableHead>Contact Type</TableHead>
            <TableHead>Contact Info</TableHead>
            {!compact && <TableHead>Company</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={showEntityType ? (compact ? 5 : 7) : (compact ? 4 : 6)} 
                className="text-center py-8 text-muted-foreground"
              >
                No contacts found
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id}>
                {showEntityType && (
                  <TableCell>
                    <Badge variant="outline">{formatEntityType(contact.entity_type)}</Badge>
                  </TableCell>
                )}
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {contact.name}
                    {contact.is_primary && (
                      <Badge className="bg-primary text-primary-foreground">Primary</Badge>
                    )}
                  </div>
                </TableCell>
                {!compact && (
                  <TableCell>{contact.position || 'N/A'}</TableCell>
                )}
                <TableCell>
                  <Badge className={getContactTypeColor(contact.contact_type)}>
                    {contact.contact_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${contact.email}`} className="hover:underline">
                        {contact.email}
                      </a>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${contact.phone}`} className="hover:underline">
                          {contact.phone}
                        </a>
                      </div>
                    )}
                    {contact.mobile && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a href={`tel:${contact.mobile}`} className="hover:underline">
                          {contact.mobile} (Mobile)
                        </a>
                      </div>
                    )}
                  </div>
                </TableCell>
                {!compact && (
                  <TableCell>
                    {contact.company && (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        {contact.company}
                      </div>
                    )}
                  </TableCell>
                )}
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
                        <DropdownMenuItem onClick={() => onEdit(contact)}>
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem 
                          onClick={() => onDelete(contact.id)}
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

export default ContactsTable;
