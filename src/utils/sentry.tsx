
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/react";
import { Replay } from "@sentry/react";
import React from "react";

import {
  Route,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
  useRouteError,
} from "react-router-dom";

// Initialize Sentry
function initSentry() {
  // Define environment variable fallbacks
  const dsn = typeof import.meta !== 'undefined' && import.meta.env 
    ? import.meta.env.VITE_SENTRY_DSN 
    : process.env.VITE_SENTRY_DSN;
  const env = typeof import.meta !== 'undefined' && import.meta.env 
    ? import.meta.env.VITE_ENVIRONMENT 
    : process.env.VITE_ENVIRONMENT;

  // Only initialize if DSN is provided
  if (!dsn) {
    console.warn("Sentry DSN not provided. Error reporting disabled.");
    return;
  }

  Sentry.init({
    dsn,
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.createElement,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes,
          {}
        ),
      }),
      new Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    environment: env || "development",
    
    // Capture 100% of transactions for performance monitoring
    tracesSampleRate: 1.0, 

    // Session replay for errors only
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 1.0,
    
    // Set to true in development to see verbose logs
    debug: typeof import.meta !== 'undefined' && import.meta.env && !import.meta.env.PROD,
  });
}

// Call initialization
initSentry();

// Error boundary component wrapper
export const SentryErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      {children}
    </Sentry.ErrorBoundary>
  );
};

// Generic error fallback UI
function ErrorFallback() {
  const error = useRouteError();
  
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
      <div className="p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Something went wrong</h1>
        <p className="mb-6 text-gray-300">
          We're sorry, but an unexpected error has occurred. Our team has been notified.
        </p>
        <button
          className="rounded bg-blue-600 px-4 py-2 hover:bg-blue-700"
          onClick={() => window.location.href = '/'}
        >
          Return to home page
        </button>
      </div>
    </div>
  );
}

// Custom hook to report route errors to Sentry
export function useSentryRouteError() {
  const error = useRouteError();
  
  React.useEffect(() => {
    if (error) {
      Sentry.captureException(error, {
        tags: {
          mechanism: "route-error",
        },
      });
    }
  }, [error]);
  
  return error;
}

// Create a Sentry wrapper for all API calls
export const withSentryAPI = async <T,>(
  apiCall: () => Promise<T>,
  options: {
    name: string;
    data?: Record<string, any>;
  }
): Promise<T> => {
  const transaction = Sentry.startTransaction({
    name: `API: ${options.name}`,
    data: options.data,
  });
  
  try {
    const result = await apiCall();
    transaction.setStatus("ok");
    return result;
  } catch (error) {
    transaction.setStatus("internal_error");
    Sentry.captureException(error, {
      tags: { api: options.name },
      extra: options.data, // Changed from extras to extra - the correct property name
    });
    throw error;
  } finally {
    transaction.finish();
  }
};
