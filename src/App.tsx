
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
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
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="sites" element={<Sites />} />
                    <Route path="contracts" element={<Contracts />} />
                    <Route path="work-orders" element={<WorkOrders />} />
                    <Route path="suppliers" element={<Suppliers />} />
                    <Route path="activities" element={<Activities />} />
                    <Route path="admin" element={<Admin />} />
                    <Route path="schema" element={<Schema />} />
                    <Route path="docs" element={<Documentation />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
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
