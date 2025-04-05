
import React from "react";
import { Button } from "@/components/ui/button";
import { ErrorResponse } from "@/utils/supabaseErrors";
import { AlertCircle, RefreshCw } from "lucide-react";

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
  
  // Get appropriate error title
  const getErrorTitle = (): string => {
    if (isNetworkError(error)) return "Connection Error";
    return "Error loading clients";
  };

  // Get appropriate error description
  const getErrorDescription = (): string => {
    if (isNetworkError(error)) {
      return "Unable to connect to the server. Please check your internet connection and try again.";
    }
    return getErrorMessage(error) || "There was an error fetching client data";
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4">
        <AlertCircle size={24} />
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
