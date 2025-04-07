
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GenericErrorStateProps {
  error: Error | unknown;
  onRetry?: () => void;
  title?: string;
  message?: string;
  actionLabel?: string;
  entityName?: string;
}

export function GenericErrorState({ 
  error, 
  onRetry, 
  title, 
  message, 
  actionLabel = 'Retry',
  entityName = 'data'
}: GenericErrorStateProps) {
  // Extract error message or use fallback
  const errorMessage = message || (error instanceof Error ? error.message : `Failed to load ${entityName}`);
  // Use provided title or default title
  const errorTitle = title || `Error loading ${entityName}`;

  return (
    <div className="text-center py-8 border rounded-md">
      <div className="flex flex-col items-center gap-2">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <h3 className="text-lg font-medium">{errorTitle}</h3>
        <p className="text-muted-foreground mb-4">{errorMessage}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
