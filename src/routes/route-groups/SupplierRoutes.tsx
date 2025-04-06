
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import {
  Suppliers,
  NewSupplier,
  SupplierDetail,
  EditSupplier
} from '../lazyRoutes';

export const SupplierRoutes = () => {
  return (
    <Routes>
      {/* Supplier Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Suppliers />
        </ProtectedRoute>
      } />
      <Route path="new" element={
        <ProtectedRoute>
          <NewSupplier />
        </ProtectedRoute>
      } />
      <Route path=":supplierId" element={
        <ProtectedRoute>
          <SupplierDetail />
        </ProtectedRoute>
      } />
      <Route path=":supplierId/edit" element={
        <ProtectedRoute>
          <EditSupplier />
        </ProtectedRoute>
      } />
    </Routes>
  );
};
