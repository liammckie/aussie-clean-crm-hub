
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UnifiedContactForm } from '@/components/client/UnifiedContactForm';
import { UnifiedContactFormData } from '@/types/form-types';
import { ContactType } from '@/services/client/types';

interface ClientContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UnifiedContactFormData) => void;
  isLoading: boolean;
  contactTypes: ContactType[];
}

export function ClientContactModal({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  isLoading, 
  contactTypes 
}: ClientContactModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        <UnifiedContactForm 
          onSubmit={onSubmit}
          isLoading={isLoading}
          contactTypes={contactTypes}
          buttonText="Add Contact"
        />
      </DialogContent>
    </Dialog>
  );
}
