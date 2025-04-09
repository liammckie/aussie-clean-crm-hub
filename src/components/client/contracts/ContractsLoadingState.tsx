
import React from 'react';
import { LogoLoadingSpinner } from '@/components/ui/LogoLoadingSpinner';

export function ContractsLoadingState() {
  return (
    <div className="flex justify-center py-8">
      <LogoLoadingSpinner size="sm" showText={true} />
    </div>
  );
}
