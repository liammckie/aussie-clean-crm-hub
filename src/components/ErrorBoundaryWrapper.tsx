
import React, { ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
}

export const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ children }) => {
  const handleError = (error: Error, info: ErrorInfo) => {
    console.error('Error caught by ErrorBoundary:', error, info);
    Sentry.captureException(error);
  };

  return (
    <Sentry.ErrorBoundary fallback={<div>Something went wrong</div>} onError={handleError}>
      {children}
    </Sentry.ErrorBoundary>
  );
};
