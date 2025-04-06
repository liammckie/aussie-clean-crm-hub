
import React from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import {
  WorkOrders,
  NewWorkOrder,
  WorkOrderDetail
} from '../lazyRoutes';

export const WorkOrderRoutes = () => {
  return (
    <>
      {/* Work Order Routes */}
      <Route path="/work-orders" element={
        <ProtectedRoute>
          <WorkOrders />
        </ProtectedRoute>
      } />
      <Route path="/work-orders/new" element={
        <ProtectedRoute>
          <NewWorkOrder />
        </ProtectedRoute>
      } />
      <Route path="/work-orders/:workOrderId" element={
        <ProtectedRoute>
          <WorkOrderDetail />
        </ProtectedRoute>
      } />
    </>
  );
};
