
import React from 'react';
import { GenericErrorState } from './GenericErrorState';

interface ContractsErrorStateProps {
  error: Error | unknown;
  onRetry: () => void;
}

export function ContractsErrorState({ error, onRetry }: ContractsErrorStateProps) {
  return (
    <GenericErrorState 
      error={error} 
      onRetry={onRetry} 
      entityName="contracts"
    />
  );
}
