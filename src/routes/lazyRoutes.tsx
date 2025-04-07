
import { lazy } from 'react';

// Import with React.lazy for code splitting
export const Dashboard = lazy(() => import('@/pages/Dashboard'));
export const Login = lazy(() => import('@/pages/Login'));
export const Clients = lazy(() => import('@/pages/Clients'));
export const NewClient = lazy(() => import('@/pages/NewClient'));
export const ClientDetail = lazy(() => import('@/pages/ClientDetail'));
export const EditClient = lazy(() => import('@/pages/EditClient'));
export const Contracts = lazy(() => import('@/pages/Contracts'));
export const ContractDetail = lazy(() => import('@/pages/ContractDetail'));
export const NewContract = lazy(() => import('@/pages/NewContract'));
export const EditContract = lazy(() => import('@/pages/EditContract'));
export const Suppliers = lazy(() => import('@/pages/Suppliers'));
export const NewSupplier = lazy(() => import('@/pages/NewSupplier'));
export const SupplierDetail = lazy(() => import('@/pages/SupplierDetail'));
export const EditSupplier = lazy(() => import('@/pages/EditSupplier'));
export const NotFound = lazy(() => import('@/pages/NotFound'));
export const Sites = lazy(() => import('@/pages/Sites'));
export const Activities = lazy(() => import('@/pages/Activities')); // Add Activities page

// Work Order routes
export const WorkOrders = lazy(() => import('@/pages/WorkOrders'));
export const WorkOrderDetail = lazy(() => import('@/pages/WorkOrderDetail'));
export const NewWorkOrder = lazy(() => import('@/pages/NewWorkOrder'));
