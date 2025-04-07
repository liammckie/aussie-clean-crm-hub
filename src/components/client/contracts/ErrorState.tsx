
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContractsErrorStateProps {
  error: Error | unknown;
  onRetry: () => void;
}

export function ContractsErrorState({ error, onRetry }: ContractsErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : 'Failed to load contracts';

  return (
    <div className="text-center py-8 border rounded-md">
      <div className="flex flex-col items-center gap-2">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <h3 className="text-lg font-medium">Error loading contracts</h3>
        <p className="text-muted-foreground mb-4">{errorMessage}</p>
        <Button onClick={onRetry} variant="outline">
          Retry
        </Button>
      </div>
    </div>
  );
}
