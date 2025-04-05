
import React from 'react';
import { Button } from '@/components/ui/button';

interface LoadSampleButtonProps {
  onLoadSample: () => void;
  isLoaded?: boolean;
  className?: string;
}

export function LoadSampleButton({ 
  onLoadSample, 
  isLoaded = false,
  className = '' 
}: LoadSampleButtonProps) {
  return (
    <Button 
      variant="outline"
      size="sm"
      onClick={onLoadSample}
      className={className}
      type="button"
    >
      {isLoaded ? 'Clear Sample Data' : 'Load Sample Data'}
    </Button>
  );
}
