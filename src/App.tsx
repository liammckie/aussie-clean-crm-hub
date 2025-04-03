
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useContext, useEffect } from "react";
import { ErrorReporting } from "@/utils/errorReporting";
import * as Sentry from "@sentry/react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { LoadingScreen } from "./components/LoadingScreen";
import { MainLayout } from "./components/layout/MainLayout";
import { withSentryRouting } from "./components/error/SentryRouteError";

// Create Sentry routing enhanced components
const SentryIndex = withSentryRouting(Index);
const SentryDashboard = withSentryRouting(Dashboard);
const SentryLogin = withSentryRouting(Login);
const SentryNotFound = withSentryRouting(NotFound);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      onSettled: (data, error) => {
        if (error) {
          ErrorReporting.captureException(error as Error, { 
            source: 'react-query',
          });
        }
      },
    },
    mutations: {
      onSettled: (data, error) => {
        if (error) {
          ErrorReporting.captureException(error as Error, { 
            source: 'react-query-mutation',
          });
        }
      },
    }
  }
});

// Create auth context to manage authentication state
type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ProtectedRoute component to protect routes that require authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <MainLayout>{children}</MainLayout>;
};

const App = () => {
  const [showLoading, setShowLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const login = () => {
    console.log("Login successful, setting authenticated state");
    setIsAuthenticated(true);
    // Set user info in Sentry when logged in
    ErrorReporting.setUser({
      id: 'user-session-id',
      email: 'logged-in@example.com', // In a real app, use actual user email
    });
  };
  
  const logout = () => {
    setIsAuthenticated(false);
    // Clear user info in Sentry when logged out
    ErrorReporting.setUser(null);
  };

  // Add effect to enable debugging
  useEffect(() => {
    console.log("Auth state:", isAuthenticated ? "Authenticated" : "Not authenticated");
  }, [isAuthenticated]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {showLoading ? (
              <LoadingScreen 
                onLoadingComplete={() => setShowLoading(false)} 
              />
            ) : (
              <Routes>
                <Route path="/login" element={<SentryLogin />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <SentryIndex />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <SentryDashboard />
                    </ProtectedRoute>
                  } 
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<SentryNotFound />} />
              </Routes>
            )}
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default Sentry.withProfiler(App);
