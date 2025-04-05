
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ContactsList } from '@/components/client/ContactsList';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ContactForm } from '@/components/client/ContactForm';
import { toast } from 'sonner';
import { clientService } from '@/services';
import { ContactRecord } from '@/services/client';

interface ClientContactsTabProps {
  clientId: string;
  contacts: ContactRecord[];
  onContactAdded?: () => void;
}

export function ClientContactsTab({ clientId, contacts, onContactAdded }: ClientContactsTabProps) {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

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

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>Client Contacts</CardTitle>
        <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-2" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <ContactForm onSubmit={handleContactSubmit} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {contacts && contacts.length > 0 ? (
          <ContactsList contacts={contacts} />
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No contacts have been added yet.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsContactDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add your first contact
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
