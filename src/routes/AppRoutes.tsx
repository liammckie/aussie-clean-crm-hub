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
  LazyContracts,
  LazyNewContract,
  LazyContractDetail,
  LazyEditContract
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

// DatabaseDocumentation component to view schema information
const DatabaseDocumentation = () => {
  return (
    <div className="container mx-auto p-4 text-sm">
      <div className="p-4 rounded bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 my-4">
        <h2 className="text-xl font-bold mb-4">Contract Table Schema Documentation</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border p-2 text-left">Column Name</th>
                <th className="border p-2 text-left">Type</th>
                <th className="border p-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">id</td>
                <td className="border p-2">UUID</td>
                <td className="border p-2">Primary key</td>
              </tr>
              <tr>
                <td className="border p-2">client_id</td>
                <td className="border p-2">UUID</td>
                <td className="border p-2">Foreign key reference to clients table</td>
              </tr>
              <tr>
                <td className="border p-2">contract_name</td>
                <td className="border p-2">text</td>
                <td className="border p-2">Name of the contract</td>
              </tr>
              <tr>
                <td className="border p-2">contract_code</td>
                <td className="border p-2">text</td>
                <td className="border p-2">Unique reference code</td>
              </tr>
              <tr>
                <td className="border p-2">service_type</td>
                <td className="border p-2">text</td>
                <td className="border p-2">Primary service category</td>
              </tr>
              <tr>
                <td className="border p-2">status</td>
                <td className="border p-2">text</td>
                <td className="border p-2">Contract state (draft, active, expired, etc.)</td>
              </tr>
              <tr>
                <td className="border p-2">start_date</td>
                <td className="border p-2">date</td>
                <td className="border p-2">Contract start date</td>
              </tr>
              <tr>
                <td className="border p-2">end_date</td>
                <td className="border p-2">date</td>
                <td className="border p-2">Contract end date</td>
              </tr>
              <tr>
                <td className="border p-2">delivery_mode</td>
                <td className="border p-2">text</td>
                <td className="border p-2">How services are delivered (employee, contractor, hybrid)</td>
              </tr>
              <tr>
                <td className="border p-2">account_manager</td>
                <td className="border p-2">text</td>
                <td className="border p-2">Name of account manager</td>
              </tr>
              <tr>
                <td className="border p-2">state_manager</td>
                <td className="border p-2">text</td>
                <td className="border p-2">Name of state manager</td>
              </tr>
              <tr>
                <td className="border p-2">national_manager</td>
                <td className="border p-2">text</td>
                <td className="border p-2">Name of national manager</td>
              </tr>
              <tr>
                <td className="border p-2">total_weekly_value</td>
                <td className="border p-2">numeric</td>
                <td className="border p-2">Total weekly contract value</td>
              </tr>
              <tr>
                <td className="border p-2">total_monthly_value</td>
                <td className="border p-2">numeric</td>
                <td className="border p-2">Total monthly contract value</td>
              </tr>
              <tr>
                <td className="border p-2">total_annual_value</td>
                <td className="border p-2">numeric</td>
                <td className="border p-2">Total annual contract value</td>
              </tr>
              <tr>
                <td className="border p-2">billing_frequency</td>
                <td className="border p-2">text</td>
                <td className="border p-2">How often billing occurs</td>
              </tr>
              <tr>
                <td className="border p-2">billing_type</td>
                <td className="border p-2">text</td>
                <td className="border p-2">Type of billing (Fixed, Variable, etc.)</td>
              </tr>
              <tr>
                <td className="border p-2">payment_terms</td>
                <td className="border p-2">text</td>
                <td className="border p-2">Payment terms (Net 30, etc.)</td>
              </tr>
              <tr>
                <td className="border p-2">description</td>
                <td className="border p-2">text</td>
                <td className="border p-2">Contract description</td>
              </tr>
              <tr>
                <td className="border p-2">created_at</td>
                <td className="border p-2">timestamp</td>
                <td className="border p-2">Creation timestamp</td>
              </tr>
              <tr>
                <td className="border p-2">updated_at</td>
                <td className="border p-2">timestamp</td>
                <td className="border p-2">Last update timestamp</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
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
      <Route 
        path="/contracts/new" 
        element={
          <RouterErrorBoundary>
            <ProtectedRoute>
              <LazyNewContract />
            </ProtectedRoute>
          </RouterErrorBoundary>
        }
      />
      <Route 
        path="/contracts/:id" 
        element={
          <RouterErrorBoundary>
            <ProtectedRoute>
              <LazyContractDetail />
            </ProtectedRoute>
          </RouterErrorBoundary>
        }
      />
      <Route 
        path="/contracts/:id/edit" 
        element={
          <RouterErrorBoundary>
            <ProtectedRoute>
              <LazyEditContract />
            </ProtectedRoute>
          </RouterErrorBoundary>
        }
      />
      
      {/* Database Schema Documentation */}
      <Route 
        path="/docs/schema" 
        element={
          <RouterErrorBoundary>
            <ProtectedRoute>
              <DatabaseDocumentation />
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
