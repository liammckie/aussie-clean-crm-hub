
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ContactForm } from '@/components/client/ContactForm';
import { toast } from 'sonner';
import { clientService } from '@/services';
import { ContactRecord, UnifiedContactRecord } from '@/services/client';
import ContactsTable from '@/components/shared/ContactsTable';

interface ClientContactsTabProps {
  clientId: string;
  contacts: ContactRecord[];
  onContactAdded?: () => void;
}

export function ClientContactsTab({ clientId, contacts, onContactAdded }: ClientContactsTabProps) {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [unifiedContacts, setUnifiedContacts] = useState<UnifiedContactRecord[]>([]);

  // Convert client contacts to unified format for the table
  useEffect(() => {
    if (contacts && contacts.length > 0) {
      const transformed: UnifiedContactRecord[] = contacts.map(contact => ({
        id: contact.id,
        entity_type: 'client',
        entity_id: clientId,
        name: contact.name,
        position: contact.position,
        email: contact.email,
        phone: contact.phone,
        mobile: contact.mobile,
        is_primary: contact.is_primary,
        contact_type: contact.contact_type,
        created_at: contact.created_at,
        updated_at: contact.updated_at
      }));
      setUnifiedContacts(transformed);
    } else {
      setUnifiedContacts([]);
    }
  }, [contacts, clientId]);

  const handleContactSubmit = (data: any) => {
    if (!clientId) return;
    
    const contactData = { ...data, client_id: clientId };
    
    clientService.createClientContact(clientId, data)
      .then(response => {
        if ('category' in response) {
          toast.error(response.message);
          return;
        }
        toast.success('Contact added successfully!');
        setIsContactDialogOpen(false);
        if (onContactAdded) {
          onContactAdded();
        }
      })
      .catch(error => {
        toast.error(`Failed to add contact: ${error.message}`);
      });
  };

  const handleEditContact = (contact: UnifiedContactRecord) => {
    // Implementation for editing - would open a dialog with the form pre-populated
    toast.info("Edit functionality will be implemented in future sprint");
  };

  const handleDeleteContact = (contactId: string) => {
    // Implementation for deleting a contact
    toast.info("Delete functionality will be implemented in future sprint");
  };

  const handleAddClick = () => {
    setIsContactDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Client Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <ContactsTable
          contacts={unifiedContacts}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          onAdd={handleAddClick}
          showEntityType={false}
        />

        <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <ContactForm onSubmit={handleContactSubmit} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
