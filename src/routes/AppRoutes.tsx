
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { default as MainLayout } from '@/layouts/MainLayout';

// Import lazy-loaded components directly from the lazyRoutes file
import {
  Dashboard, 
  Login,
  Clients, 
  NewClient,
  ClientDetail, 
  EditClient,
  Contracts,
  ContractDetail,
  NewContract,
  EditContract,
  Suppliers,
  NewSupplier,
  NotFound 
} from './lazyRoutes';

export function AppRoutes() {
  const isLoggedIn = localStorage.getItem('token');

  // Function to handle protected routes
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="clients/new" element={<NewClient />} />
        <Route path="clients/:clientId" element={<ClientDetail />} />
        <Route path="clients/:clientId/edit" element={<EditClient />} />
        <Route path="contracts" element={<Contracts />} />
        <Route path="contracts/:contractId" element={<ContractDetail />} />
        <Route path="contracts/new" element={<NewContract />} />
        <Route path="contracts/:contractId/edit" element={<EditContract />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="new-supplier" element={<NewSupplier />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
