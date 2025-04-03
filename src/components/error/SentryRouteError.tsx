
import React from "react";
import * as Sentry from "@sentry/react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

interface FallbackProps {
  error: Error;
  componentStack: string | null;
  eventId: string | null;
  resetError(): void;
}

export const ErrorFallback = ({ error, resetError }: FallbackProps) => {
  const navigate = useNavigate();
  
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
            <p className="text-sm text-slate-300">{error.message || "An unexpected error occurred"}</p>
            
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
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

/**
 * Higher-order component that wraps a component with Sentry's error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: Sentry.ErrorBoundaryProps = {}
): React.ComponentType<P> {
  return Sentry.withErrorBoundary(Component, {
    fallback: ErrorFallback,
    ...options,
  });
}

/**
 * HOC to wrap a Route component with Sentry transaction monitoring
 */
export function withSentryRouting<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return Sentry.withProfiler(
    withErrorBoundary(Component),
    { name: Component.displayName || Component.name }
  );
}
