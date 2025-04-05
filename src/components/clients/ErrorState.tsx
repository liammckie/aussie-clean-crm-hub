
import React from "react";
import { Button } from "@/components/ui/button";
import { ErrorResponse } from "@/utils/supabaseErrors";
import { AlertCircle, RefreshCw, Lock, Wifi, Database, FileWarning, AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  error: ErrorResponse | Error | unknown;
  refetch: () => void;
}

const ErrorState = ({ error, refetch }: ErrorStateProps) => {
  // Extract error message regardless of error type
  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    if (error && typeof error === 'object') {
      if ('message' in error) return error.message as string;
      if ('error' in error) return getErrorMessage(error.error);
      return JSON.stringify(error);
    }
    return "An unknown error occurred";
  };

  // Check if it's a network error
  const isNetworkError = (error: any): boolean => {
    const message = getErrorMessage(error).toLowerCase();
    return message.includes('network') || 
           message.includes('failed to fetch') || 
           message.includes('connection') ||
           message.includes('offline');
  };

  // Check if it's an authentication/permission error
  const isAuthError = (error: any): boolean => {
    if (!error || typeof error !== 'object') return false;
    
    // Check for category property if it's our ErrorResponse type
    if ('category' in error) {
      return error.category === 'authentication' || 
             error.category === 'permission';
    }
    
    const message = getErrorMessage(error).toLowerCase();
    return message.includes('permission') || 
           message.includes('unauthorized') || 
           message.includes('unauthenticated') ||
           message.includes('jwt') ||
           message.includes('auth') ||
           message.includes('access denied') ||
           message.includes('row-level security');
  };
  
  // Check if it's a database error
  const isDatabaseError = (error: any): boolean => {
    if (!error || typeof error !== 'object') return false;
    
    // Check for category property if it's our ErrorResponse type
    if ('category' in error) {
      return error.category === 'database';
    }
    
    const message = getErrorMessage(error).toLowerCase();
    return message.includes('database') || 
           message.includes('unique') ||
           message.includes('constraint') ||
           message.includes('violation') ||
           message.includes('duplicate');
  };
  
  // Get appropriate error title
  const getErrorTitle = (): string => {
    if (isNetworkError(error)) return "Connection Error";
    if (isAuthError(error)) return "Access Error";
    if (isDatabaseError(error)) return "Database Error";
    return "Error loading clients";
  };

  // Get appropriate error description
  const getErrorDescription = (): string => {
    if (isNetworkError(error)) {
      return "Unable to connect to the server. Please check your internet connection and try again.";
    }
    if (isAuthError(error)) {
      return "You don't have permission to perform this action. Please contact an administrator.";
    }
    if (isDatabaseError(error)) {
      return "There was an error with the database operation. Please try again or contact support.";
    }
    return getErrorMessage(error) || "There was an error fetching client data";
  };

  // Get appropriate icon based on error type
  const getErrorIcon = () => {
    if (isNetworkError(error)) return <Wifi size={24} />;
    if (isAuthError(error)) return <Lock size={24} />;
    if (isDatabaseError(error)) return <Database size={24} />;
    return <AlertCircle size={24} />;
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4">
        {getErrorIcon()}
      </div>
      <h3 className="text-lg font-semibold mb-2">{getErrorTitle()}</h3>
      <p className="text-muted-foreground mb-4 max-w-md">
        {getErrorDescription()}
      </p>
      <Button 
        variant="outline" 
        onClick={refetch} 
        className="flex items-center gap-2"
      >
        <RefreshCw size={16} />
        Try Again
      </Button>
    </div>
  );
};

export default ErrorState;
