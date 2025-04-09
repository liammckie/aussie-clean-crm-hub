
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Dashboard, NotFound, Sites, Activities } from '../lazyRoutes';
import { LoadingState } from '@/components/clients/LoadingState';
import { Custom404Page } from '@/components/error/Custom404Page';

export const MiscRoutes = () => {
  return (
    <Routes>
      {/* Dashboard page */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingState />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      
      {/* Sites page */}
      <Route 
        path="/sites" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingState />}>
              <Sites />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      
      {/* Activities page */}
      <Route 
        path="/activities" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingState />}>
              <Activities />
            </Suspense>
          </ProtectedRoute>
        } 
      />

      {/* Fallback for 404 */}
      <Route 
        path="*" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingState />}>
              <NotFound />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      
      {/* Error pages with custom messages */}
      <Route 
        path="/unauthorized" 
        element={
          <Custom404Page
            title="Unauthorized Access"
            description="You don't have permission to access this page."
            returnToHomepageLink="/dashboard"
          />
        } 
      />
      
      <Route 
        path="/not-found" 
        element={
          <Custom404Page
            title="Page Not Found"
            description="The page you are looking for doesn't exist or has been moved."
            returnToHomepageLink="/dashboard"
          />
        } 
      />
      
      <Route 
        path="/server-error" 
        element={
          <Custom404Page
            title="Server Error"
            description="Something went wrong on our end. Please try again later."
            returnToHomepageLink="/dashboard"
          />
        } 
      />
      
      <Route 
        path="/maintenance" 
        element={
          <Custom404Page
            title="Under Maintenance"
            description="The system is currently undergoing scheduled maintenance. Please check back soon."
            returnToHomepageLink="/dashboard"
          />
        } 
      />
      
      <Route 
        path="/feature-unavailable" 
        element={
          <Custom404Page
            title="Feature Unavailable"
            description="This feature is currently under development and will be available soon."
            returnToHomepageLink="/dashboard"
          />
        } 
      />
    </Routes>
  );
};
