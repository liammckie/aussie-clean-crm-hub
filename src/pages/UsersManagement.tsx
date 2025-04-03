
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  User, 
  PermissionType, 
  CreateUserInput, 
  UpdateUserInput 
} from '@/domains/users/types';
import { userService } from '@/domains/users/api';
import { useUser } from '@/domains/users/context/UserContext';
import { UsersTable } from '@/domains/users/components/UsersTable';
import { UserForm } from '@/domains/users/components/UserForm';
import { DeleteUserDialog } from '@/domains/users/components/DeleteUserDialog';
import { withSentryRouting } from '@/components/error/SentryRouteError';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Users as UsersIcon,
  Filter, 
  RefreshCw 
} from 'lucide-react';

const UsersManagement = () => {
  const { fetchUsers, hasPermission } = useUser();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all-users');

  const canCreate = hasPermission(PermissionType.CREATE_USERS);

  const handleCreateUser = async (userData: CreateUserInput) => {
    try {
      setIsSubmitting(true);

      await userService.createUser(userData);
      await fetchUsers();
      
      setIsCreating(false);
      toast({
        title: 'User created',
        description: `${userData.firstName} ${userData.lastName} has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error creating user',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (userId: string, userData: UpdateUserInput) => {
    try {
      setIsSubmitting(true);

      await userService.updateUser(userId, userData);
      await fetchUsers();
      
      setUserToEdit(null);
      toast({
        title: 'User updated',
        description: `${userData.firstName} ${userData.lastName} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error updating user',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsDeleting(true);

      await userService.deleteUser(userToDelete.id);
      await fetchUsers();
      
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      toast({
        title: 'User deleted',
        description: `${userToDelete.firstName} ${userToDelete.lastName} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error deleting user',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewUser = (user: User) => {
    navigate(`/users/${user.id}`);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-slate-400">Create and manage system users and their permissions</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchUsers()}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          {canCreate && (
            <Button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              New User
            </Button>
          )}
        </div>
      </div>

      {(isCreating || userToEdit) ? (
        <div className="mb-6">
          <UserForm
            user={userToEdit || undefined}
            onSubmit={(data) => {
              if (userToEdit) {
                handleUpdateUser(userToEdit.id, data);
              } else {
                handleCreateUser(data);
              }
            }}
            onCancel={() => {
              setIsCreating(false);
              setUserToEdit(null);
            }}
            isSubmitting={isSubmitting}
          />
        </div>
      ) : (
        <Tabs defaultValue="all-users" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="all-users" className="flex items-center gap-1">
                <UsersIcon className="h-4 w-4" />
                All Users
              </TabsTrigger>
              {/* Additional tabs can be added here for filtered views */}
            </TabsList>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <TabsContent value="all-users" className="mt-4">
            <UsersTable
              onEdit={setUserToEdit}
              onDelete={(user) => {
                setUserToDelete(user);
                setDeleteDialogOpen(true);
              }}
              onView={handleViewUser}
            />
          </TabsContent>
        </Tabs>
      )}

      <DeleteUserDialog
        user={userToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteUser}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default withSentryRouting(UsersManagement);
