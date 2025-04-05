
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';
import ContactsTable from '@/components/shared/ContactsTable';
import { useUnifiedEntities } from '@/hooks/use-unified-entities';
import { UnifiedContactForm } from '@/components/client/UnifiedContactForm';
import { UnifiedContactFormData } from '@/types/form-types';
import { validateContact } from '@/services/validation';
import { X } from 'lucide-react';
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

  const handleContactSubmit = (formData: UnifiedContactFormData) => {
    // Validate the data before submission
    const validationResult = validateContact(formData);
    if (!validationResult.success) {
      // Fix: Safely extract the first error message
      const errors = validationResult.error.format();
      let firstError = "Please check your form data";
      
      // Safely get the first error by finding an entry with _errors array
      const errorEntry = Object.entries(errors)
        .find(([key, value]) => {
          return key !== '_errors' && 
            typeof value === 'object' && 
            '_errors' in value && 
            Array.isArray(value._errors) && 
            value._errors.length > 0;
        });
        
      if (errorEntry) {
        const [key, value] = errorEntry;
        // We know _errors exists and is an array based on our find condition
        firstError = `${key}: ${(value as {_errors: string[]})._errors[0]}`;
      }
      
      toast.error(`Validation failed: ${firstError}`);
      return;
    }
    
    // If creating a primary contact, check if one already exists
    if (formData.is_primary && contacts?.some(c => c.is_primary)) {
      if (!confirm("A primary contact already exists. Set this new contact as primary instead?")) {
        return;
      }
    }

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

  const contactTypes = ['Primary', 'Billing', 'Operations', 'Emergency', 'Technical', 'Support', 'Sales'];

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
            <DialogHeader className="flex justify-between items-center">
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogClose asChild>
                <button className="rounded-full h-6 w-6 flex items-center justify-center border border-input">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              </DialogClose>
            </DialogHeader>
            <UnifiedContactForm 
              onSubmit={handleContactSubmit}
              isLoading={isCreatingContact}
              contactTypes={['Primary', 'Billing', 'Operations', 'Emergency', 'Technical', 'Support', 'Sales']}
              buttonText="Add Contact"
              initialData={{
                is_primary: contacts && contacts.length > 0 ? 
                  !contacts.some(contact => contact.is_primary) : true
              }}
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
