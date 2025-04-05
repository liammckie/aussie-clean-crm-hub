
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { ErrorBoundaryWrapper } from '@/components/ErrorBoundaryWrapper';
import { Index } from '@/pages/index';
import { toast } from 'sonner';

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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Please login to continue", {
        description: "You'll be redirected to the login page"
      });
      navigate('/login', { state: { from: location.pathname } });
    }
  }, [isAuthenticated, isLoading, navigate, location]);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  return isAuthenticated ? <>{children}</> : null;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isAdminSession, setIsAdminSession] = useState(false);
  const location = useLocation();

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

  // Redirect authenticated users away from login page
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<ErrorBoundaryWrapper><Login /></ErrorBoundaryWrapper>} />
      
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
