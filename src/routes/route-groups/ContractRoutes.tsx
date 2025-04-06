
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import {
  Contracts,
  NewContract,
  ContractDetail,
  EditContract
} from '../lazyRoutes';

export const ContractRoutes = () => {
  return (
    <Routes>
      {/* Contract Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Contracts />
        </ProtectedRoute>
      } />
      <Route path="new" element={
        <ProtectedRoute>
          <NewContract />
        </ProtectedRoute>
      } />
      <Route path=":contractId" element={
        <ProtectedRoute>
          <ContractDetail />
        </ProtectedRoute>
      } />
      <Route path="edit/:contractId" element={
        <ProtectedRoute>
          <EditContract />
        </ProtectedRoute>
      } />
    </Routes>
  );
};
