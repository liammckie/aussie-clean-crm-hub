
import { User, CreateUserInput, UpdateUserInput, UserRole, PermissionType, ROLE_PERMISSIONS } from './types';
import { ErrorReporting } from '@/utils/errorReporting';

// Mock user database for development - would be replaced with actual DB connection
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@scserp.com.au',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    permissions: ROLE_PERMISSIONS[UserRole.ADMIN],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    position: 'System Administrator',
    department: 'IT',
  },
  {
    id: '2',
    email: 'manager@scserp.com.au',
    firstName: 'Manager',
    lastName: 'User',
    role: UserRole.MANAGER,
    permissions: ROLE_PERMISSIONS[UserRole.MANAGER],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    position: 'Operations Manager',
    department: 'Operations',
  },
  {
    id: '3',
    email: 'staff@scserp.com.au',
    firstName: 'Staff',
    lastName: 'User',
    role: UserRole.STAFF,
    permissions: ROLE_PERMISSIONS[UserRole.STAFF],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: null,
    position: 'Cleaner',
    department: 'Operations',
  }
];

// Helper to generate ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

/**
 * User service containing methods for user management
 */
export class UserService {
  private static instance: UserService;
  private users: User[] = [...MOCK_USERS];

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Get all users in the system
   */
  public async getUsers(): Promise<User[]> {
    try {
      // In a real implementation, this would fetch from a database
      return [...this.users];
    } catch (error) {
      ErrorReporting.captureException(error as Error, { method: 'getUsers' });
      throw new Error('Failed to fetch users');
    }
  }

  /**
   * Get a user by ID
   */
  public async getUserById(id: string): Promise<User | null> {
    try {
      const user = this.users.find(u => u.id === id);
      return user || null;
    } catch (error) {
      ErrorReporting.captureException(error as Error, { method: 'getUserById', userId: id });
      throw new Error(`Failed to fetch user with ID: ${id}`);
    }
  }

  /**
   * Create a new user
   */
  public async createUser(userData: CreateUserInput): Promise<User> {
    try {
      // Check if email already exists
      if (this.users.some(u => u.email === userData.email)) {
        throw new Error('Email already exists');
      }

      const now = new Date().toISOString();
      
      // Use role-based permissions as default, or custom permissions if provided
      const permissions = userData.permissions || ROLE_PERMISSIONS[userData.role];
      
      const newUser: User = {
        id: generateId(),
        ...userData,
        permissions,
        status: userData.status || 'active',
        createdAt: now,
        updatedAt: now,
        lastLogin: null,
      };
      
      this.users.push(newUser);
      return newUser;
    } catch (error) {
      ErrorReporting.captureException(error as Error, { method: 'createUser', userData });
      throw error;
    }
  }

  /**
   * Update an existing user
   */
  public async updateUser(id: string, userData: UpdateUserInput): Promise<User> {
    try {
      const userIndex = this.users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      // Check if trying to update email to one that already exists
      if (userData.email && 
          userData.email !== this.users[userIndex].email && 
          this.users.some(u => u.email === userData.email)) {
        throw new Error('Email already exists');
      }
      
      // Update permissions if role changes and custom permissions are not provided
      let permissions = this.users[userIndex].permissions;
      if (userData.role && !userData.permissions) {
        permissions = ROLE_PERMISSIONS[userData.role];
      } else if (userData.permissions) {
        permissions = userData.permissions;
      }
      
      const updatedUser: User = {
        ...this.users[userIndex],
        ...userData,
        permissions,
        updatedAt: new Date().toISOString(),
      };
      
      this.users[userIndex] = updatedUser;
      return updatedUser;
    } catch (error) {
      ErrorReporting.captureException(error as Error, { method: 'updateUser', userId: id, userData });
      throw error;
    }
  }

  /**
   * Delete a user
   */
  public async deleteUser(id: string): Promise<boolean> {
    try {
      const userIndex = this.users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        throw new Error(`User with ID ${id} not found`);
      }
      
      this.users.splice(userIndex, 1);
      return true;
    } catch (error) {
      ErrorReporting.captureException(error as Error, { method: 'deleteUser', userId: id });
      throw error;
    }
  }

  /**
   * Check if a user has specific permission
   */
  public hasPermission(user: User, permission: PermissionType): boolean {
    return user.permissions.includes(permission);
  }

  /**
   * Resets the data for testing purposes
   */
  public resetData(): void {
    this.users = [...MOCK_USERS];
  }
}

// Export a singleton instance
export const userService = UserService.getInstance();
