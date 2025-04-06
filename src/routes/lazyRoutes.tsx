import React from 'react';

// Lazy load pages
export const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
export const Login = React.lazy(() => import('@/pages/Login'));
export const Clients = React.lazy(() => import('@/pages/Clients'));
export const NewClient = React.lazy(() => import('@/pages/NewClient'));
export const ClientDetail = React.lazy(() => import('@/pages/ClientDetail'));
export const EditClient = React.lazy(() => import('@/pages/EditClient'));
export const Contracts = React.lazy(() => import('@/pages/Contracts'));
export const ContractDetail = React.lazy(() => import('@/pages/ContractDetail'));
export const NewContract = React.lazy(() => import('@/pages/NewContract'));
export const Suppliers = React.lazy(() => import('@/pages/Suppliers'));
export const NewSupplier = React.lazy(() => import('@/pages/NewSupplier'));
export const EditContract = React.lazy(() => import('@/pages/EditContract'));
export const NotFound = React.lazy(() => import('@/pages/NotFound'));
