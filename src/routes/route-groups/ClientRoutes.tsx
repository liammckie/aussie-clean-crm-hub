
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import {
  Clients,
  NewClient,
  ClientDetail,
  EditClient
} from '../lazyRoutes';
import { AppLogger, LogCategory } from '@/utils/logging';

export const ClientRoutes = () => {
  // Log when these routes are being rendered
  AppLogger.debug(LogCategory.UI, "Rendering ClientRoutes");
  
  return (
    <Routes>
      {/* Client Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Clients />
        </ProtectedRoute>
      } />
      <Route path="new" element={
        <ProtectedRoute>
          <NewClient />
        </ProtectedRoute>
      } />
      <Route path=":clientId" element={
        <ProtectedRoute>
          <ClientDetail />
        </ProtectedRoute>
      } />
      <Route path="edit/:clientId" element={
        <ProtectedRoute>
          <EditClient />
        </ProtectedRoute>
      } />
    </Routes>
  );
};
