
# User Management Module

## Overview
The User Management module provides functionality for managing users, roles, and permissions within the Aussie Clean ERP system. It enables administrative users to create, view, edit, and delete user accounts, as well as manage their access rights through a comprehensive permission system.

## Key Features
- User CRUD operations (Create, Read, Update, Delete)
- Role-based access control
- Granular permission management
- User activity tracking

## Module Architecture

### Core Components
- **User Model**: Defines the user entity and its properties
- **Permission System**: Manages access control through roles and individual permissions
- **User Service**: Provides API for user management operations
- **Activity Tracking**: Records user actions for audit purposes

### Directory Structure
```
src/domains/users/
├── api.ts                 # User service and API functions
├── types.ts               # TypeScript types and interfaces
├── context/               # React context for user state
│   └── UserContext.tsx    # User provider and hooks
├── components/            # UI components
│   ├── UsersTable.tsx     # Table for displaying users
│   ├── UserForm.tsx       # Form for creating/editing users
│   └── DeleteUserDialog.tsx # Confirmation dialog
├── services/              # Business logic services
│   └── ActivityTrackingService.ts # Activity logging
└── hooks/                 # Custom hooks
    └── use-permissions.ts # Permission checking hooks
```

### Documentation
```
src/docs/domains/users/
├── README.md              # Overview documentation
├── PERMISSIONS_SYSTEM.md  # Details on the permission system
├── USER_MANAGEMENT.md     # Detailed module documentation
└── INTEGRATION_POINTS.md  # Integration with other modules
```

## Permission System
The permission system is based on two complementary approaches:

1. **Role-based Access Control (RBAC)**: Predefined roles (Admin, Manager, Supervisor, Staff, Client, Supplier) with default permission sets.
2. **Permission-based Access Control**: Individual permissions can be assigned or revoked regardless of role.

This hybrid approach provides both simplicity and flexibility in managing user access.

## Integration Points
The User Management module integrates with:

- **Authentication System**: Works with the authentication provider for user identity
- **Other Modules**: Provides permission checking for feature access control
- **Error Reporting**: Supplies user context for better error tracking
- **Audit System**: Records user activities for compliance and security

## Usage Examples

### Permission Checking
```tsx
import { usePermission } from '@/domains/users/context/UserContext';
import { PermissionType } from '@/domains/users/types';

function SensitiveComponent() {
  const canEditClients = usePermission(PermissionType.EDIT_CLIENTS);
  
  return (
    <div>
      {canEditClients && <button>Edit Client</button>}
    </div>
  );
}
```

### User Management API
```tsx
import { userService } from '@/domains/users/api';

// Get all users
const users = await userService.getUsers();

// Create a new user
const newUser = await userService.createUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  role: UserRole.MANAGER
});

// Update a user
await userService.updateUser(userId, {
  role: UserRole.ADMIN,
  status: 'active'
});

// Delete a user
await userService.deleteUser(userId);
```

## Limitations and Future Work
- Currently uses mock data rather than database storage
- Activity tracking framework implemented but needs UI visualization
- Password management will be added with real authentication integration
- Advanced filtering and search functionality to be added
