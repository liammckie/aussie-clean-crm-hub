
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, UserRole, PermissionType, ROLE_PERMISSIONS } from '../types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Schema for form validation
const userFormSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  role: z.nativeEnum(UserRole),
  status: z.enum(['active', 'inactive', 'pending']),
  phoneNumber: z.string().optional(),
  position: z.string().optional(),
  department: z.string().optional(),
  // Custom permissions will be handled separately
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormValues & { permissions: PermissionType[] }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  user,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const isEditing = !!user;
  const [permissions, setPermissions] = useState<PermissionType[]>(
    user?.permissions || []
  );
  const [activeTab, setActiveTab] = useState('basic');

  // Initialize form with default values
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      role: user?.role || UserRole.STAFF,
      status: user?.status || 'active',
      phoneNumber: user?.phoneNumber || '',
      position: user?.position || '',
      department: user?.department || '',
    },
  });

  // Role options for dropdown
  const roleOptions = Object.values(UserRole).map((role) => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1),
  }));

  // Status options for dropdown
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
  ];

  // Handle role change to update permissions
  const handleRoleChange = (value: UserRole) => {
    if (window.confirm('Changing role will reset custom permissions. Continue?')) {
      setPermissions(ROLE_PERMISSIONS[value]);
    }
  };

  // Toggle a permission
  const togglePermission = (permission: PermissionType) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter((p) => p !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };

  // Group permissions by category for UI organization
  const permissionGroups = [
    {
      name: 'Client Management',
      permissions: [
        PermissionType.VIEW_CLIENTS,
        PermissionType.EDIT_CLIENTS,
        PermissionType.CREATE_CLIENTS,
        PermissionType.DELETE_CLIENTS,
      ],
    },
    {
      name: 'Contract Management',
      permissions: [
        PermissionType.VIEW_CONTRACTS,
        PermissionType.EDIT_CONTRACTS,
        PermissionType.CREATE_CONTRACTS,
        PermissionType.DELETE_CONTRACTS,
        PermissionType.APPROVE_CONTRACTS,
      ],
    },
    {
      name: 'Work Orders',
      permissions: [
        PermissionType.VIEW_WORK_ORDERS,
        PermissionType.EDIT_WORK_ORDERS,
        PermissionType.CREATE_WORK_ORDERS,
        PermissionType.DELETE_WORK_ORDERS,
        PermissionType.ASSIGN_WORK_ORDERS,
      ],
    },
    {
      name: 'Financial',
      permissions: [
        PermissionType.VIEW_FINANCES,
        PermissionType.MANAGE_FINANCES,
        PermissionType.VIEW_INVOICES,
        PermissionType.CREATE_INVOICES,
        PermissionType.APPROVE_INVOICES,
      ],
    },
    {
      name: 'User Management',
      permissions: [
        PermissionType.VIEW_USERS,
        PermissionType.EDIT_USERS,
        PermissionType.CREATE_USERS,
        PermissionType.DELETE_USERS,
        PermissionType.ASSIGN_ROLES,
      ],
    },
    {
      name: 'System',
      permissions: [
        PermissionType.MANAGE_SETTINGS,
        PermissionType.AUDIT_LOGS,
      ],
    },
  ];

  // Format permission for display
  const formatPermission = (permission: string): string => {
    return permission
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Submit handler
  const onFormSubmit = (data: UserFormValues) => {
    onSubmit({
      ...data,
      permissions,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit User' : 'Create New User'}</CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Update user details and permissions' 
            : 'Fill in the information to create a new user'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)}>
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="+61 2 1234 5678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Manager" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Operations" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            handleRoleChange(value as UserRole);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {roleOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The role determines the default permissions.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Controls whether the user can access the system.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="permissions">
                <div className="space-y-6">
                  {permissionGroups.map((group) => (
                    <div key={group.name} className="border border-border/40 rounded-md p-4">
                      <h3 className="text-lg font-medium mb-3">{group.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2">
                        {group.permissions.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission}
                              checked={permissions.includes(permission)}
                              onCheckedChange={() => togglePermission(permission)}
                            />
                            <label
                              htmlFor={permission}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {formatPermission(permission)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
};
