
# User Management Integration Points

## Overview
The User Management module serves as a core component of the Aussie Clean ERP system, integrating with multiple other modules to provide authentication, authorization, and personalization services. This document outlines the key integration points and how other modules can leverage the User Management functionality.

## Authentication Integration

### Current Implementation
The current implementation uses a simplified mock authentication system that will be replaced with a proper authentication provider in the future. The integration points have been designed to make this transition smooth.

### Future Authentication Integration
The User Management module is designed to work with various authentication providers, such as:

- Firebase Authentication
- Auth0
- Supabase Auth
- Custom JWT-based authentication

When implementing a real authentication system, the following integration points will be used:

- `App.tsx`: Update the `login` and `logout` functions to use the authentication provider
- `UserProvider`: Enhance to fetch and store the current user based on authentication state
- `LoginForm`: Update to use the authentication provider's login flow

## Authorization Integration

### Permission System
The User Management module provides a comprehensive permission system that other modules can use to control access to features and functionality. 

#### Key Integration Points:

1. **Component-Level Protection**
   ```tsx
   import { usePermission } from '@/domains/users/context/UserContext';
   import { PermissionType } from '@/domains/users/types';

   function SensitiveComponent() {
     const hasPermission = usePermission(PermissionType.EDIT_CLIENTS);
     
     if (!hasPermission) {
       return <AccessDenied />;
     }
     
     return <ActualComponent />;
   }
   ```

2. **HOC for Component Protection**
   ```tsx
   import { withPermission } from '@/domains/users/context/UserContext';
   import { PermissionType } from '@/domains/users/types';

   function SensitiveComponent() {
     return <div>Protected content</div>;
   }

   export default withPermission(SensitiveComponent, PermissionType.MANAGE_SETTINGS);
   ```

3. **Route-Level Protection**
   ```tsx
   import { withPermissionCheck } from '@/hooks/use-permissions';
   import { PermissionType } from '@/domains/users/types';

   const ProtectedPage = withPermissionCheck(
     MyPageComponent, 
     [PermissionType.VIEW_FINANCES]
   );
   ```

4. **Advanced Permission Checks**
   ```tsx
   import { usePermissions } from '@/hooks/use-permissions';
   import { PermissionType } from '@/domains/users/types';

   function ComplexComponent() {
     const { hasAllPermissions, hasAnyPermission } = usePermissions();
     
     const canEditAndApprove = hasAllPermissions([
       PermissionType.EDIT_CONTRACTS,
       PermissionType.APPROVE_CONTRACTS
     ]);
     
     const canViewReports = hasAnyPermission([
       PermissionType.VIEW_FINANCES,
       PermissionType.AUDIT_LOGS
     ]);
     
     // Component logic using these permissions
   }
   ```

5. **Module Access Control**
   ```tsx
   import { usePermissions } from '@/hooks/use-permissions';

   function NavMenu() {
     const { canAccessModule } = usePermissions();
     
     return (
       <nav>
         {canAccessModule('finance') && (
           <NavLink to="/finance">Finance</NavLink>
         )}
         {canAccessModule('users') && (
           <NavLink to="/users">Users</NavLink>
         )}
       </nav>
     );
   }
   ```

### Extending Permissions
To add new permissions for custom modules:

1. Add new permission types to the `PermissionType` enum in `src/domains/users/types.ts`
2. Update `ROLE_PERMISSIONS` to assign these permissions to appropriate roles
3. Update module access mapping in the `canAccessModule` function in `src/hooks/use-permissions.ts`

## User Information Integration

### Current User Context
The User Management module provides access to the current user's information through the UserContext.

#### Integration Points:

1. **Accessing Current User**
   ```tsx
   import { useUser } from '@/domains/users/context/UserContext';

   function ProfileComponent() {
     const { currentUser } = useUser();
     
     if (!currentUser) {
       return <Loading />;
     }
     
     return (
       <div>
         <h1>Welcome, {currentUser.firstName} {currentUser.lastName}</h1>
         <p>Email: {currentUser.email}</p>
       </div>
     );
   }
   ```

2. **Setting Current User**
   ```tsx
   import { useUser } from '@/domains/users/context/UserContext';
   import { userService } from '@/domains/users/api';

   function LoginComponent() {
     const { setCurrentUser } = useUser();
     
     const handleLogin = async (credentials) => {
       // Authenticate user
       const userId = await authenticateUser(credentials);
       
       // Set current user
       const user = await userService.getUserById(userId);
       setCurrentUser(user);
     };
     
     // Component logic
   }
   ```

## API Integration

### User Service
The UserService provides methods for managing users that can be used by other modules.

#### Key Methods:

1. **getUsers()**: Fetch all users
2. **getUserById(id)**: Fetch a specific user
3. **createUser(userData)**: Create a new user
4. **updateUser(id, userData)**: Update an existing user
5. **deleteUser(id)**: Delete a user
6. **hasPermission(user, permission)**: Check if a user has a specific permission

#### Example Usage:
```tsx
import { userService } from '@/domains/users/api';

async function assignWorkOrder(workOrderId, assigneeId) {
  // Get the assignee
  const assignee = await userService.getUserById(assigneeId);
  
  // Check if assignee exists and is active
  if (!assignee || assignee.status !== 'active') {
    throw new Error('Invalid assignee');
  }
  
  // Check if assignee has permission to handle work orders
  if (!userService.hasPermission(assignee, PermissionType.VIEW_WORK_ORDERS)) {
    throw new Error('Assignee does not have work order permissions');
  }
  
  // Proceed with assignment
  return await workOrderService.assignWorkOrder(workOrderId, assigneeId);
}
```

## Module-Specific Integrations

### Client Management
- User-Client relationship tracking
- Client portal user management
- Client contact permissions

### Work Order Management
- Work order assignment based on user roles and permissions
- Task visibility filtering based on user permissions
- Work reporting access control

### Financial Management
- Invoice approval workflows based on user permissions
- Financial report access control
- Payment authorization levels

### Audit and Reporting
- User activity tracking
- Permission change auditing
- User-based filtering of reports

## Error Reporting Integration

### Sentry Integration
The User Management module integrates with Sentry for error reporting, providing user context for better error tracking.

```tsx
import { ErrorReporting } from '@/utils/errorReporting';
import { useUser } from '@/domains/users/context/UserContext';

function ComponentWithErrorReporting() {
  const { currentUser } = useUser();
  
  useEffect(() => {
    if (currentUser) {
      // Set user context for error reporting
      ErrorReporting.setUser({
        id: currentUser.id,
        email: currentUser.email,
        username: `${currentUser.firstName} ${currentUser.lastName}`,
      });
    }
    
    return () => {
      // Clear user context when component unmounts
      ErrorReporting.setUser(null);
    };
  }, [currentUser]);
  
  // Component logic
}
```

## Future Integration Points

### Multi-tenant Support
- Tenant-specific user management
- Cross-tenant permission handling
- Tenant isolation enforcement

### External Identity Provider Integration
- OAuth provider connections
- SAML integration
- Enterprise SSO support

### Advanced User Management
- User provisioning API
- Bulk user operations
- User import/export functionality

### Analytics Integration
- User behavior tracking
- Feature usage analytics
- Permission utilization reporting
