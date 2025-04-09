
import { lazy } from "react";

// Lazily load all pages for better performance
export const Dashboard = lazy(() => import("@/pages/Dashboard"));
export const Login = lazy(() => import("@/pages/Login"));
export const NotFound = lazy(() => import("@/pages/NotFound"));

// Client routes
export const Clients = lazy(() => import("@/pages/clients/Clients"));
export const NewClient = lazy(() => import("@/pages/clients/NewClient"));
export const ClientDetail = lazy(() => import("@/pages/clients/ClientDetail"));
export const EditClient = lazy(() => import("@/pages/clients/EditClient"));

// Contract routes
export const Contracts = lazy(() => import("@/pages/contracts/Contracts"));
export const ContractDetail = lazy(() => import("@/pages/contracts/ContractDetail"));
export const NewContract = lazy(() => import("@/pages/contracts/NewContract"));
export const EditContract = lazy(() => import("@/pages/contracts/EditContract"));

// Supplier routes
export const Suppliers = lazy(() => import("@/pages/suppliers/Suppliers"));
export const NewSupplier = lazy(() => import("@/pages/suppliers/NewSupplier"));
export const SupplierDetail = lazy(() => import("@/pages/suppliers/SupplierDetail"));
export const EditSupplier = lazy(() => import("@/pages/suppliers/EditSupplier"));

// Work Order routes
export const WorkOrders = lazy(() => import("@/pages/workorders/WorkOrders"));
export const WorkOrderDetail = lazy(() => import("@/pages/workorders/WorkOrderDetail"));
export const NewWorkOrder = lazy(() => import("@/pages/workorders/NewWorkOrder"));

// Site routes
export const Sites = lazy(() => import("@/pages/sites/Sites"));

// Activity routes
export const Activities = lazy(() => import("@/pages/activities/Activities"));

// Error Testing Tools
export const ErrorTesting = lazy(() => import("@/pages/developer/ErrorTesting"));
