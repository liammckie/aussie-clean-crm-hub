
import React from 'react';
import { useUnifiedEntities } from '@/hooks/use-unified-entities';
import { EntityType } from '@/types/form-types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { UnifiedContactRecord } from '@/services/unified/types';

export interface ContactsListProps {
  entityType: string;
  entityId: string;
  contactType?: string;
  onEdit?: (contact: UnifiedContactRecord) => void;
  onDelete?: (contactId: string) => void;
}

export function ContactsList({ 
  entityType, 
  entityId, 
  contactType,
  onEdit,
  onDelete
}: ContactsListProps) {
  const { useEntityContacts, deleteContact, isDeletingContact } = useUnifiedEntities();

  const { data: contacts = [], isLoading, error } = useEntityContacts(
    entityType as EntityType, 
    entityId,
    { enabled: !!entityId }
  );

  const filteredContacts = contactType 
    ? contacts.filter(contact => contact.contact_type === contactType.toLowerCase())
    : contacts;

  const handleDelete = async (contactId: string) => {
    if (!onDelete) {
      if (window.confirm('Are you sure you want to delete this contact?')) {
        try {
          await deleteContact({ contactId });
          toast.success('Contact deleted successfully');
        } catch (error) {
          toast.error(`Failed to delete contact: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } else {
      onDelete(contactId);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading contacts...</div>;
  }

  if (error) {
    return (
      <div className="p-4 border rounded bg-red-50 text-red-800">
        Error loading contacts: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  if (filteredContacts.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-gray-500">No contacts found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredContacts.map((contact) => (
        <div key={contact.id} className="p-4 border rounded-md shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium">
                  {contact.first_name || contact.last_name 
                    ? `${contact.first_name || ''} ${contact.last_name || ''}` 
                    : contact.name}
                </h4>
                {contact.is_primary && (
                  <Badge variant="outline" className="text-xs">Primary</Badge>
                )}
                {contact.contact_type && (
                  <Badge variant="secondary" className="text-xs">
                    {contact.contact_type.charAt(0).toUpperCase() + contact.contact_type.slice(1)}
                  </Badge>
                )}
              </div>
              {contact.position && (
                <p className="text-sm text-muted-foreground">{contact.position}</p>
              )}
              <p className="text-sm mt-1">{contact.email}</p>
              {contact.phone && (
                <p className="text-sm">{contact.phone}</p>
              )}
              {contact.mobile && (
                <p className="text-sm">Mobile: {contact.mobile}</p>
              )}
            </div>
            
            <div className="flex space-x-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(contact)}
                  className="h-8 w-8"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDelete(contact.id)}
                disabled={isDeletingContact}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
