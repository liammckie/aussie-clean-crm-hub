
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/react";
import { Replay } from "@sentry/react";
import React from "react";
import { useRouteError } from "react-router-dom";

import {
  Route,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from "react-router-dom";

// Default Sentry DSN for development (this is a placeholder and should be replaced with a real development DSN)
const DEFAULT_DEV_DSN = "https://9e9a7a40cb214a50a688f4cab47246ad@o4509086518411264.ingest.us.sentry.io/4509086689394688";

// Initialize Sentry
function initSentry() {
  // Define environment variable fallbacks
  const dsn = typeof import.meta !== 'undefined' && import.meta.env 
    ? import.meta.env.VITE_SENTRY_DSN || (import.meta.env.DEV ? DEFAULT_DEV_DSN : '')
    : process.env.VITE_SENTRY_DSN;
  
  const env = typeof import.meta !== 'undefined' && import.meta.env 
    ? import.meta.env.VITE_ENVIRONMENT 
    : process.env.VITE_ENVIRONMENT || 'development';
  
  const isProd = typeof import.meta !== 'undefined' && import.meta.env 
    ? import.meta.env.PROD 
    : process.env.NODE_ENV === 'production';

  // Only initialize if DSN is provided or we're in production
  if (!dsn) {
    console.info("Sentry DSN not provided. Error reporting is disabled. This is normal in development.");
    return;
  }

  try {
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
            // Fix: Replace empty object with required boolean parameter
            true
          ),
        }),
        new Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      environment: env,
      
      // Adjust sampling rates based on environment
      tracesSampleRate: isProd ? 1.0 : 0.5,
      
      // Session replay settings
      replaysSessionSampleRate: isProd ? 0.1 : 0.0,  // Sample 10% of sessions in production
      replaysOnErrorSampleRate: 1.0,                 // Always record sessions with errors
      
      // Set to true in development to see verbose logs
      debug: typeof import.meta !== 'undefined' && import.meta.env && !import.meta.env.PROD,
      
      // Only send errors in production or if explicitly enabled
      enabled: isProd || (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ENABLE_SENTRY === 'true'),
    });
    
    console.info(`Sentry initialized in ${env} mode`);
  } catch (error) {
    console.error("Failed to initialize Sentry:", error);
  }
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

// Generic error fallback UI - Modified to NOT use useRouteError
function ErrorFallback() {
  // Remove useRouteError as it requires a data router
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

// Custom hook to report route errors to Sentry - this needs to be used only within error elements
export function useSentryRouteError() {
  try {
    // This hook should only be used within components rendered as errorElement
    // in a createBrowserRouter configuration
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
  } catch (e) {
    console.warn("useSentryRouteError must be used within a data router error element");
    return null;
  }
}

// Create a Sentry wrapper for all API calls
export function withSentryAPI<T>(
  apiCall: () => Promise<T>,
  options: {
    name: string;
    data?: Record<string, any>;
  }
): Promise<T> {
  // Only create transaction if Sentry is initialized
  if (!Sentry.getCurrentHub().getClient()) {
    return apiCall();
  }

  const transaction = Sentry.startTransaction({
    name: `API: ${options.name}`,
    data: options.data,
  });
  
  try {
    return apiCall().then(result => {
      transaction.setStatus("ok");
      return result;
    }).catch(error => {
      transaction.setStatus("internal_error");
      Sentry.captureException(error, {
        tags: { api: options.name },
        extra: options.data,
      });
      throw error;
    }).finally(() => {
      transaction.finish();
    });
  } catch (error) {
    transaction.setStatus("internal_error");
    Sentry.captureException(error, {
      tags: { api: options.name },
      extra: options.data,
    });
    transaction.finish();
    throw error;
  }
}
