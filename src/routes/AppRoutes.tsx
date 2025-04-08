
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppLogger, LogCategory } from '@/utils/logging';
import { Login } from './lazyRoutes';
import { NotFound } from './lazyRoutes';
import { Dashboard } from './lazyRoutes';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// Import all the pages directly instead of route group components
import { Clients, NewClient, ClientDetail, EditClient } from './lazyRoutes';
import { Contracts, ContractDetail, NewContract, EditContract } from './lazyRoutes';
import { Suppliers, NewSupplier, SupplierDetail, EditSupplier } from './lazyRoutes';
import { WorkOrders, WorkOrderDetail, NewWorkOrder } from './lazyRoutes';
import { Sites, Activities } from './lazyRoutes';

export function AppRoutes() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" aria-busy="true" aria-live="polite">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-700"></div>
          <div className="h-4 w-32 rounded bg-slate-700"></div>
        </div>
      </div>
    );
  }

  // Adding logging to trace rendering
  AppLogger.debug(LogCategory.UI, "Rendering AppRoutes");

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-700"></div>
          <div className="h-4 w-32 rounded bg-slate-700"></div>
        </div>
      </div>
    }>
      <Routes>
        {/* Redirect root to login if not authenticated, otherwise to dashboard */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } />
        
        {/* Login route directly in main routes for easier access */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        
        {/* Auth routes */}
        <Route path="/auth/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        
        {/* Dashboard page */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Client routes */}
        <Route path="/clients" element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        } />
        <Route path="/clients/new" element={
          <ProtectedRoute>
            <NewClient />
          </ProtectedRoute>
        } />
        <Route path="/clients/:clientId" element={
          <ProtectedRoute>
            <ClientDetail />
          </ProtectedRoute>
        } />
        <Route path="/clients/edit/:clientId" element={
          <ProtectedRoute>
            <EditClient />
          </ProtectedRoute>
        } />
        
        {/* Contract routes */}
        <Route path="/contracts" element={
          <ProtectedRoute>
            <Contracts />
          </ProtectedRoute>
        } />
        <Route path="/contracts/new" element={
          <ProtectedRoute>
            <NewContract />
          </ProtectedRoute>
        } />
        <Route path="/contracts/:contractId" element={
          <ProtectedRoute>
            <ContractDetail />
          </ProtectedRoute>
        } />
        <Route path="/contracts/edit/:contractId" element={
          <ProtectedRoute>
            <EditContract />
          </ProtectedRoute>
        } />
        
        {/* Supplier routes */}
        <Route path="/suppliers" element={
          <ProtectedRoute>
            <Suppliers />
          </ProtectedRoute>
        } />
        <Route path="/suppliers/new" element={
          <ProtectedRoute>
            <NewSupplier />
          </ProtectedRoute>
        } />
        <Route path="/suppliers/:supplierId" element={
          <ProtectedRoute>
            <SupplierDetail />
          </ProtectedRoute>
        } />
        <Route path="/suppliers/edit/:supplierId" element={
          <ProtectedRoute>
            <EditSupplier />
          </ProtectedRoute>
        } />
        
        {/* Work Order routes */}
        <Route path="/work-orders" element={
          <ProtectedRoute>
            <WorkOrders />
          </ProtectedRoute>
        } />
        <Route path="/work-orders/new" element={
          <ProtectedRoute>
            <NewWorkOrder />
          </ProtectedRoute>
        } />
        <Route path="/work-orders/:workOrderId" element={
          <ProtectedRoute>
            <WorkOrderDetail />
          </ProtectedRoute>
        } />
        
        {/* Additional routes */}
        <Route path="/sites" element={
          <ProtectedRoute>
            <Sites />
          </ProtectedRoute>
        } />
        
        <Route path="/activities" element={
          <ProtectedRoute>
            <Activities />
          </ProtectedRoute>
        } />
        
        {/* Error pages */}
        <Route path="/unauthorized" element={
          <NotFound title="Unauthorized Access" description="You don't have permission to access this page." />
        } />
        
        <Route path="/not-found" element={
          <NotFound title="Page Not Found" description="The page you are looking for doesn't exist or has been moved." />
        } />
        
        <Route path="/server-error" element={
          <NotFound title="Server Error" description="Something went wrong on our end. Please try again later." />
        } />
        
        <Route path="/maintenance" element={
          <NotFound title="Under Maintenance" description="The system is currently undergoing scheduled maintenance. Please check back soon." />
        } />
        
        <Route path="/feature-unavailable" element={
          <NotFound title="Feature Unavailable" description="This feature is currently under development and will be available soon." />
        } />
        
        {/* Catch-all not found route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
