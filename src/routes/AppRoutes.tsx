import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Login } from '@/pages/Login';

// Lazy-loaded components
import { lazy } from 'react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Clients = lazy(() => import('@/pages/Clients'));
const NewClient = lazy(() => import('@/pages/NewClient'));
const ClientDetail = lazy(() => import('@/pages/ClientDetail'));
const EditClient = lazy(() => import('@/pages/EditClient'));
const Contracts = lazy(() => import('@/pages/Contracts'));
const ContractDetail = lazy(() => import('@/pages/ContractDetail'));
const NewContract = lazy(() => import('@/pages/NewContract'));
const NotFound = lazy(() => import('@/pages/NotFound'));

import { 
  Dashboard, 
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
