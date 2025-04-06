
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { ErrorReporting } from '@/utils/errorReporting';
import { toast } from 'sonner';
import { AppLogger, LogCategory } from '@/utils/logging';

interface AdminSession {
  timestamp: string;
  active: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setAdminSession: () => void;
  isAdminSession: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdminSession, setIsAdminSession] = useState<boolean>(false);

  // Check if admin session is valid
  const checkAdminSession = (): boolean => {
    try {
      const adminSessionStr = localStorage.getItem("admin_session");
      if (!adminSessionStr) return false;
      
      const adminSession: AdminSession = JSON.parse(adminSessionStr);
      
      // Verify active flag is set
      if (!adminSession.active) return false;
      
      // Add simple expiration check (8 hours)
      const sessionTime = new Date(adminSession.timestamp).getTime();
      const now = new Date().getTime();
      const hoursPassed = (now - sessionTime) / (1000 * 60 * 60);
      
      return hoursPassed < 8;
    } catch (e) {
      AppLogger.error(LogCategory.AUTH, 'Error parsing admin session', { error: e });
      localStorage.removeItem('admin_session');
      return false;
    }
  };

  useEffect(() => {
    // Function to set the user state from a session
    const initializeAuthState = async () => {
      setIsLoading(true);
      try {
        AppLogger.info(LogCategory.AUTH, 'Initializing auth state');
        
        // Set up listener for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            AppLogger.info(LogCategory.AUTH, `Auth state changed: ${event}`, { 
              hasSession: !!session 
            });
            
            // Clear admin session when real auth happens
            if (session?.user) {
              localStorage.removeItem('admin_session');
              setIsAdminSession(false);
            }
            
            // Update user and authentication state
            setUser(session?.user || null);
            setIsAuthenticated(!!session);
            
            // Send user info to error reporting
            if (session?.user) {
              ErrorReporting.setUser({
                id: session.user.id,
                email: session.user.email || undefined,
              });
            } else {
              ErrorReporting.setUser(null);
            }
          }
        );

        // Then check for existing session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        // Update user and authentication state
        setUser(data.session?.user || null);
        const hasSupabaseAuth = !!data.session?.user;
        
        // Check for admin session only if no Supabase auth
        const hasAdminSession = !hasSupabaseAuth && checkAdminSession();
        
        setIsAuthenticated(hasSupabaseAuth || hasAdminSession);
        setIsAdminSession(hasAdminSession);
        
        AppLogger.info(LogCategory.AUTH, 'Auth state initialized:', { 
          isAuthenticated: hasSupabaseAuth || hasAdminSession,
          isAdminSession: hasAdminSession,
          hasSupabaseAuth: hasSupabaseAuth
        });
        
        // Clean up subscription when component unmounts
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        AppLogger.error(LogCategory.AUTH, 'Error retrieving session', { error });
        ErrorReporting.captureException(error as Error);
        setIsAuthenticated(false);
        setIsAdminSession(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize auth state
    initializeAuthState();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      AppLogger.info(LogCategory.AUTH, 'Attempting sign in', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Clear any existing admin session
      localStorage.removeItem('admin_session');
      setIsAdminSession(false);

      // Log success and important info for debugging
      AppLogger.info(LogCategory.AUTH, 'Sign in successful', { 
        hasSession: !!data.session,
        hasUser: !!data.user
      });
      
      setIsAuthenticated(true);
      setUser(data.user);
      toast.success('Logged in successfully');
    } catch (error: any) {
      AppLogger.error(LogCategory.AUTH, 'Login error', { error });
      ErrorReporting.captureException(error as Error);
      toast.error(`Login failed: ${error.message}`);
      throw error; // Rethrow to allow handling in form
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setIsLoading(true);
      AppLogger.info(LogCategory.AUTH, 'Signing out');
      
      await supabase.auth.signOut();
      // Clear admin session as well
      localStorage.removeItem('admin_session');
      setIsAuthenticated(false);
      setIsAdminSession(false);
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      AppLogger.error(LogCategory.AUTH, 'Sign out error', { error });
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to log out');
    } finally {
      setIsLoading(false);
    }
  };

  // Set admin session for development purposes
  const setAdminSession = () => {
    const timestamp = new Date().toISOString();
    localStorage.setItem('admin_session', JSON.stringify({ 
      timestamp,
      active: true
    }));
    setIsAuthenticated(true);
    setIsAdminSession(true);
    AppLogger.info(LogCategory.AUTH, 'Admin session set');
    toast.success('Development mode activated');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        signIn,
        signOut,
        setAdminSession,
        isAdminSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
