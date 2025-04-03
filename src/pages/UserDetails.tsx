
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, PermissionType } from '@/domains/users/types';
import { userService } from '@/domains/users/api';
import { useUser } from '@/domains/users/context/UserContext';
import { withSentryRouting } from '@/components/error/SentryRouteError';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { DeleteUserDialog } from '@/domains/users/components/DeleteUserDialog';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  User as UserIcon, 
  Clock, 
  Shield, 
  Mail, 
  Phone, 
  Building, 
  Briefcase,
  Calendar,
  AlertCircle
} from 'lucide-react';

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const canEdit = hasPermission(PermissionType.EDIT_USERS);
  const canDelete = hasPermission(PermissionType.DELETE_USERS);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const userData = await userService.getUserById(id);
        
        if (!userData) {
          setError('User not found');
          return;
        }
        
        setUser(userData);
      } catch (err) {
        setError((err as Error).message || 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [id]);

  const handleDeleteUser = async () => {
    if (!user) return;
    
    try {
      setIsDeleting(true);
      await userService.deleteUser(user.id);
      toast({
        title: 'User deleted',
        description: `${user.firstName} ${user.lastName} has been deleted successfully.`,
      });
      navigate('/users');
    } catch (error) {
      toast({
        title: 'Error deleting user',
        description: (error as Error).message,
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 max-w-5xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto py-10 max-w-5xl">
        <div className="p-8 border border-red-500/30 bg-red-950/20 rounded-md text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
          <h2 className="text-xl font-bold text-red-500">Error</h2>
          <p className="mt-2 text-slate-300">{error || 'User not found'}</p>
          <Button 
            variant="outline"
            onClick={() => navigate('/users')}
            className="mt-4"
          >
            Go Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-500 hover:bg-purple-600';
      case 'manager': return 'bg-blue-500 hover:bg-blue-600';
      case 'supervisor': return 'bg-green-500 hover:bg-green-600';
      case 'staff': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'client': return 'bg-orange-500 hover:bg-orange-600';
      case 'supplier': return 'bg-pink-500 hover:bg-pink-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Group permissions by category
  const groupedPermissions: Record<string, PermissionType[]> = user.permissions.reduce((acc, permission) => {
    const category = permission.split('_')[0].toLowerCase();
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {} as Record<string, PermissionType[]>);

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/users')}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
        
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button
              variant="outline"
              onClick={() => navigate(`/users/${user.id}/edit`)}
              className="flex items-center gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit User
            </Button>
          )}
          
          {canDelete && (
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Delete User
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2">
                <UserIcon className="h-12 w-12 text-slate-400" />
              </div>
              <CardTitle>
                {user.firstName} {user.lastName}
              </CardTitle>
              <div className="flex flex-col items-center gap-2 mt-2">
                <Badge variant="secondary" className={getRoleBadgeColor(user.role)}>
                  {user.role}
                </Badge>
                <Badge variant="outline" className={getStatusBadgeColor(user.status)}>
                  {user.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-sm">{user.phoneNumber}</span>
                  </div>
                )}
                {user.position && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    <span className="text-sm">{user.position}</span>
                  </div>
                )}
                {user.department && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-slate-400" />
                    <span className="text-sm">{user.department}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <div>
                    <span className="text-xs text-slate-400">Created</span>
                    <p className="text-sm">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <div>
                    <span className="text-xs text-slate-400">Last Login</span>
                    <p className="text-sm">{formatDate(user.lastLogin)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="permissions">
            <TabsList>
              <TabsTrigger value="permissions" className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Permissions
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Activity
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="permissions" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(groupedPermissions).length > 0 ? (
                      Object.entries(groupedPermissions).map(([category, permissions]) => (
                        <Card key={category} className="border border-border/40">
                          <CardHeader className="py-3">
                            <CardTitle className="text-base capitalize">{category}</CardTitle>
                          </CardHeader>
                          <CardContent className="py-2">
                            <ul className="space-y-1">
                              {permissions.map((permission) => (
                                <li key={permission} className="text-sm flex items-center gap-2">
                                  <Shield className="h-3 w-3 text-primary" />
                                  {permission.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-2 p-6 text-center border border-dashed rounded-md">
                        <p className="text-slate-400">No permissions assigned to this user.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-6 text-center border border-dashed rounded-md">
                    <p className="text-slate-400">Activity history will be available in a future update.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <DeleteUserDialog
        user={user}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteUser}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default withSentryRouting(UserDetails);
