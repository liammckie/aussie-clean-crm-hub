
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import {
  Contracts,
  NewContract,
  ContractDetail,
  EditContract
} from '../lazyRoutes';

export const ContractRoutes = () => {
  return (
    <>
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
    </>
  );
};
