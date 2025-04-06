
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import {
  Suppliers,
  NewSupplier,
  SupplierDetail,
  EditSupplier
} from '../lazyRoutes';

export const SupplierRoutes = () => {
  return (
    <>
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
    </>
  );
};
