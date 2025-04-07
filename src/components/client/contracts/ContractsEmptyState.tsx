
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ContractsEmptyStateProps {
  onAddContract: () => void;
}

export function ContractsEmptyState({ onAddContract }: ContractsEmptyStateProps) {
  return (
    <div className="text-center py-8 border rounded-md">
      <p className="text-muted-foreground mb-4">No contracts found for this client</p>
      <Button onClick={onAddContract} variant="outline">
        <Plus className="mr-2 h-4 w-4" />
        Create First Contract
      </Button>
    </div>
  );
}
