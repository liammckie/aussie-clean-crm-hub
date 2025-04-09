import React, { useEffect, useState, ReactNode } from "react";
import * as Sentry from "@sentry/react";

interface RouteErrorBoundaryProps {
  children?: ReactNode;
}

export const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("An unexpected error occurred");
  
  useEffect(() => {
    // If an error is detected, report it to Sentry
    if (error) {
      Sentry.captureException(error);
      setErrorMessage(error.message || "An unexpected error occurred");
    }
  }, [error]);
  
  // If there's no error, render children
  if (!error) {
    return <>{children}</>;
  }
  
  // Otherwise show error UI
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 bg-slate-900 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-red-500 mb-4">Something went wrong</h1>
        <p className="text-slate-300 mb-4">
          {errorMessage}
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

// Use React's error boundary pattern to catch errors
export class RouteErrorBoundaryClass extends React.Component<RouteErrorBoundaryProps, { hasError: boolean, error: Error | null }> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Report the error to Sentry
    Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 bg-slate-900 rounded-lg shadow-lg">
            <h1 className="text-xl font-bold text-red-500 mb-4">Something went wrong</h1>
            <p className="text-slate-300 mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
