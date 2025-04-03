
# User Management Module

## Overview
The User Management module provides comprehensive functionality for managing users within the Aussie Clean ERP system. It includes user creation, role and permission management, and a flexible permission system that allows for granular access control.

## Key Components

### Data Model
- **User**: Core entity representing a user in the system
- **Role**: Pre-defined roles (Admin, Manager, Supervisor, Staff, Client, Supplier)
- **Permission**: Granular permissions that control access to specific features

### Permission System
The permission system is built on two layers:
1. **Role-based permissions**: Default sets of permissions assigned based on user role
2. **Custom permissions**: Individual permissions that can be assigned to users regardless of role

### Core Features
- User CRUD operations (Create, Read, Update, Delete)
- Role assignment
- Custom permission management
- Activity tracking and audit logging

## Module Structure

### Domain Types
Located in `src/domains/users/types.ts`:
- `UserRole` enum: Defines available user roles
- `PermissionType` enum: Defines all available permissions
- `User` interface: Represents a user entity
- `ROLE_PERMISSIONS`: Maps roles to their default permissions

### API Layer
Located in `src/domains/users/api.ts`:
- `UserService` class: Provides methods for user management
  - `getUsers()`: Fetch all users
  - `getUserById()`: Fetch a specific user
  - `createUser()`: Create a new user
  - `updateUser()`: Update an existing user
  - `deleteUser()`: Delete a user
  - `hasPermission()`: Check if a user has a specific permission

### Context & Hooks
Located in `src/domains/users/context/UserContext.tsx` and `src/hooks/use-permissions.ts`:
- `UserProvider`: React context provider for user data
- `useUser()`: Hook to access user context
- `usePermission()`: Hook to check single permission
- `usePermissions()`: Hook with advanced permission checking
- `withPermission()`: HOC to protect components based on permissions
- `withPermissionCheck()`: HOC to protect pages based on permissions

### UI Components
- `UsersTable`: Display users in a table with sorting and actions
- `UserForm`: Form for creating and editing users
- `DeleteUserDialog`: Confirmation dialog for user deletion

### Pages
- `UsersManagement`: Main page for managing users
- `UserDetails`: Page for viewing detailed user information

## Integration Points

### Authentication System
The User Management module is designed to work with any authentication system. Currently, it uses a mock authentication system that will be replaced with a real authentication system in the future.

### Application Modules
The permission system controls access to various modules and features throughout the application:
- Client Management
- Contract Management
- Work Orders
- Financial Management
- System Settings

## Implementation Notes

### Current Limitations
- Uses mock data storage instead of a database
- Does not include password management (will be added with real authentication)
- Activity tracking is not yet implemented

### Future Enhancements
- Integration with real authentication system
- User activity tracking and audit logging
- Advanced filtering and search functionality
- User bulk operations (import/export, bulk delete, etc.)
- Self-service user profile management

## Usage Examples

### Checking Permissions in Components
```tsx
import { usePermission } from '@/domains/users/context/UserContext';
import { PermissionType } from '@/domains/users/types';

function MyComponent() {
  const canEditClients = usePermission(PermissionType.EDIT_CLIENTS);
  
  return (
    <div>
      {canEditClients && <button>Edit Client</button>}
    </div>
  );
}
```

### Protecting a Component with Permissions
```tsx
import { withPermission } from '@/domains/users/context/UserContext';
import { PermissionType } from '@/domains/users/types';

function SensitiveComponent() {
  return <div>Sensitive content</div>;
}

export default withPermission(SensitiveComponent, PermissionType.MANAGE_SETTINGS);
```

### Advanced Permission Checking
```tsx
import { usePermissions } from '@/hooks/use-permissions';
import { PermissionType } from '@/domains/users/types';

function AdvancedComponent() {
  const { hasAllPermissions, hasAnyPermission } = usePermissions();
  
  const canApprove = hasAllPermissions([
    PermissionType.VIEW_CONTRACTS,
    PermissionType.APPROVE_CONTRACTS
  ]);
  
  const canViewReports = hasAnyPermission([
    PermissionType.VIEW_FINANCES,
    PermissionType.AUDIT_LOGS
  ]);
  
  return (
    <div>
      {canApprove && <button>Approve Contract</button>}
      {canViewReports && <button>View Reports</button>}
    </div>
  );
}
```
