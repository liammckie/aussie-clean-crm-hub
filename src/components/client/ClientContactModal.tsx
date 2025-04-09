
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UnifiedContactForm } from '@/components/client/UnifiedContactForm';
import { UnifiedContactFormData, ContactType as FormContactType } from '@/types/form-types';
import { ContactType as ServiceContactType } from '@/services/client/types';

// Create an adapter function to convert between contact type formats
function adaptContactTypes(contactTypes: ServiceContactType[]): FormContactType[] {
  // Map from service format to form format
  const mapping: Record<ServiceContactType, FormContactType> = {
    'primary': 'Primary',
    'billing': 'Billing',
    'operations': 'Operations',
    'technical': 'Technical',
    'emergency': 'Emergency'
  };
  
  return contactTypes.map(type => mapping[type] || 'Primary' as FormContactType);
}

interface ClientContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UnifiedContactFormData) => void;
  isLoading: boolean;
  contactTypes: ServiceContactType[];
}

export function ClientContactModal({ 
  isOpen, 
  onOpenChange, 
  onSubmit, 
  isLoading, 
  contactTypes 
}: ClientContactModalProps) {
  // Convert contact types to the format expected by UnifiedContactForm
  const adaptedContactTypes = adaptContactTypes(contactTypes);
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        <UnifiedContactForm 
          onSubmit={onSubmit}
          isLoading={isLoading}
          contactTypes={adaptedContactTypes}
          buttonText="Add Contact"
        />
      </DialogContent>
    </Dialog>
  );
}
