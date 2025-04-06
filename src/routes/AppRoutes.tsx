
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
  NotFound 
} from './lazyRoutes';

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard if logged in and trying to access login page
  if (isAuthenticated && window.location.pathname === '/login') {
    return <Navigate to="/" />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
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
      <Route path="/clients/:clientId/edit" element={
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
      
      {/* Catch all for 404 */}
      <Route path="*" element={
        <ProtectedRoute>
          <NotFound />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
