
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ErrorReporting } from "@/utils/errorReporting";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component to catch errors in the component tree
 */
class ErrorBoundaryBase extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Report to error monitoring
    ErrorReporting.captureException(error, {
      errorInfo: errorInfo.componentStack,
      boundary: 'ErrorBoundary'
    });

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <ErrorFallback 
          error={this.state.error} 
          resetError={() => this.setState({ hasError: false, error: null })} 
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default fallback component for error display
 */
export const ErrorFallback = ({ 
  error, 
  resetError 
}: { 
  error: Error | null; 
  resetError: () => void;
}) => {
  const navigate = useNavigate();
  const [errorId, setErrorId] = useState<string | null>(null);
  
  useEffect(() => {
    if (error) {
      // Generate a unique ID for this error instance
      const id = Math.random().toString(36).substring(2, 10);
      setErrorId(id);
      
      // Report to error monitoring if not already reported by boundary
      ErrorReporting.captureException(error, {
        errorId: id,
        location: 'ErrorFallback',
        message: error.message
      });
    }
  }, [error]);
  
  const goHome = () => {
    resetError();
    navigate("/");
  };
  
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Alert variant="destructive" className="border-red-500/50 bg-red-950/30">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold mb-2">
            Something went wrong
          </AlertTitle>
          <AlertDescription className="space-y-4">
            <p className="text-sm text-slate-300">{error?.message || "An unexpected error occurred"}</p>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="outline"
                className="border-red-500/30 hover:bg-red-950/50 gap-2"
                onClick={resetError}
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
              
              <Button
                variant="outline"
                className="border-slate-700 hover:bg-slate-800/50 gap-2"
                onClick={goHome}
              >
                <Home className="h-4 w-4" />
                Go back home
              </Button>
            </div>
            
            {errorId && (
              <p className="text-xs text-slate-500 mt-2">Error ID: {errorId}</p>
            )}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

/**
 * ErrorBoundary component with React Router integration
 */
export const ErrorBoundary = (props: ErrorBoundaryProps) => {
  return <ErrorBoundaryBase {...props} />;
};

/**
 * HOC to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.ComponentType<P> {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WrappedComponent = (props: P) => {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
  
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
  return WrappedComponent;
}

export default ErrorBoundary;
