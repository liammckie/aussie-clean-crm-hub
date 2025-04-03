
# Permissions System

## Overview
The permissions system in the Aussie Clean ERP provides granular access control to features and functionalities. It combines role-based access control with individual permission assignments to create a flexible and powerful authorization system.

## Core Concepts

### Roles
Roles represent common sets of responsibilities within the organization. Each role comes with a predefined set of permissions:

| Role | Description | Default Access |
|------|-------------|----------------|
| Admin | System administrators with full access | All system features |
| Manager | Management users with broad access | Client, contract, work order, invoice management and user editing |
| Supervisor | Team leaders with operational focus | Client viewing, work order management, basic reporting |
| Staff | Regular employees | Client viewing, work order viewing and editing |
| Client | External client users | Their own contracts, work orders, and invoices |
| Supplier | External supplier users | Work orders assigned to them |

### Permissions
Permissions are fine-grained controls that allow or restrict access to specific actions or features within the application. They are grouped into functional categories:

#### Client Management
- `VIEW_CLIENTS`: View client information
- `EDIT_CLIENTS`: Edit client information
- `CREATE_CLIENTS`: Create new clients
- `DELETE_CLIENTS`: Delete clients

#### Contract Management
- `VIEW_CONTRACTS`: View contract information
- `EDIT_CONTRACTS`: Edit contract information
- `CREATE_CONTRACTS`: Create new contracts
- `DELETE_CONTRACTS`: Delete contracts
- `APPROVE_CONTRACTS`: Approve or authorize contracts

#### Work Order Management
- `VIEW_WORK_ORDERS`: View work orders
- `EDIT_WORK_ORDERS`: Edit work orders
- `CREATE_WORK_ORDERS`: Create new work orders
- `DELETE_WORK_ORDERS`: Delete work orders
- `ASSIGN_WORK_ORDERS`: Assign work orders to staff

#### Financial Management
- `VIEW_FINANCES`: View financial information and reports
- `MANAGE_FINANCES`: Update and manage financial data
- `VIEW_INVOICES`: View invoice information
- `CREATE_INVOICES`: Create new invoices
- `APPROVE_INVOICES`: Approve invoices for payment

#### User Management
- `VIEW_USERS`: View user information
- `EDIT_USERS`: Edit user information
- `CREATE_USERS`: Create new users
- `DELETE_USERS`: Delete users
- `ASSIGN_ROLES`: Assign roles to users

#### System Management
- `MANAGE_SETTINGS`: Manage system settings
- `AUDIT_LOGS`: View system audit logs

### Role-Permission Default Mappings
By default, each role is assigned a set of permissions, which serves as a starting point for user authorization:

**Admin**
- All permissions

**Manager**
- Client CRUD
- Contract CRUD and approval
- Work order CRUD and assignment
- Finance and invoice viewing
- User viewing and editing

**Supervisor**
- Client viewing
- Contract viewing
- Work order CRUD and assignment
- Invoice viewing

**Staff**
- Client viewing
- Work order viewing and editing

**Client**
- Contract viewing (own)
- Work order viewing (own)
- Invoice viewing (own)

**Supplier**
- Work order viewing (assigned)

## Technical Implementation

### Permission Storage
Permissions are stored as string constants defined in the `PermissionType` enum in `src/domains/users/types.ts`. User objects store the list of permissions associated with their account.

### Permission Checking
Permission checks are performed at several levels:

1. **API Level**: The `UserService` provides a `hasPermission` method that checks if a user has a specific permission.
2. **UI Level**: 
   - The `usePermission` hook checks for a single permission
   - The `usePermissions` hook provides advanced permission checking (all, any, module access)
   - The `withPermission` HOC protects components based on permissions
   - The `withPermissionCheck` HOC protects pages based on permissions

### Custom Permissions
Users can be assigned custom permissions outside of their role's default set:

1. Administrators can modify a user's permissions through the User Form
2. When a role changes, the system offers to reset permissions to the role defaults
3. Custom permissions persist when other user attributes are updated

## Best Practices

### Permission Assignment
- Assign the least privilege needed for a user to perform their job
- Use roles as a starting point, then adjust individual permissions as needed
- Regularly audit user permissions to ensure they remain appropriate

### Permission Checking
- Always check permissions before performing sensitive operations
- Use `hasPermission` for single permission checks
- Use `hasAllPermissions` when multiple permissions are required
- Use `hasAnyPermission` when alternative permissions are acceptable

### UI Integration
- Hide or disable features that users don't have permission to access
- Provide meaningful feedback when permission is denied
- Check permissions early to avoid deep navigation into unavailable features

## Future Enhancements

### Permission Groups
Future versions may introduce permission groups to organize related permissions and simplify assignment.

### Dynamic Permissions
The system may be extended to support dynamic permissions based on business rules or data relationships (e.g., geographical restrictions, client assignments).

### Permission Delegation
Temporary permission delegation to allow users to grant limited access to others for specific tasks or time periods.

### Audit Trails
Enhanced auditing of permission changes to track who modified permissions, when, and why.

## Usage Examples

### Checking Permissions in API Functions
```typescript
function approveContract(contractId: string, userId: string) {
  const user = getUserById(userId);
  
  if (!userService.hasPermission(user, PermissionType.APPROVE_CONTRACTS)) {
    throw new Error('Permission denied');
  }
  
  // Proceed with contract approval
}
```

### UI Permission Checks
```tsx
import { usePermission } from '@/domains/users/context/UserContext';
import { PermissionType } from '@/domains/users/types';

function ContractActions({ contract }) {
  const canEdit = usePermission(PermissionType.EDIT_CONTRACTS);
  const canApprove = usePermission(PermissionType.APPROVE_CONTRACTS);
  
  return (
    <div className="actions">
      {canEdit && <button>Edit Contract</button>}
      {canApprove && <button>Approve Contract</button>}
    </div>
  );
}
```

### Advanced Permission Logic
```tsx
import { usePermissions } from '@/hooks/use-permissions';
import { PermissionType } from '@/domains/users/types';

function FinancialReporting() {
  const { hasAllPermissions, hasAnyPermission } = usePermissions();
  
  // User needs both permissions to access detailed reports
  const canAccessDetailedReports = hasAllPermissions([
    PermissionType.VIEW_FINANCES,
    PermissionType.VIEW_INVOICES
  ]);
  
  // User needs any of these permissions to access summary reports
  const canAccessSummaryReports = hasAnyPermission([
    PermissionType.VIEW_FINANCES,
    PermissionType.VIEW_INVOICES,
    PermissionType.MANAGE_FINANCES
  ]);
  
  return (
    <div>
      {canAccessSummaryReports && (
        <SummaryReports />
      )}
      
      {canAccessDetailedReports && (
        <DetailedReports />
      )}
    </div>
  );
}
```
