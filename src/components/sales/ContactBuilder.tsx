
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnifiedContactForm } from '@/components/client/UnifiedContactForm';
import { ContactType, EntityType, UnifiedContactFormData } from '@/types/form-types';
import { useContactMutations } from '@/hooks/unified/use-contact-mutations';
import { useEntityQueries } from '@/hooks/unified/use-entity-queries';
import { PlusCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ContactsList } from '@/components/client/ContactsList';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ContactBuilderProps {
  opportunityId: string;
  onContactsUpdated: () => void;
}

export function ContactBuilder({ opportunityId, onContactsUpdated }: ContactBuilderProps) {
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const { createContact, isCreatingContact } = useContactMutations();
  const { useEntityContacts } = useEntityQueries();
  
  const { data: contacts, isLoading } = useEntityContacts(EntityType.CONTACT, opportunityId);
  
  const handleAddContact = async (contactData: UnifiedContactFormData) => {
    await createContact({
      entityType: EntityType.CONTACT,
      entityId: opportunityId,
      contactData
    });
    setIsAddContactDialogOpen(false);
    onContactsUpdated();
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contact Management</CardTitle>
        <Button onClick={() => setIsAddContactDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Add and manage contacts associated with this opportunity. These contacts can be converted to client contacts when the opportunity is won.
        </p>
        
        <Separator />
        
        <ContactsList entityType={EntityType.CONTACT} entityId={opportunityId} />
      </CardContent>
      
      <Dialog open={isAddContactDialogOpen} onOpenChange={setIsAddContactDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          
          <UnifiedContactForm
            onSubmit={handleAddContact}
            isLoading={isCreatingContact}
            contactTypes={[
              ContactType.PRIMARY,
              ContactType.BILLING,
              ContactType.TECHNICAL,
              ContactType.OPERATIONS
            ]}
            buttonText="Add Contact"
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
