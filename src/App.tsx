
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { LoadingScreen } from "./components/LoadingScreen";
import { MainLayout } from "./components/layout/MainLayout";

const queryClient = new QueryClient();

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
  
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

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
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
