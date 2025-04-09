
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
        isAuthenticated ? <Navigate to="/" replace /> : <Login />
      } />
      
      {/* Root path of auth routes */}
      <Route path="/" element={
        <Navigate to={isAuthenticated ? "/" : "/login"} replace />
      } />
      
      {/* Catch-all for auth routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
