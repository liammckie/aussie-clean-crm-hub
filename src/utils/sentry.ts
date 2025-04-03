
import * as Sentry from "@sentry/react";
import { BrowserTracing, Replay } from "@sentry/react";
import React from 'react';
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes
} from "react-router-dom";

/**
 * Environment-specific Sentry configuration
 */
export const SENTRY_CONFIG = {
  dsn: "https://be220d948a04a4afeeb7911a4638165d@o4509086518411264.ingest.us.sentry.io/4509086689394688",
  environment: import.meta.env.MODE,
  enabled: import.meta.env.PROD, // Only enable in production by default
  tracePropagationTargets: ["localhost", /^https:\/\/aussie-clean\.com/],
  tracesSampleRate: 1.0, // Capture 100% of the transactions in development, adjust for production
  replaysSessionSampleRate: 0.1, // Sample rate for all sessions (10%)
  replaysOnErrorSampleRate: 1.0, // Sample rate for sessions with errors (100%)
  release: import.meta.env.VITE_APP_VERSION || "development", // Should be populated in production builds
};

/**
 * Initialize Sentry with all required integrations
 */
export function initializeSentry(): void {
  Sentry.init({
    dsn: SENTRY_CONFIG.dsn,
    integrations: [
      new BrowserTracing({
        tracePropagationTargets: SENTRY_CONFIG.tracePropagationTargets,
      }),
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect: React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      new Replay({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: SENTRY_CONFIG.tracesSampleRate,
    // Session Replay
    replaysSessionSampleRate: SENTRY_CONFIG.replaysSessionSampleRate,
    replaysOnErrorSampleRate: SENTRY_CONFIG.replaysOnErrorSampleRate,
    enabled: SENTRY_CONFIG.enabled,
    environment: SENTRY_CONFIG.environment,
    release: SENTRY_CONFIG.release,
    beforeSend(event) {
      // Add additional context to all events
      if (!event.tags) {
        event.tags = {};
      }
      event.tags['app_version'] = import.meta.env.VITE_APP_VERSION || "development";
      return event;
    },
  });
}

/**
 * SentryErrorBoundary component with standardized fallback UI
 */
export const SentryErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <Sentry.ErrorBoundary 
      fallback={({ error, componentStack, eventId, resetError }) => (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-4 bg-slate-900 p-6 rounded-lg border border-red-500/20">
            <h2 className="text-xl font-semibold text-red-500">Something went wrong</h2>
            <p className="text-slate-300 text-sm">{error.message || "An unexpected error occurred"}</p>
            <div className="pt-2 flex gap-2">
              <button
                onClick={resetError}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-sm"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-sm"
              >
                Go Home
              </button>
            </div>
            <p className="text-slate-500 text-xs">
              Error ID: {eventId}
            </p>
          </div>
        </div>
      )}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

/**
 * Higher-order component to enhance a route component with Sentry profiling and error boundaries
 */
export function withSentryMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  options: { name?: string } = {}
): React.ComponentType<P> {
  const componentName = options.name || Component.displayName || Component.name || "UnnamedComponent";
  
  return Sentry.withProfiler(
    Sentry.withErrorBoundary(Component, {
      fallback: ({ error, componentStack, eventId, resetError }) => (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-4 bg-slate-900 p-6 rounded-lg border border-red-500/20">
            <h2 className="text-xl font-semibold text-red-500">Component Error</h2>
            <p className="text-slate-300 text-sm">{error.message || "An unexpected error occurred"}</p>
            <div className="pt-2 flex gap-2">
              <button
                onClick={resetError}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-sm"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-sm"
              >
                Go Home
              </button>
            </div>
            <p className="text-slate-500 text-xs">
              Error ID: {eventId}
            </p>
          </div>
        </div>
      ),
    }),
    { name: componentName }
  );
}
