
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { NotFound, Sites, Dashboard, Activities } from '../lazyRoutes';
import { useAuth } from '@/contexts/AuthContext';
import { WorkOrders } from '../lazyRoutes';

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
          <div>
            <NotFound 
              title="Tasks Coming Soon"
              description="This feature is currently under development."
              returnToHomepageLink="/dashboard"
            />
          </div>
        </ProtectedRoute>
      } />

      {/* Inventory routes (placeholder) */}
      <Route path="inventory" element={
        <ProtectedRoute>
          <div>
            <NotFound 
              title="Inventory Coming Soon"
              description="This feature is currently under development."
              returnToHomepageLink="/dashboard"
            />
          </div>
        </ProtectedRoute>
      } />

      {/* Schedule routes (placeholder) */}
      <Route path="schedule" element={
        <ProtectedRoute>
          <div>
            <NotFound 
              title="Schedule Coming Soon"
              description="This feature is currently under development."
              returnToHomepageLink="/dashboard"
            />
          </div>
        </ProtectedRoute>
      } />

      {/* Reports routes (placeholder) */}
      <Route path="reports" element={
        <ProtectedRoute>
          <div>
            <NotFound 
              title="Reports Coming Soon"
              description="This feature is currently under development."
              returnToHomepageLink="/dashboard"
            />
          </div>
        </ProtectedRoute>
      } />

      {/* Settings routes (placeholder) */}
      <Route path="settings" element={
        <ProtectedRoute>
          <div>
            <NotFound 
              title="Settings Coming Soon"
              description="This feature is currently under development."
              returnToHomepageLink="/dashboard"
            />
          </div>
        </ProtectedRoute>
      } />
      
      {/* Work Orders route */}
      <Route path="work-orders" element={
        <ProtectedRoute>
          <WorkOrders />
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
