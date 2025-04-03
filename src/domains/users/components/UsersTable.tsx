
import React, { useState } from 'react';
import { User, UserRole, PermissionType } from '../types';
import { useUser } from '../context/UserContext';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UsersTableProps {
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onView?: (user: User) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  onEdit,
  onDelete,
  onView,
}) => {
  const { users, loading, error, hasPermission } = useUser();
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<keyof User>('lastName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const canEdit = hasPermission(PermissionType.EDIT_USERS);
  const canDelete = hasPermission(PermissionType.DELETE_USERS);

  // Sort users
  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortField] as string;
    const bValue = b[sortField] as string;
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-purple-500 hover:bg-purple-600';
      case UserRole.MANAGER:
        return 'bg-blue-500 hover:bg-blue-600';
      case UserRole.SUPERVISOR:
        return 'bg-green-500 hover:bg-green-600';
      case UserRole.STAFF:
        return 'bg-yellow-500 hover:bg-yellow-600';
      case UserRole.CLIENT:
        return 'bg-orange-500 hover:bg-orange-600';
      case UserRole.SUPPLIER:
        return 'bg-pink-500 hover:bg-pink-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-500/30 bg-red-950/20 rounded-md text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-red-500">Error Loading Users</h3>
        <p className="text-sm text-gray-300 mt-1">{error}</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()} 
          className="mt-4"
        >
          Reload
        </Button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-8 border border-gray-700 rounded-md text-center bg-slate-900/50">
        <h3 className="text-lg font-medium">No Users Found</h3>
        <p className="text-sm text-gray-400 mt-1">There are no users in the system.</p>
        {hasPermission(PermissionType.CREATE_USERS) && (
          <Button 
            onClick={() => navigate('/users/new')} 
            className="mt-4"
          >
            Create User
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border/40 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer w-[200px]"
              onClick={() => handleSort('lastName')}
            >
              Name
              {sortField === 'lastName' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('email')}
            >
              Email
              {sortField === 'email' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead 
              className="cursor-pointer text-right"
              onClick={() => handleSort('lastLogin')}
            >
              Last Login
              {sortField === 'lastLogin' && (
                <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={getRoleBadgeColor(user.role)}>
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusBadgeColor(user.status)}>
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {user.lastLogin 
                  ? new Date(user.lastLogin).toLocaleDateString()
                  : 'Never'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView && onView(user)}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit && onEdit(user)}
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete && onDelete(user)}
                      title="Delete User"
                      className="text-red-500 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
