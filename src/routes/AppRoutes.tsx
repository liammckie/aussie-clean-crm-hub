
import React from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
