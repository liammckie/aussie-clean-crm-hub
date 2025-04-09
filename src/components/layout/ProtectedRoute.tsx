
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from './MainLayout';
import { AppLogger, LogCategory } from '@/utils/logging';
import { LoadingSpinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    AppLogger.debug(
      LogCategory.AUTH, 
      `ProtectedRoute check at ${location.pathname}`,
      { isAuthenticated, isLoading }
    );
  }, [location.pathname, isAuthenticated, isLoading]);
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" aria-busy="true" aria-live="polite">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    AppLogger.info(LogCategory.AUTH, "Redirecting to login - not authenticated", {
      from: location.pathname
    });
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  // Render children within the main layout if authenticated
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
};
