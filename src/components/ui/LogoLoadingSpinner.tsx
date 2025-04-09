
import React from 'react';

interface LogoLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export function LogoLoadingSpinner({ 
  size = 'md', 
  showText = false,
  className = '' 
}: LogoLoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-12 w-auto',
    md: 'h-16 w-auto',
    lg: 'h-20 w-auto',
    xl: 'h-28 w-auto'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <img 
          src="/lovable-uploads/Logo.png" 
          alt="Aussie Clean ERP Logo" 
          className={`${sizeClasses[size]} object-contain animate-pulse`}
        />
        <div className="absolute inset-0 rounded-full border-t-2 border-purple-500/30 animate-spin"></div>
      </div>
      
      {showText && (
        <p className="mt-4 text-muted-foreground text-sm animate-pulse">Loading...</p>
      )}
    </div>
  );
}
