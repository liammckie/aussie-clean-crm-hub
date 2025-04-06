
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Login } from '../lazyRoutes';

export const AuthRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Public Routes */}
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
      } />
      
      {/* Root path - redirect to dashboard if authenticated, otherwise login */}
      <Route path="/" element={
        <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
      } />
    </>
  );
};
