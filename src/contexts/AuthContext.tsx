
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Sentry from "@sentry/react";
import { ErrorReporting } from "@/utils/errorReporting";

// Define auth context type
type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// AuthProvider component to wrap around components that need auth context
export const AuthProvider = ({ children }: AuthProviderProps) => {
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
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
