
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { NotFound, Sites, Dashboard, Activities } from '../lazyRoutes';
import { useAuth } from '@/contexts/AuthContext';

export const MiscRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Dashboard - protected route */}
      <Route path="/" element={
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
      
      {/* Activities route */}
      <Route path="activities" element={
        <ProtectedRoute>
          <Activities />
        </ProtectedRoute>
      } />

      {/* Task routes (placeholder) */}
      <Route path="tasks" element={
        <ProtectedRoute>
          <NotFound 
            title="Tasks Coming Soon"
            description="This feature is currently under development."
            returnToHomepageLink="/dashboard"
          />
        </ProtectedRoute>
      } />

      {/* Inventory routes (placeholder) */}
      <Route path="inventory" element={
        <ProtectedRoute>
          <NotFound 
            title="Inventory Coming Soon"
            description="This feature is currently under development."
            returnToHomepageLink="/dashboard"
          />
        </ProtectedRoute>
      } />

      {/* Schedule routes (placeholder) */}
      <Route path="schedule" element={
        <ProtectedRoute>
          <NotFound 
            title="Schedule Coming Soon"
            description="This feature is currently under development."
            returnToHomepageLink="/dashboard"
          />
        </ProtectedRoute>
      } />

      {/* Reports routes (placeholder) */}
      <Route path="reports" element={
        <ProtectedRoute>
          <NotFound 
            title="Reports Coming Soon"
            description="This feature is currently under development."
            returnToHomepageLink="/dashboard"
          />
        </ProtectedRoute>
      } />

      {/* Settings routes (placeholder) */}
      <Route path="settings" element={
        <ProtectedRoute>
          <NotFound 
            title="Settings Coming Soon"
            description="This feature is currently under development."
            returnToHomepageLink="/dashboard"
          />
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
