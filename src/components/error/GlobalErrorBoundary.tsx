
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Home, RotateCw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ErrorReporting } from "@/utils/errorReporting";
import { AppLogger, LogCategory, LogLevel } from "@/utils/logging";

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnRouteChange?: boolean;
  maxRetries?: number;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

/**
 * Enhanced error boundary component with retry mechanism and detailed error reporting
 */
class GlobalErrorBoundaryBase extends React.Component<GlobalErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error details
    AppLogger.error(
      LogCategory.UI, 
      `Error caught by GlobalErrorBoundary: ${error.message}`,
      { 
        error,
        componentStack: errorInfo.componentStack,
        stackTrace: error.stack,
        retryCount: this.state.retryCount
      }
    );
    
    // Report to error monitoring
    ErrorReporting.captureException(error, {
      errorInfo: errorInfo.componentStack,
      boundary: 'GlobalErrorBoundary',
      retryCount: this.state.retryCount
    });

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  
  resetError = () => {
    const { maxRetries = 3 } = this.props;
    const newRetryCount = this.state.retryCount + 1;
    
    // Track retry attempt
    AppLogger.info(
      LogCategory.UI,
      `Attempting to recover from error (Attempt ${newRetryCount}/${maxRetries})`,
      { previousError: this.state.error?.message }
    );
    
    if (newRetryCount <= maxRetries) {
      this.setState({ 
        hasError: false, 
        error: null, 
        retryCount: newRetryCount 
      });
    } else {
      AppLogger.warn(
        LogCategory.UI,
        `Maximum retry attempts reached (${maxRetries}), suggesting page refresh`,
        { error: this.state.error?.message }
      );
      // Keep error state but update retry count
      this.setState({ retryCount: newRetryCount });
    }
  };

  render() {
    const { children, fallback, maxRetries = 3 } = this.props;
    
    if (this.state.hasError) {
      if (fallback) {
        return fallback;
      }
      
      return (
        <GlobalErrorFallback 
          error={this.state.error} 
          resetError={this.resetError}
          retryCount={this.state.retryCount}
          maxRetries={maxRetries}
        />
      );
    }

    return children;
  }
}

/**
 * Enhanced fallback component for error display with retry counter
 */
export const GlobalErrorFallback = ({ 
  error, 
  resetError,
  retryCount = 0,
  maxRetries = 3
}: { 
  error: Error | null; 
  resetError: () => void;
  retryCount?: number;
  maxRetries?: number;
}) => {
  const navigate = useNavigate();
  const [errorId, setErrorId] = useState<string | null>(null);
  const exceededRetries = retryCount >= maxRetries;
  
  useEffect(() => {
    if (error) {
      // Generate a unique ID for this error instance
      const id = Math.random().toString(36).substring(2, 10);
      setErrorId(id);
      
      // Report to error monitoring
      ErrorReporting.captureException(error, {
        errorId: id,
        location: 'GlobalErrorFallback',
        message: error.message,
        retryCount
      });
    }
  }, [error, retryCount]);
  
  const goHome = () => {
    navigate("/");
  };
  
  const refreshPage = () => {
    window.location.reload();
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
            
            {exceededRetries ? (
              <div className="bg-red-900/20 border border-red-500/30 rounded p-2 mt-2">
                <p className="text-xs text-red-300">
                  Maximum retry attempts reached. You may need to refresh the page.
                </p>
              </div>
            ) : null}
            
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="outline"
                className="border-red-500/30 hover:bg-red-950/50 gap-2"
                onClick={resetError}
                disabled={exceededRetries}
              >
                <RefreshCw className="h-4 w-4" />
                Try again {retryCount > 0 ? `(${retryCount}/${maxRetries})` : ''}
              </Button>
              
              {exceededRetries && (
                <Button
                  variant="outline"
                  className="border-amber-500/30 hover:bg-amber-950/50 gap-2"
                  onClick={refreshPage}
                >
                  <RotateCw className="h-4 w-4" />
                  Refresh page
                </Button>
              )}
              
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
 * GlobalErrorBoundary wrapper component that accepts location from context
 * This fixes the issue with useLocation not being available in class components
 */
const LocationAwareErrorBoundary: React.FC<GlobalErrorBoundaryProps> = (props) => {
  const location = useLocation();
  const [key, setKey] = useState(location.pathname);
  const { resetOnRouteChange = true, ...restProps } = props;
  
  // Reset error boundary when route changes if enabled
  useEffect(() => {
    if (resetOnRouteChange) {
      setKey(location.pathname);
    }
  }, [location.pathname, resetOnRouteChange]);
  
  return <GlobalErrorBoundaryBase key={key} {...restProps} />;
};

/**
 * GlobalErrorBoundary component - the main export
 */
export const GlobalErrorBoundary: React.FC<GlobalErrorBoundaryProps> = (props) => {
  return <LocationAwareErrorBoundary {...props} />;
};

/**
 * HOC to wrap components with global error boundary
 */
export function withGlobalErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<GlobalErrorBoundaryProps, 'children'>
): React.ComponentType<P> {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WrappedComponent = (props: P) => {
    return (
      <GlobalErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </GlobalErrorBoundary>
    );
  };
  
  WrappedComponent.displayName = `withGlobalErrorBoundary(${displayName})`;
  return WrappedComponent;
}

export default GlobalErrorBoundary;
