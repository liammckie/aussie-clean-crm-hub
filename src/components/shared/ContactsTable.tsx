
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
import { 
  PlusCircle, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Users, 
  Mail, 
  Phone 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { EntityType } from '@/services/client/types';

// Define the unified contact record structure
export interface UnifiedContactRecord {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  name: string;
  email: string;
  phone?: string;
  mobile?: string;
  position?: string;
  company?: string;
  contact_type: string;
  is_primary: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ContactsTableProps {
  contacts: UnifiedContactRecord[];
  onEdit?: (contact: UnifiedContactRecord) => void;
  onDelete?: (contactId: string) => void;
  onAdd?: () => void;
  showEntityType?: boolean;
  isLoading?: boolean;
}

const ContactsTable: React.FC<ContactsTableProps> = ({ 
  contacts, 
  onEdit, 
  onDelete, 
  onAdd, 
  showEntityType = true,
  isLoading = false 
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-medium">Contacts</h2>
        </div>
        {onAdd && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onAdd} 
            className="flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Contact</span>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading contacts...</div>
      ) : contacts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-40 mb-4" />
            <p className="text-muted-foreground">No contacts found</p>
            {onAdd && (
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={onAdd}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add first contact
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                {showEntityType && <TableHead>Entity</TableHead>}
                <TableHead>Contact Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell>
                    <div>
                      <span className="font-medium">{contact.name}</span>
                      {contact.is_primary && (
                        <span className="ml-2 text-xs bg-primary/20 text-primary py-0.5 px-1.5 rounded">
                          Primary
                        </span>
                      )}
                      {contact.position && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {contact.position}
                          {contact.company && contact.company !== contact.name && ` at ${contact.company}`}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  {showEntityType && (
                    <TableCell>
                      <span className="capitalize">{contact.entity_type}</span>
                    </TableCell>
                  )}
                  <TableCell>
                    <span className="capitalize">{contact.contact_type}</span>
                  </TableCell>
                  <TableCell>
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-primary hover:underline">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{contact.email}</span>
                    </a>
                  </TableCell>
                  <TableCell>
                    {contact.phone && (
                      <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-1 hover:underline">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{contact.phone}</span>
                      </a>
                    )}
                    {contact.mobile && !contact.phone && (
                      <a href={`tel:${contact.mobile.replace(/\s/g, '')}`} className="flex items-center gap-1 hover:underline">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{contact.mobile}</span>
                      </a>
                    )}
                  </TableCell>
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
                          <DropdownMenuItem onClick={() => onEdit(contact)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem 
                            onClick={() => onDelete(contact.id)}
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

export default ContactsTable;
