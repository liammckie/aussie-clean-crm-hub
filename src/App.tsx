
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
import Admin from '@/pages/Admin'; // Added Admin page import

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <SidebarProvider>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="schema" element={<Schema />} />
                  <Route path="admin" element={<Admin />} /> {/* Added Admin route */}
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
  );
}

export default App;
