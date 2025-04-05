
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

// Check if admin session exists in local storage
const checkAdminSession = () => {
  const adminSession = localStorage.getItem("admin_session");
  if (!adminSession) return false;
  
  try {
    const session = JSON.parse(adminSession);
    // Add simple expiration check (24 hours)
    const sessionTime = new Date(session.timestamp).getTime();
    const now = new Date().getTime();
    const hoursPassed = (now - sessionTime) / (1000 * 60 * 60);
    
    return hoursPassed < 24;
  } catch (e) {
    return false;
  }
};

// AuthProvider component to wrap around components that need auth context
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize auth state
  useEffect(() => {
    // Check for admin session first
    if (checkAdminSession()) {
      const adminData = JSON.parse(localStorage.getItem("admin_session") || "{}");
      setIsAuthenticated(true);
      setUser({
        id: "admin-user",
        email: adminData.user.email,
        app_metadata: { provider: "custom" },
        user_metadata: { role: "admin" },
        aud: "authenticated",
        created_at: adminData.timestamp
      } as User);
      setLoading(false);
      return;
    }
    
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
      
      // Handle admin login
      if (email === "liam.kingswood@gmail.com" && password === "Dragon007!") {
        // Store admin session
        localStorage.setItem("admin_session", JSON.stringify({
          user: { email, role: "admin" },
          timestamp: new Date().toISOString()
        }));
        
        // Set admin user in state
        setIsAuthenticated(true);
        setUser({
          id: "admin-user",
          email: email,
          app_metadata: { provider: "custom" },
          user_metadata: { role: "admin" },
          aud: "authenticated",
          created_at: new Date().toISOString()
        } as User);
        
        return { success: true };
      }
      
      // For all other users, use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
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
      
      // Clear admin session if exists
      localStorage.removeItem("admin_session");
      
      // For regular users, use Supabase logout
      await supabase.auth.signOut();
      
      // Reset auth state
      setIsAuthenticated(false);
      setUser(null);
      setSession(null);
      
      console.log("Logout successful");
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
