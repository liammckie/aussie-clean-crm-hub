
import React from 'react';
import { LoadingSpinner } from '@/components/ui/spinner';

export function SchemaLoadingState() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-muted-foreground">Loading schema data...</p>
      </div>
    </div>
  );
}
