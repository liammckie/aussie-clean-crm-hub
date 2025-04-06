
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';

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
  SupplierDetail,
  EditSupplier,
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
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <MainLayout>
          <Routes>
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
            <Route path="suppliers/new" element={<NewSupplier />} />
            <Route path="suppliers/:supplierId" element={<SupplierDetail />} />
            <Route path="suppliers/:supplierId/edit" element={<EditSupplier />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      } />
    </Routes>
  );
}
