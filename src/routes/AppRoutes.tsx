
import React from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { RouteErrorBoundary } from "@/components/error/RouteErrorBoundary";
import { ErrorFallback } from "@/components/error/SentryRouteError";
import { RouterErrorBoundary } from "@/components/error/GlobalErrorBoundary";

// Import lazy-loaded components
import { 
  LazyIndex,
  LazyDashboard,
  LazyClients,
  LazyClientDetail,
  LazyNewClient,
  LazyEditClient,
  LazyLogin,
  LazyNotFound,
  LazyContracts
} from "./lazyRoutes";

// ProtectedRoute component to protect routes that require authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Authentication is now fully handled by the AuthContext's isAuthenticated state
  if (!isAuthenticated) {
    // Save the current location they were trying to go to for later redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <MainLayout>{children}</MainLayout>;
};

// ErrorBoundaryWrapper that uses Sentry's error boundary but with our custom fallback
const ErrorBoundaryWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Sentry.ErrorBoundary fallback={({ error, resetError }) => 
      <ErrorFallback 
        error={error} 
        resetError={resetError} 
        componentStack={null} 
        eventId={null} 
      />
    }>
      {children}
    </Sentry.ErrorBoundary>
  );
};

// Route configuration
export const AppRoutes = () => {
  // Use Sentry Routes wrapper
  const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);
  
  return (
    <SentryRoutes>
      <Route 
        path="/login" 
        element={
          <RouterErrorBoundary>
            <LazyLogin />
          </RouterErrorBoundary>
        }
      />
      <Route 
        path="/" 
        element={
          <RouterErrorBoundary>
            <ProtectedRoute>
              <LazyIndex />
            </ProtectedRoute>
          </RouterErrorBoundary>
        }
      />
      <Route 
        path="/dashboard" 
        element={
          <RouterErrorBoundary>
            <ProtectedRoute>
              <LazyDashboard />
            </ProtectedRoute>
          </RouterErrorBoundary>
        }
      />
      {/* Client Routes */}
      <Route 
        path="/clients" 
        element={
          <RouterErrorBoundary>
            <ProtectedRoute>
              <LazyClients />
            </ProtectedRoute>
          </RouterErrorBoundary>
        }
      />
      <Route 
        path="/clients/new" 
        element={
          <RouterErrorBoundary>
            <ProtectedRoute>
              <LazyNewClient />
            </ProtectedRoute>
          </RouterErrorBoundary>
        }
      />
      <Route 
        path="/clients/:id" 
        element={
          <RouterErrorBoundary>
            <ProtectedRoute>
              <LazyClientDetail />
            </ProtectedRoute>
          </RouterErrorBoundary>
        }
      />
      <Route 
        path="/clients/:id/edit" 
        element={
          <RouterErrorBoundary>
            <ProtectedRoute>
              <LazyEditClient />
            </ProtectedRoute>
          </RouterErrorBoundary>
        }
      />
      {/* Contract Routes */}
      <Route 
        path="/contracts" 
        element={
          <RouterErrorBoundary>
            <ProtectedRoute>
              <LazyContracts />
            </ProtectedRoute>
          </RouterErrorBoundary>
        }
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route 
        path="*" 
        element={
          <RouterErrorBoundary>
            <LazyNotFound />
          </RouterErrorBoundary>
        }
      />
    </SentryRoutes>
  );
};
