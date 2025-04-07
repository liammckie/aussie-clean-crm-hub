
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Login } from '../lazyRoutes';

export const AuthRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Login route */}
      <Route path="login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
      } />
      
      {/* Root path of auth routes */}
      <Route path="/" element={
        <Navigate to={isAuthenticated ? "/dashboard" : "/auth/login"} replace />
      } />
      
      {/* Catch-all for auth routes */}
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};
