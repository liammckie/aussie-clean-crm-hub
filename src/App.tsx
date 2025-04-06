
import React, { Suspense, useEffect, useState } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { LoadingScreen } from "./components/LoadingScreen";
import { SentryErrorBoundary } from "@/utils/sentry";
import { ErrorReporting } from "@/utils/errorReporting";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppRoutes } from "@/routes/AppRoutes";
import * as Sentry from "@sentry/react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GlobalErrorBoundary } from "@/components/error/GlobalErrorBoundary";
import { createQueryClient } from "@/utils/query/queryConfig";
import { AppLogger, LogCategory } from "@/utils/logging";

// Create query client with optimized configuration
const queryClient = createQueryClient();

// Fallback for suspended components
const SuspenseFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]" aria-busy="true" aria-live="polite">
    <div className="animate-pulse flex flex-col items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-slate-700"></div>
      <div className="h-4 w-32 rounded bg-slate-700"></div>
    </div>
  </div>
);

const App = () => {
  // State for loading screen
  const [showLoading, setShowLoading] = useState(true);

  // Log app initialization
  useEffect(() => {
    AppLogger.info(LogCategory.APPLICATION, "Application initialized", {
      environment: import.meta.env.MODE,
      version: import.meta.env.VITE_APP_VERSION || 'development'
    });
    
    // Setup global error handler
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      AppLogger.error(
        LogCategory.APPLICATION,
        `Global error: ${String(message)}`,
        { source, lineno, colno, error }
      );
      
      ErrorReporting.captureException(error || String(message), {
        source: 'window.onerror',
        location: source,
        lineNumber: lineno,
        columnNumber: colno
      });
      
      // Call original handler if exists
      if (originalOnError) {
        return originalOnError.call(this, message, source, lineno, colno, error);
      }
      
      return false;
    };
    
    // Setup unhandled promise rejection handler
    const originalOnUnhandledRejection = window.onunhandledrejection;
    window.onunhandledrejection = function(event) {
      AppLogger.error(
        LogCategory.APPLICATION,
        `Unhandled promise rejection: ${String(event.reason)}`,
        { reason: event.reason }
      );
      
      ErrorReporting.captureException(event.reason, {
        source: 'unhandledrejection'
      });
      
      // Call original handler if exists
      if (originalOnUnhandledRejection) {
        originalOnUnhandledRejection.call(this, event);
      }
    };
    
    return () => {
      // Restore original handlers
      window.onerror = originalOnError;
      window.onunhandledrejection = originalOnUnhandledRejection;
    };
  }, []);

  return (
    <GlobalErrorBoundary maxRetries={3}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <SidebarProvider>
              <Sonner />
              <BrowserRouter>
                {showLoading ? (
                  <LoadingScreen 
                    onLoadingComplete={() => setShowLoading(false)} 
                  />
                ) : (
                  <Suspense fallback={<SuspenseFallback />}>
                    <AppRoutes />
                  </Suspense>
                )}
              </BrowserRouter>
            </SidebarProvider>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
};

export default Sentry.withProfiler(App);
