
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
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

interface ClientContactsTabProps {
  clientId: string;
  onContactAdded?: () => void;
}

export function ClientContactsTab({ clientId, onContactAdded }: ClientContactsTabProps) {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  
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
  } = useEntityContacts('client', clientId);

  // Define client-specific contact types - make sure to include 'employee'
  const clientContactTypes: ContactType[] = [
    'client_primary', 
    'client_site', 
    'hr_payroll',
    'emergency',
    'employee' // Added employee for internal staff
  ];

  const handleContactSubmit = (formData: any) => {
    createContact(
      {
        entityType: 'client',
        entityId: clientId,
        contactData: {
          ...formData,
          is_primary: formData.is_primary || false
        }
      },
      {
        onSuccess: () => {
          setIsContactDialogOpen(false);
          refetch();
          if (onContactAdded) {
            onContactAdded();
          }
          toast.success('Contact added successfully!');
        },
        onError: (error: any) => {
          toast.error(`Failed to add contact: ${error.message}`);
        }
      }
    );
  };

  const handleEditContact = (contact: any) => {
    // Implementation for editing - would open a dialog with the form pre-populated
    toast.info("Edit functionality will be implemented in future sprint");
  };

  const handleDeleteContact = (contactId: string) => {
    setContactToDelete(contactId);
    setDeleteAlertOpen(true);
  };

  const confirmDeleteContact = async () => {
    if (!contactToDelete) return;
    
    deleteContact(
      { contactId: contactToDelete },
      {
        onSuccess: () => {
          toast.success("Contact deleted successfully");
          refetch();
          setDeleteAlertOpen(false);
          setContactToDelete(null);
        },
        onError: (error: any) => {
          toast.error(`Failed to delete contact: ${error.message}`);
          setDeleteAlertOpen(false);
          setContactToDelete(null);
        }
      }
    );
  };

  const handleAddClick = () => {
    setIsContactDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Client Contacts</CardTitle>
          <CardDescription>Manage contacts for this client</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">Loading contacts...</div>
        ) : error ? (
          <div className="p-4 border rounded bg-red-50 text-red-800">
            Error loading contacts: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : (
          <ContactsTable
            contacts={contacts || []}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
            onAdd={handleAddClick}
            showEntityType={false}
            isLoading={isLoading || isDeletingContact}
          />
        )}

        <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <UnifiedContactForm 
              onSubmit={handleContactSubmit}
              isLoading={isCreatingContact}
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
                disabled={isDeletingContact}
              >
                {isDeletingContact ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
