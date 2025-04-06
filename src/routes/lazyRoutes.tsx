import React, { lazy } from 'react';

// Lazy-loaded component imports
export const Dashboard = lazy(() => import('@/pages/Dashboard'));
export const Login = lazy(() => import('@/pages/Login'));

// Client routes
export const Clients = lazy(() => import('@/pages/Clients'));
export const NewClient = lazy(() => import('@/pages/NewClient'));
export const ClientDetail = lazy(() => import('@/pages/ClientDetail'));
export const EditClient = lazy(() => import('@/pages/EditClient'));

// Contract routes
export const Contracts = lazy(() => import('@/pages/Contracts'));
export const ContractDetail = lazy(() => import('@/pages/ContractDetail'));
export const NewContract = lazy(() => import('@/pages/NewContract'));
export const EditContract = lazy(() => import('@/pages/EditContract'));

// Supplier routes
export const Suppliers = lazy(() => import('@/pages/Suppliers'));
export const NewSupplier = lazy(() => import('@/pages/NewSupplier'));
export const SupplierDetail = lazy(() => import('@/pages/SupplierDetail'));
export const EditSupplier = lazy(() => import('@/pages/EditSupplier'));

// Other routes
export const NotFound = lazy(() => import('@/pages/NotFound'));
