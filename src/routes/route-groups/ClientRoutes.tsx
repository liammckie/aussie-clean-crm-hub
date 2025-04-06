
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { 
  Clients, 
  NewClient, 
  ClientDetail, 
  EditClient 
} from '../lazyRoutes';

export const ClientRoutes = () => {
  return (
    <>
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
    </>
  );
};
