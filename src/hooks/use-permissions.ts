
import { useEffect, useState } from 'react';
import { User, PermissionType } from '@/domains/users/types';
import { useUser } from '@/domains/users/context/UserContext';
import { ErrorReporting } from '@/utils/errorReporting';

/**
 * Hook to check if a user has certain permissions
 */
export function usePermissions() {
  const { currentUser, hasPermission } = useUser();
  
  /**
   * Check if the user has all of the given permissions
   */
  const hasAllPermissions = (permissions: PermissionType[]): boolean => {
    if (!currentUser) return false;
    return permissions.every(permission => hasPermission(permission));
  };
  
  /**
   * Check if the user has any of the given permissions
   */
  const hasAnyPermission = (permissions: PermissionType[]): boolean => {
    if (!currentUser) return false;
    return permissions.some(permission => hasPermission(permission));
  };
  
  /**
   * Check if current user has access to a specific module 
   */
  const canAccessModule = (moduleName: string): boolean => {
    if (!currentUser) return false;
    
    // Map modules to required permissions
    const modulePermissions: Record<string, PermissionType[]> = {
      clients: [PermissionType.VIEW_CLIENTS],
      contracts: [PermissionType.VIEW_CONTRACTS],
      workOrders: [PermissionType.VIEW_WORK_ORDERS],
      finance: [PermissionType.VIEW_FINANCES, PermissionType.VIEW_INVOICES],
      users: [PermissionType.VIEW_USERS],
      settings: [PermissionType.MANAGE_SETTINGS],
      sales: [PermissionType.VIEW_CLIENTS],
      activities: [PermissionType.VIEW_WORK_ORDERS, PermissionType.VIEW_CLIENTS],
      forms: [], // Everyone can access forms
      suppliers: [PermissionType.VIEW_WORK_ORDERS],
      logs: [PermissionType.AUDIT_LOGS],
    };
    
    // If module is not in the map or is empty, default to true (accessible)
    if (!modulePermissions[moduleName] || modulePermissions[moduleName].length === 0) {
      return true;
    }
    
    // Check if user has any of the required permissions for the module
    return hasAnyPermission(modulePermissions[moduleName]);
  };
  
  return {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    canAccessModule,
    currentUser,
  };
}

/**
 * HOC to restrict access to pages based on permissions
 */
export function withPermissionCheck<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions: PermissionType[],
  checkAll: boolean = false
) {
  return function PermissionCheckedComponent(props: P) {
    const { hasAllPermissions, hasAnyPermission } = usePermissions();
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);
    
    useEffect(() => {
      // Check if user has required permissions
      const access = checkAll 
        ? hasAllPermissions(requiredPermissions)
        : hasAnyPermission(requiredPermissions);
      
      setHasAccess(access);
      
      // Log access denied for debugging
      if (!access) {
        ErrorReporting.captureMessage(
          'Permission denied for component', 
          { 
            component: Component.displayName || Component.name,
            requiredPermissions,
            checkType: checkAll ? 'all' : 'any' 
          },
          'warning'
        );
      }
    }, [requiredPermissions, checkAll]);
    
    // While checking, return nothing
    if (hasAccess === null) {
      return null;
    }
    
    // If no access, return denial message
    if (!hasAccess) {
      return (
        <div className="p-6 bg-red-950/10 border border-red-500/30 rounded-md text-center">
          <h3 className="text-xl font-semibold text-red-500">Access Denied</h3>
          <p className="text-slate-300 mt-2">
            You don't have the required permissions to access this page.
          </p>
        </div>
      );
    }
    
    // If has access, render component
    return <Component {...props} />;
  };
}
