
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useRouteError } from "react-router-dom";
import { useState, createContext, useContext, useEffect } from "react";
import { ErrorReporting } from "@/utils/errorReporting";
import * as Sentry from "@sentry/react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { LoadingScreen } from "./components/LoadingScreen";
import { MainLayout } from "./components/layout/MainLayout";

// Create Sentry Routes wrapper
const SentryRoutes = Sentry.withSentryReactRouterV6Routing(Routes);

// Enhance components with Sentry profiling
const SentryIndex = Sentry.withProfiler(Index, { name: "Index" });
const SentryDashboard = Sentry.withProfiler(Dashboard, { name: "Dashboard" });
const SentryLogin = Sentry.withProfiler(Login, { name: "Login" });
const SentryNotFound = Sentry.withProfiler(NotFound, { name: "NotFound" });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      meta: {
        onError: (error: Error) => {
          ErrorReporting.captureException(error, { 
            source: 'react-query',
          });
        },
      },
    },
    mutations: {
      meta: {
        onError: (error: Error) => {
          ErrorReporting.captureException(error, { 
            source: 'react-query-mutation',
          });
        },
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

// Custom Error Boundary component for React Router
const RouteErrorBoundary = () => {
  const error = useRouteError() as Error;
  
  useEffect(() => {
    // Report error to Sentry
    Sentry.captureException(error);
  }, [error]);
  
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 bg-slate-900 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold text-red-500 mb-4">Something went wrong</h1>
        <p className="text-slate-300 mb-4">
          {error?.message || "An unexpected error occurred"}
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded"
        >
          Go Home
        </button>
      </div>
    </div>
  );
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
              <SentryRoutes>
                <Route path="/login" element={<SentryLogin />} errorElement={<RouteErrorBoundary />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <SentryIndex />
                    </ProtectedRoute>
                  }
                  errorElement={<RouteErrorBoundary />}
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <SentryDashboard />
                    </ProtectedRoute>
                  }
                  errorElement={<RouteErrorBoundary />}
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<SentryNotFound />} errorElement={<RouteErrorBoundary />} />
              </SentryRoutes>
            )}
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default Sentry.withProfiler(App);
