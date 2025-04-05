
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { ErrorReporting } from '@/utils/errorReporting';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setAdminSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Function to set the user state from a session
    const setUserFromSession = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        // Update user and authentication state
        setUser(data.session?.user || null);
        setIsAuthenticated(!!data.session?.user);
        console.log('Auth state initialized:', !!data.session?.user);
        
        // Send user info to error reporting
        if (data.session?.user) {
          ErrorReporting.setUser({
            id: data.session.user.id,
            email: data.session.user.email || undefined,
          });
        } else {
          ErrorReporting.setUser(null);
        }
      } catch (error) {
        console.error('Error retrieving session:', error);
        ErrorReporting.captureException(error as Error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Call the function to set initial state
    setUserFromSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, !!session);
        
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

    // Cleanup subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Log success and important info for debugging
      console.log('Sign in successful:', data.session ? true : false);
      console.log('JWT Token:', data.session?.access_token ? '[token set]' : '[no token]');
      
      setIsAuthenticated(true);
      setUser(data.user);
      toast.success('Logged in successfully');
    } catch (error: any) {
      console.error('Login error:', error);
      ErrorReporting.captureException(error as Error);
      toast.error(`Login failed: ${error.message}`);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      ErrorReporting.captureException(error as Error);
      toast.error('Failed to log out');
    } finally {
      setIsLoading(false);
    }
  };

  // Set admin session for development purposes
  const setAdminSession = () => {
    const timestamp = new Date().toISOString();
    localStorage.setItem('admin_session', JSON.stringify({ timestamp }));
    toast.success('Admin session set');
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
