
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from './MainLayout';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" aria-busy="true" aria-live="polite">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-700"></div>
          <div className="h-4 w-32 rounded bg-slate-700"></div>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Render children within the main layout if authenticated
  return <MainLayout>{children}</MainLayout>;
};
