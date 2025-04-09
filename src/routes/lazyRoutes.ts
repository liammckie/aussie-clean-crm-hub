
import { lazy } from "react";

// Lazily load all pages for better performance
export const Dashboard = lazy(() => import("@/pages/Dashboard"));
export const Login = lazy(() => import("@/pages/Login"));
export const NotFound = lazy(() => import("@/pages/NotFound"));

// Client routes
export const Clients = lazy(() => import("@/pages/Clients"));
export const NewClient = lazy(() => import("@/pages/NewClient"));
export const ClientDetail = lazy(() => import("@/pages/ClientDetail"));
export const EditClient = lazy(() => import("@/pages/EditClient"));

// Sales route
export const Sales = lazy(() => import("@/pages/Sales"));

// Schema route
export const Schema = lazy(() => import("@/pages/Schema"));

// Contract routes
export const Contracts = lazy(() => import("@/pages/Contracts"));
export const ContractDetail = lazy(() => import("@/pages/ContractDetail"));
export const NewContract = lazy(() => import("@/pages/NewContract"));
export const EditContract = lazy(() => import("@/pages/EditContract"));

// Supplier routes
export const Suppliers = lazy(() => import("@/pages/Suppliers"));
export const NewSupplier = lazy(() => import("@/pages/NewSupplier"));
export const SupplierDetail = lazy(() => import("@/pages/SupplierDetail"));
export const EditSupplier = lazy(() => import("@/pages/EditSupplier"));

// Work Order routes
export const WorkOrders = lazy(() => import("@/pages/WorkOrders"));
export const WorkOrderDetail = lazy(() => import("@/pages/WorkOrderDetail"));
export const NewWorkOrder = lazy(() => import("@/pages/NewWorkOrder"));

// Site routes
export const Sites = lazy(() => import("@/pages/Sites"));

// Activity routes
export const Activities = lazy(() => import("@/pages/Activities"));

// Error Testing Tools
export const ErrorTesting = lazy(() => import("@/pages/developer/ErrorTesting"));
