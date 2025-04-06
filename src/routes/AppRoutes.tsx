
import React from 'react';
import { Routes } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Import route groups
import { AuthRoutes } from './route-groups/AuthRoutes';
import { ClientRoutes } from './route-groups/ClientRoutes';
import { ContractRoutes } from './route-groups/ContractRoutes';
import { SupplierRoutes } from './route-groups/SupplierRoutes';
import { WorkOrderRoutes } from './route-groups/WorkOrderRoutes';
import { MiscRoutes } from './route-groups/MiscRoutes';

export function AppRoutes() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" aria-busy="true" aria-live="polite">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-700"></div>
          <div className="h-4 w-32 rounded bg-slate-700"></div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <AuthRoutes />
      <ClientRoutes />
      <ContractRoutes />
      <SupplierRoutes />
      <WorkOrderRoutes />
      <MiscRoutes />
    </Routes>
  );
}
