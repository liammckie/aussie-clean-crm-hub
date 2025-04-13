
import React from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AuthProvider } from '@/contexts/AuthContext';

// Import page components
import Dashboard from '@/pages/Dashboard';
import Schema from '@/pages/Schema';
import NotFound from '@/pages/NotFound';
import Admin from '@/pages/Admin';
import Documentation from '@/pages/Documentation';
import Clients from '@/pages/Clients';
import Sites from '@/pages/Sites';
import Contracts from '@/pages/Contracts';
import WorkOrders from '@/pages/WorkOrders';
import Suppliers from '@/pages/Suppliers';
import Activities from '@/pages/Activities';
import Login from '@/pages/Login';

// Import route components
import { ClientRoutes } from '@/routes/route-groups/ClientRoutes';
import { SupplierRoutes } from '@/routes/route-groups/SupplierRoutes';
import { ContractRoutes } from '@/routes/route-groups/ContractRoutes';
import { WorkOrderRoutes } from '@/routes/route-groups/WorkOrderRoutes';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createQueryClient } from '@/utils/query/queryConfig';

// Create a client using our custom configuration
const queryClient = createQueryClient();

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <AuthProvider>
              <SidebarProvider>
                <Routes>
                  {/* Login Route - Default route to ensure authentication */}
                  <Route path="/login" element={<Login />} />

                  {/* Main Protected Routes with Layout */}
                  <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="admin" element={<Admin />} />
                    <Route path="schema" element={<Schema />} />
                    <Route path="docs" element={<Documentation />} />
                    <Route path="activities" element={<Activities />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>

                  {/* Client Routes Group */}
                  <Route path="/clients/*" element={<ClientRoutes />} />
                  
                  {/* Supplier Routes Group */}
                  <Route path="/suppliers/*" element={<SupplierRoutes />} />
                  
                  {/* Contract Routes Group */}
                  <Route path="/contracts/*" element={<ContractRoutes />} />
                  
                  {/* Work Order Routes Group */}
                  <Route path="/work-orders/*" element={<WorkOrderRoutes />} />

                  {/* Redirect root to login if not already handled */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </SidebarProvider>
            </AuthProvider>
            
            <Toaster position="top-right" richColors />
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
