
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { ErrorReporting } from '@/utils/errorReporting';
import { toast } from 'sonner';
import { AppLogger, LogCategory } from '@/utils/logging';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setAdminSession: () => void; // Explicitly include admin session method
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
        setIsAuthenticated(!!data.session?.user);
        
        AppLogger.info(LogCategory.AUTH, 'Auth state initialized:', { 
          isAuthenticated: !!data.session?.user,
        });
        
        // Clean up subscription when component unmounts
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        AppLogger.error(LogCategory.AUTH, 'Error retrieving session', { error });
        ErrorReporting.captureException(error as Error);
        setIsAuthenticated(false);
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
      setIsAuthenticated(false);
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

  // Development mode function to bypass authentication
  const setAdminSession = () => {
    // Create a mock admin user for development with all required properties
    const mockAdminUser = {
      id: 'dev-admin-user',
      email: 'admin@example.com',
      app_metadata: {}, // Required property
      user_metadata: {
        name: 'Developer Admin',
        role: 'admin'
      },
      aud: 'authenticated', // Required property
      created_at: new Date().toISOString(), // Required property
      role: '',
      updated_at: new Date().toISOString(),
    } as User;
    
    AppLogger.info(LogCategory.AUTH, 'Setting admin development session');
    setUser(mockAdminUser);
    setIsAuthenticated(true);
    
    // Set user info in error reporting
    ErrorReporting.setUser({
      id: mockAdminUser.id,
      email: mockAdminUser.email,
      username: mockAdminUser.user_metadata?.name
    });
    
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
        setAdminSession, // Explicitly include the admin session method in the context
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
