
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import {
  Clients,
  NewClient,
  ClientDetail,
  EditClient
} from '../lazyRoutes';
import { AppLogger, LogCategory } from '@/utils/logging';
import { LoadingState } from '@/components/clients/LoadingState';

export const ClientRoutes = () => {
  // Log when these routes are being rendered
  AppLogger.debug(LogCategory.UI, "Rendering ClientRoutes");
  
  return (
    <Routes>
      {/* Client Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingState />}>
            <Clients />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/new" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingState />}>
            <NewClient />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/:clientId" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingState />}>
            <ClientDetail />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/edit/:clientId" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingState />}>
            <EditClient />
          </Suspense>
        </ProtectedRoute>
      } />
    </Routes>
  );
};
