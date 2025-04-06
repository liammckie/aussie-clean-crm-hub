
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import {
  WorkOrders,
  NewWorkOrder,
  WorkOrderDetail
} from '../lazyRoutes';

export const WorkOrderRoutes = () => {
  return (
    <Routes>
      {/* Work Order Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <WorkOrders />
        </ProtectedRoute>
      } />
      <Route path="new" element={
        <ProtectedRoute>
          <NewWorkOrder />
        </ProtectedRoute>
      } />
      <Route path=":workOrderId" element={
        <ProtectedRoute>
          <WorkOrderDetail />
        </ProtectedRoute>
      } />
    </Routes>
  );
};
