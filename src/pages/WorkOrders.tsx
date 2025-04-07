
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal,
  ClipboardList,
} from 'lucide-react';

// Dummy data for work orders
const dummyWorkOrders = [
  {
    id: '1',
    work_order_number: 'WO-2023-001',
    title: 'Emergency Plumbing Repair',
    client: 'ABC Corporation',
    site: 'Sydney Office',
    status: 'pending',
    priority: 'high',
    created_at: '2023-05-10T10:30:00',
    scheduled_start: '2023-05-12T09:00:00',
  },
  {
    id: '2',
    work_order_number: 'WO-2023-002',
    title: 'Regular Cleaning Service',
    client: 'XYZ Industries',
    site: 'Melbourne Warehouse',
    status: 'in_progress',
    priority: 'medium',
    created_at: '2023-05-11T14:45:00',
    scheduled_start: '2023-05-15T08:00:00',
  },
  {
    id: '3',
    work_order_number: 'WO-2023-003',
    title: 'HVAC Maintenance',
    client: 'Tech Innovators',
    site: 'Brisbane HQ',
    status: 'completed',
    priority: 'medium',
    created_at: '2023-05-08T09:15:00',
    scheduled_start: '2023-05-09T13:00:00',
  },
  {
    id: '4',
    work_order_number: 'WO-2023-004',
    title: 'Window Cleaning',
    client: 'Finance Group',
    site: 'Perth Office',
    status: 'pending',
    priority: 'low',
    created_at: '2023-05-12T11:20:00',
    scheduled_start: '2023-05-20T10:00:00',
  },
  {
    id: '5',
    work_order_number: 'WO-2023-005',
    title: 'Security System Check',
    client: 'Retail Solutions',
    site: 'Adelaide Store',
    status: 'in_progress',
    priority: 'high',
    created_at: '2023-05-13T08:30:00',
    scheduled_start: '2023-05-14T09:30:00',
  },
];

// Work Order Filter component
interface WorkOrderFiltersProps {
  onFilterChange: (filters: Record<string, any>) => void;
  initialFilters: Record<string, any>;
}

const WorkOrderFilters: React.FC<WorkOrderFiltersProps> = ({ onFilterChange, initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters);
  
  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Status</h4>
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'in_progress', 'completed', 'cancelled'].map(status => (
              <Button
                key={status}
                variant={filters.status === status ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('status', status)}
              >
                {status === 'all' ? 'All' : status.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Priority</h4>
          <div className="flex flex-wrap gap-2">
            {['all', 'low', 'medium', 'high'].map(priority => (
              <Button
                key={priority}
                variant={filters.priority === priority ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterChange('priority', priority)}
              >
                {priority === 'all' ? 'All' : priority}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Date Range</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs">From</label>
              <Input type="date" value={filters.dateFrom || ''} onChange={(e) => handleFilterChange('dateFrom', e.target.value)} />
            </div>
            <div>
              <label className="text-xs">To</label>
              <Input type="date" value={filters.dateTo || ''} onChange={(e) => handleFilterChange('dateTo', e.target.value)} />
            </div>
          </div>
        </div>
        
        <Button variant="outline" className="w-full" onClick={() => onFilterChange({ status: 'all', priority: 'all', dateFrom: '', dateTo: '' })}>
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};

// Function to get the status badge color
const getStatusBadgeProps = (status: string) => {
  switch (status) {
    case 'pending':
      return { className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200', label: 'Pending' };
    case 'in_progress':
      return { className: 'bg-blue-100 text-blue-800 hover:bg-blue-200', label: 'In Progress' };
    case 'completed':
      return { className: 'bg-green-100 text-green-800 hover:bg-green-200', label: 'Completed' };
    case 'cancelled':
      return { className: 'bg-red-100 text-red-800 hover:bg-red-200', label: 'Cancelled' };
    default:
      return { className: 'bg-gray-100 text-gray-800 hover:bg-gray-200', label: status };
  }
};

// Function to get the priority badge color
const getPriorityBadgeProps = (priority: string) => {
  switch (priority) {
    case 'high':
      return { className: 'bg-red-100 text-red-800 hover:bg-red-200', label: 'High' };
    case 'medium':
      return { className: 'bg-blue-100 text-blue-800 hover:bg-blue-200', label: 'Medium' };
    case 'low':
      return { className: 'bg-green-100 text-green-800 hover:bg-green-200', label: 'Low' };
    default:
      return { className: 'bg-gray-100 text-gray-800 hover:bg-gray-200', label: priority };
  }
};

// Format date function
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-AU', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Work Orders main component
const WorkOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
    priority: 'all',
    dateFrom: '',
    dateTo: ''
  });
  
  // Filter work orders based on search query and active filters
  const filteredWorkOrders = dummyWorkOrders.filter(workOrder => {
    // Search filter
    const searchMatch =
      workOrder.work_order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workOrder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workOrder.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workOrder.site.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const statusMatch = activeFilters.status === 'all' || workOrder.status === activeFilters.status;
    
    // Priority filter
    const priorityMatch = activeFilters.priority === 'all' || workOrder.priority === activeFilters.priority;
    
    // Date filter
    let dateMatch = true;
    if (activeFilters.dateFrom) {
      const fromDate = new Date(activeFilters.dateFrom);
      const workOrderDate = new Date(workOrder.scheduled_start);
      dateMatch = dateMatch && workOrderDate >= fromDate;
    }
    if (activeFilters.dateTo) {
      const toDate = new Date(activeFilters.dateTo);
      const workOrderDate = new Date(workOrder.scheduled_start);
      dateMatch = dateMatch && workOrderDate <= toDate;
    }
    
    return searchMatch && statusMatch && priorityMatch && dateMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Orders</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all service requests and tasks.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Work Order
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar - toggle on smaller screens */}
        {showFilters && (
          <div className="lg:hidden">
            <WorkOrderFilters
              onFilterChange={setActiveFilters}
              initialFilters={activeFilters}
            />
          </div>
        )}
        
        {/* Filters sidebar - always visible on larger screens */}
        <div className="hidden lg:block">
          <WorkOrderFilters
            onFilterChange={setActiveFilters}
            initialFilters={activeFilters}
          />
        </div>

        {/* Main content area */}
        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search work orders..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">Toggle filters</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                  <DropdownMenuItem>Print Work Orders</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {filteredWorkOrders.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <CardTitle className="mb-2">No work orders found</CardTitle>
                  <CardDescription className="mb-4">
                    {searchQuery || activeFilters.status !== 'all' || activeFilters.priority !== 'all'
                      ? "No work orders match your search criteria"
                      : "You haven't created any work orders yet"}
                  </CardDescription>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Work Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Work Order</TableHead>
                    <TableHead>Client / Site</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkOrders.map((workOrder) => {
                    const statusProps = getStatusBadgeProps(workOrder.status);
                    const priorityProps = getPriorityBadgeProps(workOrder.priority);
                    
                    return (
                      <TableRow key={workOrder.id}>
                        <TableCell>
                          <div className="font-medium">{workOrder.work_order_number}</div>
                          <div className="text-sm text-muted-foreground">{workOrder.title}</div>
                        </TableCell>
                        <TableCell>
                          <div>{workOrder.client}</div>
                          <div className="text-sm text-muted-foreground">{workOrder.site}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusProps.className}>
                            {statusProps.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={priorityProps.className}>
                            {priorityProps.label}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(workOrder.scheduled_start)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View details</DropdownMenuItem>
                              <DropdownMenuItem>Edit work order</DropdownMenuItem>
                              <DropdownMenuItem>Assign technician</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Cancel order</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkOrders;
