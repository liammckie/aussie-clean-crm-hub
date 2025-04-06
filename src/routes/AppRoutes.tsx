
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// Import lazy-loaded components directly from the lazyRoutes file
import {
  Dashboard, 
  Login,
  Clients, 
  NewClient,
  ClientDetail, 
  EditClient,
  Contracts,
  ContractDetail,
  NewContract,
  EditContract,
  Suppliers,
  NewSupplier,
  SupplierDetail,
  EditSupplier,
  NotFound,
  Sites,
  // Work Order routes
  WorkOrders,
  WorkOrderDetail,
  NewWorkOrder
} from './lazyRoutes';

export function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

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

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
      } />
      
      {/* Root path - redirect to dashboard if authenticated, otherwise login */}
      <Route path="/" element={
        <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
      } />

      {/* Dashboard - protected route */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Client Routes */}
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
      
      {/* Contract Routes */}
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
      <Route path="/contracts/:contractId/edit" element={
        <ProtectedRoute>
          <EditContract />
        </ProtectedRoute>
      } />
      
      {/* Supplier Routes */}
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
      <Route path="/suppliers/:supplierId/edit" element={
        <ProtectedRoute>
          <EditSupplier />
        </ProtectedRoute>
      } />

      {/* Sites route */}
      <Route path="/sites" element={
        <ProtectedRoute>
          <Sites />
        </ProtectedRoute>
      } />

      {/* Work Order Routes */}
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

      {/* Task routes (placeholder) */}
      <Route path="/tasks" element={
        <ProtectedRoute>
          <NotFound />
        </ProtectedRoute>
      } />

      {/* Inventory routes (placeholder) */}
      <Route path="/inventory" element={
        <ProtectedRoute>
          <NotFound />
        </ProtectedRoute>
      } />

      {/* Schedule routes (placeholder) */}
      <Route path="/schedule" element={
        <ProtectedRoute>
          <NotFound />
        </ProtectedRoute>
      } />

      {/* Reports routes (placeholder) */}
      <Route path="/reports" element={
        <ProtectedRoute>
          <NotFound />
        </ProtectedRoute>
      } />

      {/* Settings routes (placeholder) */}
      <Route path="/settings" element={
        <ProtectedRoute>
          <NotFound />
        </ProtectedRoute>
      } />
      
      {/* Catch all for 404 */}
      <Route path="*" element={
        isAuthenticated ? (
          <ProtectedRoute>
            <NotFound />
          </ProtectedRoute>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
    </Routes>
  );
}
