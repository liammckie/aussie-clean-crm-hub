
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { UnifiedContactForm } from '@/components/client/UnifiedContactForm';
import { UnifiedContactFormData } from '@/types/form-types';

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UnifiedContactFormData) => void;
  isSubmitting?: boolean;
  initialData?: Partial<UnifiedContactFormData>;
  contactTypes?: string[];
  title?: string;
}

export function ContactDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  initialData = {},
  contactTypes = ['Primary', 'Billing', 'Operations', 'Emergency', 'Technical', 'Support', 'Sales'],
  title = "Add New Contact"
}: ContactDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="flex justify-between items-center">
          <DialogTitle>{title}</DialogTitle>
          <DialogClose asChild>
            <button className="rounded-full h-6 w-6 flex items-center justify-center border border-input">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </DialogClose>
        </DialogHeader>
        <UnifiedContactForm 
          onSubmit={onSubmit}
          isLoading={isSubmitting}
          contactTypes={contactTypes}
          buttonText="Add Contact"
          initialData={initialData}
        />
      </DialogContent>
    </Dialog>
  );
}
