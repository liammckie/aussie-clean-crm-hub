
import React, { useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import { useRouteError } from "react-router-dom";

export const RouteErrorBoundary = () => {
  const [errorMessage, setErrorMessage] = useState<string>("An unexpected error occurred");
  
  // Get the error from React Router directly
  const routeError = useRouteError();
  
  useEffect(() => {
    // Capture the error if it exists
    if (routeError) {
      Sentry.captureException(routeError);
      setErrorMessage(routeError instanceof Error ? routeError.message : String(routeError));
    }
  }, [routeError]);
  
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
