
import React from 'react';
import { Loader2, Plus, Check, Clock, AlertCircle, XCircle } from 'lucide-react';
import { WorkOrderTask } from '@/types/work-order-types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface WorkOrderTasksListProps {
  workOrderId: string;
  tasks: WorkOrderTask[];
  isLoading: boolean;
}

export function WorkOrderTasksList({ workOrderId, tasks, isLoading }: WorkOrderTasksListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-slate-500" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-slate-100 text-slate-800">Pending</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (hours?: number) => {
    if (hours === undefined || hours === null) return '-';
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (wholeHours === 0) {
      return `${minutes} min`;
    } else if (minutes === 0) {
      return `${wholeHours} hr${wholeHours !== 1 ? 's' : ''}`;
    } else {
      return `${wholeHours} hr${wholeHours !== 1 ? 's' : ''} ${minutes} min`;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Loading tasks...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Manage tasks for this work order</CardDescription>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 border rounded-md">
            <p className="text-muted-foreground mb-4">No tasks have been created for this work order</p>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create First Task
            </Button>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Estimated Time</TableHead>
                  <TableHead>Actual Time</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div className="font-medium">{task.task_name}</div>
                      {task.description && (
                        <div className="text-xs text-muted-foreground max-w-[200px] truncate">
                          {task.description}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        {getStatusBadge(task.status)}
                      </div>
                    </TableCell>
                    <TableCell>{formatTime(task.estimated_time)}</TableCell>
                    <TableCell>{formatTime(task.actual_time)}</TableCell>
                    <TableCell>{formatDate(task.completed_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        {task.status === 'pending' && (
                          <Button variant="ghost" size="sm">Start</Button>
                        )}
                        {task.status === 'in_progress' && (
                          <Button variant="ghost" size="sm">Complete</Button>
                        )}
                        {task.status !== 'completed' && task.status !== 'cancelled' && (
                          <Button variant="ghost" size="sm">Edit</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
