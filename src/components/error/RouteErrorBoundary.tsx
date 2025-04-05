
import React, { useEffect } from "react";
import { useRouteError } from "react-router-dom";
import * as Sentry from "@sentry/react";

export const RouteErrorBoundary = () => {
  const error = useRouteError() as Error;
  
  useEffect(() => {
    // Report error to Sentry
    Sentry.captureException(error);
  }, [error]);
  
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 bg-slate-900 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-red-500 mb-4">Something went wrong</h1>
        <p className="text-slate-300 mb-4">
          {error?.message || "An unexpected error occurred"}
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
