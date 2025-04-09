
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div 
      className={`${sizeClasses[size]} animate-spin rounded-full border-b-2 border-primary ${className}`}
    />
  );
}

// Export as Spinner for backward compatibility
export const Spinner = LoadingSpinner;
