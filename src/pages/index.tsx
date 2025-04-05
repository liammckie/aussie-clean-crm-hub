
import React from 'react';
import { Navigate } from 'react-router-dom';

export const Index: React.FC = () => {
  return <Navigate to="/dashboard" replace />;
};
