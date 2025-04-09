
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { OpportunityForm } from './OpportunityForm';
import { Opportunity } from '@/types/sales-types';

interface NewOpportunityDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onOpportunityCreated: () => void;
}

export function NewOpportunityDialog({ 
  isOpen, 
  onOpenChange, 
  onOpportunityCreated 
}: NewOpportunityDialogProps) {
  // Create an empty opportunity object for the new opportunity form
  const emptyOpportunity: Partial<Opportunity> = {
    title: '',
    client_name: '',
    value: 0,
    probability: 20,
    stage: 'LEAD',
    priority: 'MEDIUM',
    expected_close_date: new Date().toISOString(),
    description: '',
    assigned_to: '',
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Opportunity</DialogTitle>
        </DialogHeader>
        
        <OpportunityForm 
          opportunity={emptyOpportunity} 
          isNew={true}
          onSave={() => {
            onOpportunityCreated();
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
