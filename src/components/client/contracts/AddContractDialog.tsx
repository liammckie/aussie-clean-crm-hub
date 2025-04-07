
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface AddContractDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContract: () => void;
}

export function AddContractDialog({ 
  isOpen, 
  onClose, 
  onAddContract 
}: AddContractDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Contract</DialogTitle>
          <DialogDescription>
            Create a new contract for this client. You'll be redirected to the contract creation page.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onAddContract}>
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
