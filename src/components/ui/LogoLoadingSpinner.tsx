
import React from 'react';
import { LoadingSpinner } from './spinner';

interface LogoLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function LogoLoadingSpinner({ size = 'md', showText = true, className = '' }: LogoLoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <LoadingSpinner size={size} className={className} />
        <span className="sr-only">Loading application</span>
      </div>
      {showText && (
        <p className="mt-4 text-muted-foreground text-sm">
          Loading application...
        </p>
      )}
    </div>
  );
}
