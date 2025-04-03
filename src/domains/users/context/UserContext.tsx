
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, PermissionType } from '../types';
import { userService } from '../api';
import { ErrorReporting } from '@/utils/errorReporting';

interface UserContextType {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  error: string | null;
  hasPermission: (permission: PermissionType) => boolean;
  fetchUsers: () => Promise<void>;
  getUserById: (id: string) => Promise<User | null>;
  setCurrentUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to fetch users';
      setError(errorMessage);
      ErrorReporting.captureException(err as Error, { context: 'UserContext.fetchUsers' });
    } finally {
      setLoading(false);
    }
  };

  const getUserById = async (id: string): Promise<User | null> => {
    try {
      return await userService.getUserById(id);
    } catch (err) {
      ErrorReporting.captureException(err as Error, { 
        context: 'UserContext.getUserById', 
        userId: id 
      });
      return null;
    }
  };

  const hasPermission = (permission: PermissionType): boolean => {
    if (!currentUser) return false;
    return userService.hasPermission(currentUser, permission);
  };

  // Initial data loading
  useEffect(() => {
    fetchUsers().catch(err => {
      ErrorReporting.captureException(err, { context: 'UserContext.initialLoad' });
    });
  }, []);

  const value = {
    currentUser,
    users,
    loading,
    error,
    hasPermission,
    fetchUsers,
    getUserById,
    setCurrentUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

/**
 * Custom hook to check if current user has a specific permission
 */
export const usePermission = (permission: PermissionType): boolean => {
  const { hasPermission } = useUser();
  return hasPermission(permission);
};

/**
 * HOC to protect components that require specific permissions
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: PermissionType
) {
  return function PermissionProtectedComponent(props: P) {
    const { hasPermission } = useUser();
    
    if (!hasPermission(requiredPermission)) {
      return (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-md">
          <h3 className="text-lg font-medium text-red-500">Access Denied</h3>
          <p className="text-gray-300">You don't have permission to access this feature.</p>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
}
