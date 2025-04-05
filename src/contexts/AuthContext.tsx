
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import * as Sentry from "@sentry/react";
import { ErrorReporting } from "@/utils/errorReporting";

// Define auth context type
type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        
        // Update Sentry user info
        if (session?.user) {
          ErrorReporting.setUser({
            id: session.user.id,
            email: session.user.email || undefined,
          });
          
          ErrorReporting.addBreadcrumb({
            category: 'auth',
            message: 'User authenticated',
            level: 'info'
          });
        } else {
          ErrorReporting.setUser(null);
        }
      }
    );
    
    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setLoading(false);
      
      if (session?.user) {
        ErrorReporting.setUser({
          id: session.user.id,
          email: session.user.email || undefined,
        });
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      setLoading(true);
      
      // Remove the invalid property 'shouldCreateSession'
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        // The rememberMe functionality is handled by Supabase's default behavior
        // When using localStorage as the storage mechanism
      });
      
      if (error) {
        console.error("Login error:", error.message);
        return { success: false, message: error.message };
      }
      
      console.log("Login successful");
      
      // Session will be automatically set by the onAuthStateChange listener
      return { success: true };
    } catch (error: any) {
      console.error("Unexpected login error:", error);
      ErrorReporting.captureException(error, {
        email,
        context: 'login',
      });
      return { success: false, message: error.message || 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      console.log("Logout successful");
      // Session will be automatically cleared by the onAuthStateChange listener
    } catch (error) {
      console.error("Logout error:", error);
      ErrorReporting.captureException(error as Error, {
        context: 'logout',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, session, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
