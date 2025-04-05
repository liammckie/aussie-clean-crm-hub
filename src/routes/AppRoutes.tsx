import React from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { RouteErrorBoundary } from "@/components/error/RouteErrorBoundary";
import { ErrorFallback } from "@/components/error/SentryRouteError";

// Lazy load pages with Sentry profiling
const SentryIndex = Sentry.withProfiler(React.lazy(() => import("@/pages/Index")), { name: "Index" });
const SentryDashboard = Sentry.withProfiler(React.lazy(() => import("@/pages/Dashboard")), { name: "Dashboard" });
const SentryClients = Sentry.withProfiler(React.lazy(() => import("@/pages/Clients")), { name: "Clients" });
const SentryClientDetail = Sentry.withProfiler(React.lazy(() => import("@/pages/ClientDetail")), { name: "ClientDetail" });
const SentryNewClient = Sentry.withProfiler(React.lazy(() => import("@/pages/NewClient")), { name: "NewClient" });
const SentryEditClient = Sentry.withProfiler(React.lazy(() => import("@/pages/EditClient")), { name: "EditClient" });
const SentryLogin = Sentry.withProfiler(React.lazy(() => import("@/pages/Login")), { name: "Login" });
const SentryNotFound = Sentry.withProfiler(React.lazy(() => import("@/pages/NotFound")), { name: "NotFound" });
const SentryContracts = Sentry.withProfiler(React.lazy(() => import("@/pages/Contracts")), { name: "Contracts" });

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
    <React.Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <SentryRoutes>
        <Route 
          path="/login" 
          element={
            <ErrorBoundaryWrapper>
              <SentryLogin />
            </ErrorBoundaryWrapper>
          }
        />
        <Route 
          path="/" 
          element={
            <ErrorBoundaryWrapper>
              <ProtectedRoute>
                <SentryIndex />
              </ProtectedRoute>
            </ErrorBoundaryWrapper>
          }
        />
        <Route 
          path="/dashboard" 
          element={
            <ErrorBoundaryWrapper>
              <ProtectedRoute>
                <SentryDashboard />
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
                <SentryClients />
              </ProtectedRoute>
            </ErrorBoundaryWrapper>
          }
        />
        <Route 
          path="/clients/new" 
          element={
            <ErrorBoundaryWrapper>
              <ProtectedRoute>
                <SentryNewClient />
              </ProtectedRoute>
            </ErrorBoundaryWrapper>
          }
        />
        <Route 
          path="/clients/:id" 
          element={
            <ErrorBoundaryWrapper>
              <ProtectedRoute>
                <SentryClientDetail />
              </ProtectedRoute>
            </ErrorBoundaryWrapper>
          }
        />
        <Route 
          path="/clients/:id/edit" 
          element={
            <ErrorBoundaryWrapper>
              <ProtectedRoute>
                <SentryEditClient />
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
                <SentryContracts />
              </ProtectedRoute>
            </ErrorBoundaryWrapper>
          }
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route 
          path="*" 
          element={
            <ErrorBoundaryWrapper>
              <SentryNotFound />
            </ErrorBoundaryWrapper>
          }
        />
      </SentryRoutes>
    </React.Suspense>
  );
};
