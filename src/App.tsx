
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/theme-provider';

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
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="schema" element={<Schema />} />
            <Route path="admin" element={<Admin />} /> {/* Added Admin route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        
        <Toaster position="top-right" richColors />
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
