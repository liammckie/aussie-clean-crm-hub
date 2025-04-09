
import React from 'react';
import { useEntityQueries } from '@/hooks/unified/use-entity-queries';
import { EntityType, ContactType } from '@/types/form-types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { UnifiedContactRecord } from '@/services/unified/types';

interface ContactsListProps {
  entityType: EntityType;
  entityId: string;
  contactType?: ContactType;
}

export function ContactsList({ entityType, entityId, contactType }: ContactsListProps) {
  const { useEntityContacts } = useEntityQueries();
  const { data: contacts, isLoading, error } = useEntityContacts(entityType, entityId);

  // Filter contacts by type if specified
  const filteredContacts = React.useMemo(() => {
    if (!contacts) return [];
    if (!contactType) return contacts;
    
    return contacts.filter(contact => 
      contact.contact_type?.toLowerCase() === contactType.toLowerCase()
    );
  }, [contacts, contactType]);

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

  if (!filteredContacts.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        No {contactType ? contactType.toLowerCase() + " " : ""}contacts found.
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {filteredContacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
}

interface ContactCardProps {
  contact: UnifiedContactRecord;
}

function ContactCard({ contact }: ContactCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{contact.name}</h4>
            <p className="text-sm text-gray-500">{contact.position || 'No position'}</p>
            <p className="text-sm mt-2">{contact.email}</p>
            {contact.phone && <p className="text-sm">{contact.phone}</p>}
            {contact.mobile && <p className="text-sm">{contact.mobile}</p>}
            {contact.contact_type && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {contact.contact_type}
                </span>
                {contact.is_primary && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Primary
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="text-red-500">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
