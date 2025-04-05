
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { RouteErrorBoundary } from "@/components/error/RouteErrorBoundary";

// Lazy load pages with Sentry profiling
const SentryIndex = Sentry.withProfiler(React.lazy(() => import("@/pages/Index")), { name: "Index" });
const SentryDashboard = Sentry.withProfiler(React.lazy(() => import("@/pages/Dashboard")), { name: "Dashboard" });
const SentryClients = Sentry.withProfiler(React.lazy(() => import("@/pages/Clients")), { name: "Clients" });
const SentryClientDetail = Sentry.withProfiler(React.lazy(() => import("@/pages/ClientDetail")), { name: "ClientDetail" });
const SentryNewClient = Sentry.withProfiler(React.lazy(() => import("@/pages/NewClient")), { name: "NewClient" });
const SentryEditClient = Sentry.withProfiler(React.lazy(() => import("@/pages/EditClient")), { name: "EditClient" });
const SentryLogin = Sentry.withProfiler(React.lazy(() => import("@/pages/Login")), { name: "Login" });
const SentryNotFound = Sentry.withProfiler(React.lazy(() => import("@/pages/NotFound")), { name: "NotFound" });

// ProtectedRoute component to protect routes that require authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <MainLayout>{children}</MainLayout>;
};

// Route configuration
export const AppRoutes = () => {
  // Use Sentry Routes wrapper
  const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);
  
  return (
    <React.Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <SentryRoutes>
        <Route path="/login" element={<SentryLogin />} errorElement={<RouteErrorBoundary />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <SentryIndex />
            </ProtectedRoute>
          }
          errorElement={<RouteErrorBoundary />}
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <SentryDashboard />
            </ProtectedRoute>
          }
          errorElement={<RouteErrorBoundary />}
        />
        {/* Client Routes */}
        <Route 
          path="/clients" 
          element={
            <ProtectedRoute>
              <SentryClients />
            </ProtectedRoute>
          }
          errorElement={<RouteErrorBoundary />}
        />
        <Route 
          path="/clients/new" 
          element={
            <ProtectedRoute>
              <SentryNewClient />
            </ProtectedRoute>
          }
          errorElement={<RouteErrorBoundary />}
        />
        <Route 
          path="/clients/:id" 
          element={
            <ProtectedRoute>
              <SentryClientDetail />
            </ProtectedRoute>
          }
          errorElement={<RouteErrorBoundary />}
        />
        <Route 
          path="/clients/:id/edit" 
          element={
            <ProtectedRoute>
              <SentryEditClient />
            </ProtectedRoute>
          }
          errorElement={<RouteErrorBoundary />}
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<SentryNotFound />} errorElement={<RouteErrorBoundary />} />
      </SentryRoutes>
    </React.Suspense>
  );
};
