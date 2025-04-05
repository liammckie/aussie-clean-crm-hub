
import React from 'react';
import ErrorBoundary from '@/components/error/ErrorBoundary';

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
}

export const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ children }) => {
  return <ErrorBoundary>{children}</ErrorBoundary>;
};
