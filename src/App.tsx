
import React, { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from './components/ui/sidebar';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes/AppRoutes';

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
      <AuthProvider>
        <BrowserRouter>
          <SidebarProvider>
            <AppRoutes />
            <Toaster position="top-right" />
          </SidebarProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
