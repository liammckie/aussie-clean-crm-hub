
import React, { ReactNode } from 'react';
import * as Sentry from '@sentry/react';

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
}

export const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ children }) => {
  // Update the error handler to match Sentry's expected signature
  const handleError = (error: Error, componentStack: string, eventId: string) => {
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component Stack:', componentStack);
    console.error('Event ID:', eventId);
    
    // The error is already captured by Sentry internally when using ErrorBoundary
  };

  return (
    <Sentry.ErrorBoundary fallback={<div>Something went wrong</div>} onError={handleError}>
      {children}
    </Sentry.ErrorBoundary>
  );
};
