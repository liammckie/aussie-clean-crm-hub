
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface SchemaErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function SchemaErrorState({ error, onRetry }: SchemaErrorStateProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="max-w-lg p-6">
        <div className="flex items-center gap-2 text-red-500 mb-4">
          <AlertTriangle />
          <h2 className="text-xl font-semibold">Error Loading Schema</h2>
        </div>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={onRetry}>Retry</Button>
      </Card>
    </div>
  );
}
