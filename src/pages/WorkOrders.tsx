
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkOrders } from '@/hooks/use-work-orders';

import {
  Loader2,
  Plus,
  Filter,
  Search,
  RefreshCcw,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';

// Work order filter component
import { WorkOrderFilters } from '@/components/work-orders/WorkOrderFilters';
import { WorkOrderData, workOrderStatusOptions } from '@/types/work-order-types';

const WorkOrders: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});

  const appliedFilters = useMemo(() => {
    return { ...filters, search: search || undefined };
  }, [filters, search]);

  const { 
    data: response, 
    isLoading, 
    isError,
    error,
    refetch
  } = useWorkOrders(page, pageSize, appliedFilters);

  const workOrders = response?.data || [];
  const totalCount = response?.count || 0;
  const pageCount = Math.ceil(totalCount / pageSize);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when search changes
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
    setIsFilterOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pageCount) {
      setPage(newPage);
    }
  };

  const handleCreateWorkOrder = () => {
    navigate('/work-orders/new');
  };

  const handleViewWorkOrder = (workOrderId: string) => {
    navigate(`/work-orders/${workOrderId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-slate-100 text-slate-800">Pending</Badge>;
      case 'assigned':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Assigned</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge className="bg-slate-500">Low</Badge>;
      case 'medium':
        return <Badge className="bg-blue-500">Medium</Badge>;
      case 'high':
        return <Badge className="bg-amber-500">High</Badge>;
      case 'urgent':
        return <Badge className="bg-red-500">Urgent</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'assigned':
        return <FileText className="h-4 w-4" />;
      case 'in_progress':
        return <AlertTriangle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not scheduled';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and track operational tasks from creation to completion
          </p>
        </div>
        <Button onClick={handleCreateWorkOrder}>
          <Plus className="mr-2 h-4 w-4" />
          Create Work Order
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>All Work Orders</CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={isFilterOpen ? 'bg-slate-100 dark:bg-slate-800' : ''}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            {totalCount} work order{totalCount !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search work orders..."
                value={search}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
          </div>

          {isFilterOpen && (
            <div className="mb-4">
              <WorkOrderFilters 
                initialFilters={filters} 
                onApplyFilters={handleApplyFilters}
                onCancel={() => setIsFilterOpen(false)}
              />
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isError ? (
            <div className="p-4 border rounded-md bg-destructive/10 text-destructive">
              <p className="font-semibold">Error loading work orders</p>
              <p className="text-sm mt-1">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
            </div>
          ) : workOrders.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <p className="text-muted-foreground">No work orders found</p>
              <Button 
                variant="outline" 
                onClick={handleCreateWorkOrder}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create your first work order
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Work Order</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Site</TableHead>
                      <TableHead>Scheduled Start</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workOrders.map((workOrder: WorkOrderData) => (
                      <TableRow 
                        key={workOrder.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewWorkOrder(workOrder.id)}
                      >
                        <TableCell className="font-medium">
                          {workOrder.work_order_number}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {workOrder.title}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(workOrder.status)}
                            {getStatusBadge(workOrder.status)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(workOrder.priority)}
                        </TableCell>
                        <TableCell>
                          {workOrder.client_name}
                        </TableCell>
                        <TableCell>
                          {workOrder.site_name}
                        </TableCell>
                        <TableCell>
                          {formatDate(workOrder.scheduled_start)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {pageCount > 1 && (
                <div className="mt-4 flex items-center justify-end">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(page - 1)}
                          className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                      
                      {/* Generate page numbers */}
                      {Array.from({ length: Math.min(5, pageCount) }).map((_, i) => {
                        let pageNum: number;
                        
                        if (pageCount <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= pageCount - 2) {
                          pageNum = pageCount - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        
                        if (pageNum === 1 || pageNum === pageCount || (pageNum >= page - 1 && pageNum <= page + 1)) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                isActive={page === pageNum}
                                onClick={() => handlePageChange(pageNum)}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                        
                        if (pageNum === 2 || pageNum === pageCount - 1) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(page + 1)}
                          className={page >= pageCount ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkOrders;
