
import React, { useState, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import ContactsTable from '@/components/shared/ContactsTable';
import { useUnifiedEntities } from '@/hooks/use-unified-entities';
import { UnifiedContactForm } from '@/components/client/UnifiedContactForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ContactType } from '@/types/form-types';
import { EntityType } from '@/services/client/types';
import { UnifiedContactRecord } from '@/services/unified/types';
import { useTypedTransition } from '@/hooks/use-suspense-transition';
import { AppLogger, LogCategory } from '@/utils/logging';

interface ClientContactsTabProps {
  clientId: string;
  onContactAdded?: () => void;
}

export function ClientContactsTab({ clientId, onContactAdded }: ClientContactsTabProps) {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const { isPending, startTypedTransition } = useTypedTransition<void>();
  
  const { 
    useEntityContacts, 
    createContact, 
    isCreatingContact,
    deleteContact,
    isDeletingContact 
  } = useUnifiedEntities();
  
  const { 
    data: contacts, 
    isLoading, 
    error, 
    refetch 
  } = useEntityContacts(EntityType.CLIENT, clientId);

  // Define client-specific contact types
  const clientContactTypes: ContactType[] = [
    'Primary', 
    'Billing', 
    'Operations', 
    'Emergency',
    'Technical'
  ];

  const handleContactSubmit = useCallback((formData: any) => {
    AppLogger.debug(LogCategory.CLIENT, `Creating contact for client ${clientId}`, { formData });
    
    // Show immediate toast feedback to user
    enhancedToast.info("Processing your request...");
    
    startTypedTransition(() => {
      createContact(
        {
          entityType: EntityType.CLIENT,
          entityId: clientId,
          contactData: {
            ...formData,
            is_primary: Boolean(formData.is_primary)
          }
        },
        {
          onSuccess: () => {
            setIsContactDialogOpen(false);
            refetch();
            if (onContactAdded) {
              onContactAdded();
            }
            enhancedToast.success('Contact added successfully!');
          },
          onError: (error: Error) => {
            AppLogger.error(LogCategory.ERROR, `Failed to add contact: ${error.message}`, { clientId, error });
            enhancedToast.error(`Failed to add contact: ${error.message}`);
          }
        }
      );
    });
  }, [clientId, createContact, refetch, onContactAdded, startTypedTransition]);

  const handleEditContact = (contact: UnifiedContactRecord) => {
    // Implementation for editing - would open a dialog with the form pre-populated
    enhancedToast.info("Edit functionality will be implemented in future sprint");
  };

  const handleDeleteContact = (contactId: string) => {
    setContactToDelete(contactId);
    setDeleteAlertOpen(true);
  };

  const confirmDeleteContact = useCallback(() => {
    if (!contactToDelete) return;
    
    AppLogger.debug(LogCategory.CLIENT, `Deleting contact ${contactToDelete} for client ${clientId}`);
    
    // Show immediate toast feedback
    enhancedToast.info("Deleting contact...");
    
    startTypedTransition(() => {
      deleteContact(
        { contactId: contactToDelete },
        {
          onSuccess: () => {
            enhancedToast.success("Contact deleted successfully");
            refetch();
            setDeleteAlertOpen(false);
            setContactToDelete(null);
          },
          onError: (error: Error) => {
            AppLogger.error(LogCategory.ERROR, `Failed to delete contact: ${error.message}`, { clientId, contactId: contactToDelete, error });
            enhancedToast.error(`Failed to delete contact: ${error.message}`);
            setDeleteAlertOpen(false);
            setContactToDelete(null);
          }
        }
      );
    });
  }, [contactToDelete, clientId, deleteContact, refetch, startTypedTransition]);

  const handleAddClick = () => {
    setIsContactDialogOpen(true);
  };

  // Safely type the contacts data
  const typedContacts = React.useMemo(() => {
    if (!contacts) return [] as UnifiedContactRecord[];
    
    // Cast to UnifiedContactRecord[] with proper type checks
    return (contacts as any[]).map((contact: any): UnifiedContactRecord => ({
      id: contact.id,
      entity_id: contact.entity_id,
      entity_type: contact.entity_type,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      mobile: contact.mobile,
      position: contact.position,
      company: contact.company,
      is_primary: Boolean(contact.is_primary),
      contact_type: contact.contact_type,
      notes: contact.notes,
      account_manager: contact.account_manager,
      state_manager: contact.state_manager,
      national_manager: contact.national_manager,
      created_at: contact.created_at,
      updated_at: contact.updated_at
    }));
  }, [contacts]);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Client Contacts</CardTitle>
          <CardDescription>Manage contacts for this client</CardDescription>
        </div>
        <Button variant="default" onClick={handleAddClick} disabled={isPending}>
          Add Contact
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading || isPending ? (
          <div className="text-center py-4">Loading contacts...</div>
        ) : error ? (
          <div className="p-4 border rounded bg-red-50 text-red-800">
            Error loading contacts: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : (
          <ContactsTable
            contacts={typedContacts}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
            onAdd={handleAddClick}
            showEntityType={false}
            isLoading={isLoading || isDeletingContact || isPending}
          />
        )}

        <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
          <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <UnifiedContactForm 
              onSubmit={handleContactSubmit}
              isLoading={isCreatingContact || isPending}
              contactTypes={clientContactTypes}
              buttonText="Add Contact"
            />
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this contact?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the contact from the client record.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteContact}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeletingContact || isPending}
              >
                {isDeletingContact || isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
