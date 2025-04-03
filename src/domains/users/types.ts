
/**
 * User management domain types
 */

/**
 * Represents a user's role in the system
 */
export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  SUPERVISOR = "supervisor",
  STAFF = "staff",
  CLIENT = "client",
  SUPPLIER = "supplier",
}

/**
 * Base permission types available in the system
 */
export enum PermissionType {
  // Client related permissions
  VIEW_CLIENTS = "view_clients",
  EDIT_CLIENTS = "edit_clients",
  CREATE_CLIENTS = "create_clients",
  DELETE_CLIENTS = "delete_clients",
  
  // Contract related permissions
  VIEW_CONTRACTS = "view_contracts",
  EDIT_CONTRACTS = "edit_contracts",
  CREATE_CONTRACTS = "create_contracts",
  DELETE_CONTRACTS = "delete_contracts",
  APPROVE_CONTRACTS = "approve_contracts",
  
  // Work order related permissions
  VIEW_WORK_ORDERS = "view_work_orders",
  EDIT_WORK_ORDERS = "edit_work_orders",
  CREATE_WORK_ORDERS = "create_work_orders",
  DELETE_WORK_ORDERS = "delete_work_orders",
  ASSIGN_WORK_ORDERS = "assign_work_orders",
  
  // Financial related permissions
  VIEW_FINANCES = "view_finances",
  MANAGE_FINANCES = "manage_finances",
  VIEW_INVOICES = "view_invoices",
  CREATE_INVOICES = "create_invoices",
  APPROVE_INVOICES = "approve_invoices",
  
  // User management related permissions
  VIEW_USERS = "view_users",
  EDIT_USERS = "edit_users",
  CREATE_USERS = "create_users",
  DELETE_USERS = "delete_users",
  ASSIGN_ROLES = "assign_roles",
  
  // System related permissions
  MANAGE_SETTINGS = "manage_settings",
  AUDIT_LOGS = "audit_logs",
}

/**
 * User interface representing a user in the system
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: PermissionType[];
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  phoneNumber?: string;
  position?: string;
  department?: string;
  profileImageUrl?: string;
}

/**
 * Interface for creating a new user
 */
export interface CreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions?: PermissionType[];
  status?: 'active' | 'inactive' | 'pending';
  phoneNumber?: string;
  position?: string;
  department?: string;
}

/**
 * Interface for updating an existing user
 */
export interface UpdateUserInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  permissions?: PermissionType[];
  status?: 'active' | 'inactive' | 'pending';
  phoneNumber?: string;
  position?: string;
  department?: string;
}

/**
 * Maps roles to their default permissions
 */
export const ROLE_PERMISSIONS: Record<UserRole, PermissionType[]> = {
  [UserRole.ADMIN]: Object.values(PermissionType),
  [UserRole.MANAGER]: [
    PermissionType.VIEW_CLIENTS, PermissionType.EDIT_CLIENTS, PermissionType.CREATE_CLIENTS,
    PermissionType.VIEW_CONTRACTS, PermissionType.EDIT_CONTRACTS, PermissionType.CREATE_CONTRACTS, PermissionType.APPROVE_CONTRACTS,
    PermissionType.VIEW_WORK_ORDERS, PermissionType.EDIT_WORK_ORDERS, PermissionType.CREATE_WORK_ORDERS, PermissionType.ASSIGN_WORK_ORDERS,
    PermissionType.VIEW_FINANCES, PermissionType.VIEW_INVOICES, PermissionType.CREATE_INVOICES,
    PermissionType.VIEW_USERS, PermissionType.EDIT_USERS,
  ],
  [UserRole.SUPERVISOR]: [
    PermissionType.VIEW_CLIENTS,
    PermissionType.VIEW_CONTRACTS,
    PermissionType.VIEW_WORK_ORDERS, PermissionType.EDIT_WORK_ORDERS, PermissionType.CREATE_WORK_ORDERS, PermissionType.ASSIGN_WORK_ORDERS,
    PermissionType.VIEW_INVOICES,
  ],
  [UserRole.STAFF]: [
    PermissionType.VIEW_CLIENTS,
    PermissionType.VIEW_WORK_ORDERS, PermissionType.EDIT_WORK_ORDERS,
  ],
  [UserRole.CLIENT]: [
    PermissionType.VIEW_CONTRACTS,
    PermissionType.VIEW_WORK_ORDERS,
    PermissionType.VIEW_INVOICES,
  ],
  [UserRole.SUPPLIER]: [
    PermissionType.VIEW_WORK_ORDERS,
  ],
};
