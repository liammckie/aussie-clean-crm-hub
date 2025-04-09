
import React, { useEffect } from 'react';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from './components/ui/sidebar';
import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorReporting } from './utils/errorReporting';
import { useAuth } from './contexts/AuthContext';

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Check if running in Lovable's iframe
const isInLovableIframe = () => {
  try {
    return window.self !== window.top && 
           (window.location.hostname.includes('lovable') ||
            window.location.hostname.includes('lovableproject'));
  } catch (e) {
    return true; // If we can't access parent window, assume we're in an iframe for safety
  }
};

// User context provider to set user data for error reporting
const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Set user context for error reporting when authenticated
    if (user) {
      ErrorReporting.setUser({
        id: user.id,
        email: user.email,
        username: user.user_metadata?.name
      });
    } else {
      ErrorReporting.setUser(null);
    }
  }, [user]);
  
  return <>{children}</>;
};

function App() {
  // Use HashRouter when in Lovable's iframe environment to avoid routing issues
  const Router = isInLovableIframe() ? HashRouter : BrowserRouter;
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <UserContextProvider>
            <SidebarProvider>
              <AppRoutes />
              <Toaster position="top-right" />
            </SidebarProvider>
          </UserContextProvider>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
