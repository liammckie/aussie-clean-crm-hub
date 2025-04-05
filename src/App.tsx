
import React, { useState } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { LoadingScreen } from "./components/LoadingScreen";
import { SentryErrorBoundary } from "@/utils/sentry";
import { ErrorReporting } from "@/utils/errorReporting";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppRoutes } from "@/routes/AppRoutes";
import * as Sentry from "@sentry/react";
import { SidebarProvider } from "@/components/ui/sidebar";

// Create query client with error reporting
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      meta: {
        onError: (error: Error) => {
          ErrorReporting.captureException(error, { 
            source: 'react-query',
          });
        },
      },
    },
    mutations: {
      meta: {
        onError: (error: Error) => {
          ErrorReporting.captureException(error, { 
            source: 'react-query-mutation',
          });
        },
      },
    }
  }
});

const App = () => {
  const [showLoading, setShowLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <SidebarProvider>
            {/* Only use Sonner toast provider, removing the shadcn/ui one */}
            <Sonner />
            <BrowserRouter>
              {showLoading ? (
                <LoadingScreen 
                  onLoadingComplete={() => setShowLoading(false)} 
                />
              ) : (
                <SentryErrorBoundary>
                  <AppRoutes />
                </SentryErrorBoundary>
              )}
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default Sentry.withProfiler(App);
