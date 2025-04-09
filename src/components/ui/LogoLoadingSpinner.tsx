
import React from 'react';

interface LogoLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  text?: string;
}

export function LogoLoadingSpinner({ 
  size = 'md', 
  showText = false,
  text = 'Loading...'
}: LogoLoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-indigo-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-purple-500 animate-spin animate-reverse"></div>
        <div className="absolute inset-4 rounded-full bg-slate-900 flex items-center justify-center">
          <span className="text-purple-500 font-bold text-xs">AC</span>
        </div>
      </div>
      
      {showText && (
        <div className="mt-4 text-indigo-500 font-medium">
          {text}
        </div>
      )}
    </div>
  );
}
