
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from './components/ui/sidebar';

// Import immediately needed components
import { MainLayout as Layout } from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';

// Lazy load component pages
const Clients = lazy(() => import('./pages/Clients'));
const NewClient = lazy(() => import('./pages/NewClient'));
const ClientDetails = lazy(() => import('./pages/ClientDetail'));
const Sites = lazy(() => import('./pages/Sites'));
const SiteDetails = lazy(() => import('./pages/Sites')); // Placeholder until SiteDetails is created
const NewSite = lazy(() => import('./pages/NotFound')); // Placeholder until NewSite is created
const Contracts = lazy(() => import('./pages/Contracts'));
const ContractDetails = lazy(() => import('./pages/ContractDetail'));
const NewContract = lazy(() => import('./pages/NewContract'));
const Suppliers = lazy(() => import('./pages/Suppliers'));
const SupplierDetails = lazy(() => import('./pages/SupplierDetail'));
const NewSupplier = lazy(() => import('./pages/NewSupplier'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/NotFound')); // Placeholder until Register is created
const Settings = lazy(() => import('./pages/NotFound')); // Placeholder until Settings is created
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component for suspense fallback
const Loading = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      <p className="text-xl font-medium text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SidebarProvider>
          <Routes>
            <Route path="/" element={<Layout children={undefined} />}>
              <Route index element={<Dashboard />} />
              <Route path="clients" element={
                <Suspense fallback={<Loading />}>
                  <Clients />
                </Suspense>
              } />
              <Route path="clients/new" element={
                <Suspense fallback={<Loading />}>
                  <NewClient />
                </Suspense>
              } />
              <Route path="clients/:id" element={
                <Suspense fallback={<Loading />}>
                  <ClientDetails />
                </Suspense>
              } />
              <Route path="sites" element={
                <Suspense fallback={<Loading />}>
                  <Sites />
                </Suspense>
              } />
              <Route path="sites/new" element={
                <Suspense fallback={<Loading />}>
                  <NewSite />
                </Suspense>
              } />
              <Route path="sites/:id" element={
                <Suspense fallback={<Loading />}>
                  <SiteDetails />
                </Suspense>
              } />
              <Route path="contracts" element={
                <Suspense fallback={<Loading />}>
                  <Contracts />
                </Suspense>
              } />
              <Route path="contracts/new" element={
                <Suspense fallback={<Loading />}>
                  <NewContract />
                </Suspense>
              } />
              <Route path="contracts/:id" element={
                <Suspense fallback={<Loading />}>
                  <ContractDetails />
                </Suspense>
              } />
              <Route path="suppliers" element={
                <Suspense fallback={<Loading />}>
                  <Suppliers />
                </Suspense>
              } />
              <Route path="suppliers/new" element={
                <Suspense fallback={<Loading />}>
                  <NewSupplier />
                </Suspense>
              } />
              <Route path="suppliers/:id" element={
                <Suspense fallback={<Loading />}>
                  <SupplierDetails />
                </Suspense>
              } />
              <Route path="settings" element={
                <Suspense fallback={<Loading />}>
                  <Settings />
                </Suspense>
              } />
              <Route path="*" element={
                <Suspense fallback={<Loading />}>
                  <NotFound />
                </Suspense>
              } />
            </Route>
            <Route path="/login" element={
              <Suspense fallback={<Loading />}>
                <Login />
              </Suspense>
            } />
            <Route path="/register" element={
              <Suspense fallback={<Loading />}>
                <Register />
              </Suspense>
            } />
          </Routes>
          <Toaster position="top-right" />
        </SidebarProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
