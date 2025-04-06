
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { NotFound, Sites, Dashboard } from '../lazyRoutes';
import { useAuth } from '@/contexts/AuthContext';

export const MiscRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Dashboard - protected route */}
      <Route path="dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Sites route */}
      <Route path="sites" element={
        <ProtectedRoute>
          <Sites />
        </ProtectedRoute>
      } />

      {/* Task routes (placeholder) */}
      <Route path="tasks" element={
        <ProtectedRoute>
          <NotFound />
        </ProtectedRoute>
      } />

      {/* Inventory routes (placeholder) */}
      <Route path="inventory" element={
        <ProtectedRoute>
          <NotFound />
        </ProtectedRoute>
      } />

      {/* Schedule routes (placeholder) */}
      <Route path="schedule" element={
        <ProtectedRoute>
          <NotFound />
        </ProtectedRoute>
      } />

      {/* Reports routes (placeholder) */}
      <Route path="reports" element={
        <ProtectedRoute>
          <NotFound />
        </ProtectedRoute>
      } />

      {/* Settings routes (placeholder) */}
      <Route path="settings" element={
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
};
