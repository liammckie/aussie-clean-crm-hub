
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { ErrorBoundaryWrapper } from '@/components/ErrorBoundaryWrapper';
import Index from '@/pages/Index';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Clients = lazy(() => import('@/pages/Clients'));
const ClientDetail = lazy(() => import('@/pages/ClientDetail'));
const EditClient = lazy(() => import('@/pages/EditClient'));
const NewClient = lazy(() => import('@/pages/NewClient'));
const Contacts = lazy(() => import('@/pages/Contacts'));
const Login = lazy(() => import('@/pages/Login'));
const NotFound = lazy(() => import('@/pages/NotFound'));

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, isLoading, children }) => {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isAdminSession, setIsAdminSession] = useState(false);

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      try {
        const sessionData = JSON.parse(adminSession);
        const sessionTimestamp = new Date(sessionData.timestamp).getTime();
        const now = new Date().getTime();
        const sessionDuration = 60 * 60 * 1000;
        if (now - sessionTimestamp < sessionDuration) {
          setIsAdminSession(true);
        } else {
          localStorage.removeItem('admin_session');
          setIsAdminSession(false);
        }
      } catch (error) {
        console.error('Error parsing admin session:', error);
        localStorage.removeItem('admin_session');
        setIsAdminSession(false);
      }
    } else {
      setIsAdminSession(false);
    }
  }, [user]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<ErrorBoundaryWrapper><Suspense fallback={<div>Loading...</div>}><Login /></Suspense></ErrorBoundaryWrapper>} />
      
      <Route path="/dashboard" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
            <MainLayout>
              <ErrorBoundaryWrapper>
                <Suspense fallback={<div>Loading...</div>}>
                  <Dashboard />
                </Suspense>
              </ErrorBoundaryWrapper>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route path="/clients" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
            <MainLayout>
              <ErrorBoundaryWrapper>
                <Suspense fallback={<div>Loading...</div>}>
                  <Clients />
                </Suspense>
              </ErrorBoundaryWrapper>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route path="/clients/:id" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
            <MainLayout>
              <ErrorBoundaryWrapper>
                <Suspense fallback={<div>Loading...</div>}>
                  <ClientDetail />
                </Suspense>
              </ErrorBoundaryWrapper>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route path="/clients/edit/:id" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
            <MainLayout>
              <ErrorBoundaryWrapper>
                <Suspense fallback={<div>Loading...</div>}>
                  <EditClient />
                </Suspense>
              </ErrorBoundaryWrapper>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route path="/clients/new" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
            <MainLayout>
              <ErrorBoundaryWrapper>
                <Suspense fallback={<div>Loading...</div>}>
                  <NewClient />
                </Suspense>
              </ErrorBoundaryWrapper>
            </MainLayout>
          </ProtectedRoute>
        } 
      />

      <Route path="/contacts" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
            <MainLayout>
              <ErrorBoundaryWrapper>
                <Suspense fallback={<div>Loading...</div>}>
                  <Contacts />
                </Suspense>
              </ErrorBoundaryWrapper>
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
