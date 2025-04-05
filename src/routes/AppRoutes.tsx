
import React from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { RouteErrorBoundary } from "@/components/error/RouteErrorBoundary";
import { ErrorFallback } from "@/components/error/SentryRouteError";

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

// Check for admin session
const isAdminSession = () => {
  const adminSession = localStorage.getItem("admin_session");
  if (!adminSession) return false;
  
  try {
    const session = JSON.parse(adminSession);
    // Add simple expiration check (24 hours)
    const sessionTime = new Date(session.timestamp).getTime();
    const now = new Date().getTime();
    const hoursPassed = (now - sessionTime) / (1000 * 60 * 60);
    
    return hoursPassed < 24;
  } catch (e) {
    return false;
  }
};

// ProtectedRoute component to protect routes that require authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Check for admin session as well
  if (!isAuthenticated && !isAdminSession()) {
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
          <ErrorBoundaryWrapper>
            <LazyLogin />
          </ErrorBoundaryWrapper>
        }
      />
      <Route 
        path="/" 
        element={
          <ErrorBoundaryWrapper>
            <ProtectedRoute>
              <LazyIndex />
            </ProtectedRoute>
          </ErrorBoundaryWrapper>
        }
      />
      <Route 
        path="/dashboard" 
        element={
          <ErrorBoundaryWrapper>
            <ProtectedRoute>
              <LazyDashboard />
            </ProtectedRoute>
          </ErrorBoundaryWrapper>
        }
      />
      {/* Client Routes */}
      <Route 
        path="/clients" 
        element={
          <ErrorBoundaryWrapper>
            <ProtectedRoute>
              <LazyClients />
            </ProtectedRoute>
          </ErrorBoundaryWrapper>
        }
      />
      <Route 
        path="/clients/new" 
        element={
          <ErrorBoundaryWrapper>
            <ProtectedRoute>
              <LazyNewClient />
            </ProtectedRoute>
          </ErrorBoundaryWrapper>
        }
      />
      <Route 
        path="/clients/:id" 
        element={
          <ErrorBoundaryWrapper>
            <ProtectedRoute>
              <LazyClientDetail />
            </ProtectedRoute>
          </ErrorBoundaryWrapper>
        }
      />
      <Route 
        path="/clients/:id/edit" 
        element={
          <ErrorBoundaryWrapper>
            <ProtectedRoute>
              <LazyEditClient />
            </ProtectedRoute>
          </ErrorBoundaryWrapper>
        }
      />
      {/* Contract Routes */}
      <Route 
        path="/contracts" 
        element={
          <ErrorBoundaryWrapper>
            <ProtectedRoute>
              <LazyContracts />
            </ProtectedRoute>
          </ErrorBoundaryWrapper>
        }
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route 
        path="*" 
        element={
          <ErrorBoundaryWrapper>
            <LazyNotFound />
          </ErrorBoundaryWrapper>
        }
      />
    </SentryRoutes>
  );
};
