
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { ContactsList } from './ContactsList';
import { ClientContactModal } from './ClientContactModal';
import { UnifiedContactFormData, ContactType } from '@/types/form-types';
import { useUnifiedContacts } from '@/hooks/unified/use-contact-mutations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ClientContactsTabProps {
  clientId: string;
}

const ClientContactsTab = ({ clientId }: ClientContactsTabProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { createContact, isCreatingContact } = useUnifiedContacts();

  const handleAddContact = async (contactData: UnifiedContactFormData) => {
    await createContact({
      entityType: 'client',
      entityId: clientId,
      contactData
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
      }
    });
  };

  // List of contact types available for clients
  const availableContactTypes = [
    ContactType.PRIMARY,
    ContactType.BILLING,
    ContactType.OPERATIONS,
    ContactType.TECHNICAL,
    ContactType.EMERGENCY
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Contacts</h3>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="primary">Primary</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <ContactsList clientId={clientId} />
        </TabsContent>
        <TabsContent value="primary">
          <ContactsList clientId={clientId} contactType="primary" />
        </TabsContent>
        <TabsContent value="billing">
          <ContactsList clientId={clientId} contactType="billing" />
        </TabsContent>
        <TabsContent value="operations">
          <ContactsList clientId={clientId} contactType="operations" />
        </TabsContent>
      </Tabs>

      <ClientContactModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleAddContact}
        isLoading={isCreatingContact}
        contactTypes={availableContactTypes}
      />
    </div>
  );
};

export default ClientContactsTab;
