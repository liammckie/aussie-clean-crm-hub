
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthRoutes } from './route-groups/AuthRoutes';
import { ClientRoutes } from './route-groups/ClientRoutes';
import { ContractRoutes } from './route-groups/ContractRoutes';
import { SupplierRoutes } from './route-groups/SupplierRoutes';
import { WorkOrderRoutes } from './route-groups/WorkOrderRoutes';
import { MiscRoutes } from './route-groups/MiscRoutes';
import { AppLogger, LogCategory } from '@/utils/logging';

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

  // Adding logging to trace rendering
  AppLogger.debug(LogCategory.UI, "Rendering AppRoutes");

  return (
    <Routes>
      {/* Ensure we have a default route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Auth routes come first */}
      <Route path="/auth/*" element={<AuthRoutes />} />
      
      {/* Feature routes */}
      <Route path="/clients/*" element={<ClientRoutes />} />
      <Route path="/contracts/*" element={<ContractRoutes />} />
      <Route path="/suppliers/*" element={<SupplierRoutes />} />
      <Route path="/work-orders/*" element={<WorkOrderRoutes />} />
      
      {/* Dashboard and other routes */}
      <Route path="/*" element={<MiscRoutes />} />
    </Routes>
  );
}
