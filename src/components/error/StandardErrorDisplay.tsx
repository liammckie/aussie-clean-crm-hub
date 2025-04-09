
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, InformationIcon } from "lucide-react";
import { AppLogger, LogCategory } from "@/utils/logging";
import { ErrorCategory } from "@/utils/logging/error-types";

interface StandardErrorDisplayProps {
  error: Error | unknown;
  title?: string;
  onRetry?: () => void;
  showDetails?: boolean;
  errorCategory?: ErrorCategory;
  errorId?: string;
  variant?: 'default' | 'destructive' | 'minimal' | 'card';
}

export const StandardErrorDisplay = ({
  error,
  title = "An error occurred",
  onRetry,
  showDetails = false,
  errorCategory,
  errorId,
  variant = 'default'
}: StandardErrorDisplayProps) => {
  // Extract error message
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Generate a unique error ID if one wasn't provided
  const displayErrorId = errorId || `err-${Math.random().toString(36).substring(2, 10)}`;
  
  // Log that this error is being displayed to the user
  React.useEffect(() => {
    AppLogger.info(LogCategory.UI, "Displaying error to user", {
      errorMessage,
      errorCategory,
      errorId: displayErrorId
    });
  }, [errorMessage, errorCategory, displayErrorId]);
  
  if (variant === 'minimal') {
    return (
      <div className="text-center py-4">
        <AlertCircle className="h-6 w-6 text-destructive mx-auto mb-2" />
        <p className="text-sm font-medium">{errorMessage}</p>
        {onRetry && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2"
            onClick={onRetry}
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Retry
          </Button>
        )}
      </div>
    );
  }
  
  if (variant === 'card') {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="ml-2">
            <h4 className="font-medium text-destructive">{title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{errorMessage}</p>
            {onRetry && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={onRetry}
              >
                <RefreshCw className="h-3 w-3 mr-1" /> Retry
              </Button>
            )}
            {showDetails && errorId && (
              <p className="text-xs text-muted-foreground mt-2">
                Error ID: {displayErrorId}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <Alert variant={variant === 'destructive' ? "destructive" : "default"}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-medium">
        {title}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p>{errorMessage}</p>
        
        {onRetry && (
          <Button 
            variant={variant === 'destructive' ? "outline" : "ghost"} 
            size="sm" 
            className="mt-3"
            onClick={onRetry}
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Retry
          </Button>
        )}
        
        {showDetails && (
          <div className="mt-3 text-xs flex items-center text-muted-foreground">
            <InformationIcon className="h-3 w-3 mr-1" />
            Error ID: {displayErrorId}
            {errorCategory && <span className="ml-2">Type: {errorCategory}</span>}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};
