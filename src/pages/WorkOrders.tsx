
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { WorkOrderFiltersAdvanced } from '@/components/work-orders/WorkOrderFiltersAdvanced';
import {
  Download,
  List,
  Search,
  ArrowDownNarrowWide,
  X,
  ChevronDown,
  Plus,
  Filter,
  ArrowRight,
  ArrowLeft,
  MoreHorizontal,
  ClipboardList,
} from 'lucide-react';

// Sample data for work orders
const mockWorkOrders = [
  {
    id: '1',
    title: 'Office Deep Clean',
    client: 'Acme Corporation',
    location: 'Sydney CBD',
    status: 'Scheduled',
    date: '2023-05-20',
    priority: 'Medium',
    assignee: 'John Smith',
    supplier: 'CleanPro Services',
  },
  {
    id: '2',
    title: 'Window Cleaning',
    client: 'TechStar Inc.',
    location: 'Melbourne Central',
    status: 'In Progress',
    date: '2023-05-18',
    priority: 'High',
    assignee: 'Sarah Jones',
    supplier: 'Crystal Clear Windows',
  },
  {
    id: '3',
    title: 'Carpet Shampooing',
    client: 'Finance Group',
    location: 'Brisbane Office',
    status: 'Completed',
    date: '2023-05-15',
    priority: 'Low',
    assignee: 'Michael Brown',
    supplier: 'Carpet Masters',
  },
  {
    id: '4',
    title: 'HVAC Maintenance',
    client: 'Global Media',
    location: 'Perth Office',
    status: 'Pending Approval',
    date: '2023-05-22',
    priority: 'Medium',
    assignee: 'Lisa Chen',
    supplier: 'Cool Air Systems',
  },
  {
    id: '5',
    title: 'Security System Check',
    client: 'Secure Banking',
    location: 'Adelaide Branch',
    status: 'Scheduled',
    date: '2023-05-21',
    priority: 'High',
    assignee: 'Robert Wilson',
    supplier: 'SecureTech',
  },
];

const statusColors: Record<string, string> = {
  Completed: 'bg-green-100 text-green-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Scheduled: 'bg-purple-100 text-purple-800',
  'Pending Approval': 'bg-yellow-100 text-yellow-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const priorityColors: Record<string, string> = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
};

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState(mockWorkOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Apply search term filtering
  const filteredWorkOrders = workOrders.filter((workOrder) =>
    Object.values(workOrder).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handle filter changes
  const handleFilterChange = (filters: Record<string, any>) => {
    setActiveFilters(filters);
    // In a real application, this would filter the workOrders based on the filters
    console.log('Filters applied:', filters);
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({});
  };

  // Function to render the filter badges
  const renderFilterBadges = () => {
    return Object.entries(activeFilters).map(([key, value]) => {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return null;
      }
      
      return (
        <Badge variant="outline" key={key} className="mr-2 mb-2">
          {key}: {Array.isArray(value) ? value.join(', ') : value}
          <button
            onClick={() => {
              const newFilters = { ...activeFilters };
              delete newFilters[key];
              setActiveFilters(newFilters);
            }}
            className="ml-1 hover:bg-gray-200 rounded-full"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      );
    });
  };

  // Table view component
  const TableView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Assignee</TableHead>
          <TableHead>Supplier</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredWorkOrders.map((workOrder) => (
          <TableRow key={workOrder.id}>
            <TableCell>{workOrder.id}</TableCell>
            <TableCell>
              <Link to={`/work-orders/${workOrder.id}`} className="font-medium hover:underline text-blue-600">
                {workOrder.title}
              </Link>
            </TableCell>
            <TableCell>{workOrder.client}</TableCell>
            <TableCell>{workOrder.location}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusColors[workOrder.status] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {workOrder.status}
              </span>
            </TableCell>
            <TableCell>{workOrder.date}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  priorityColors[workOrder.priority] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {workOrder.priority}
              </span>
            </TableCell>
            <TableCell>{workOrder.assignee}</TableCell>
            <TableCell>{workOrder.supplier}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Link to={`/work-orders/${workOrder.id}`}>View Details</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // Card view component
  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredWorkOrders.map((workOrder) => (
        <Card key={workOrder.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">
                <Link to={`/work-orders/${workOrder.id}`} className="hover:underline text-blue-600">
                  {workOrder.title}
                </Link>
              </CardTitle>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusColors[workOrder.status] || 'bg-gray-100 text-gray-800'
                }`}
              >
                {workOrder.status}
              </span>
            </div>
            <CardDescription>
              {workOrder.client} • {workOrder.location}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Date</p>
                <p>{workOrder.date}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Priority</p>
                <p className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  priorityColors[workOrder.priority] || 'bg-gray-100 text-gray-800'
                }`}>
                  {workOrder.priority}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Assignee</p>
                <p>{workOrder.assignee}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Supplier</p>
                <p>{workOrder.supplier}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Work Orders</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm" asChild>
            <Link to="/work-orders/new">
              <Plus className="mr-2 h-4 w-4" />
              New Work Order
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search work orders..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(true)}
            className="whitespace-nowrap"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          
          <div className="border rounded-md flex">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode('cards')}
            >
              <div className="grid grid-cols-2 gap-0.5 h-4 w-4">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Active filters */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap items-center">
            <span className="text-sm font-medium mr-2">Filters:</span>
            {renderFilterBadges()}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7">
              Clear all
            </Button>
          </div>
        </div>
      )}
      
      <Card>
        <CardContent className="p-0">
          <div className={`${viewMode === 'table' ? '' : 'p-4'}`}>
            {filteredWorkOrders.length > 0 ? (
              viewMode === 'table' ? <TableView /> : <CardView />
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-blue-50 p-3 mb-4">
                  <ClipboardList className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium mb-1">No work orders found</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Try adjusting your search or filters
                </p>
                <Button asChild>
                  <Link to="/work-orders/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Work Order
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Advanced Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Work Orders</DialogTitle>
            <DialogDescription>
              Apply filters to narrow down your work orders view.
            </DialogDescription>
          </DialogHeader>
          <WorkOrderFiltersAdvanced 
            onFilterChange={handleFilterChange}
            initialFilters={activeFilters}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsFilterOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing 1-{filteredWorkOrders.length} of {filteredWorkOrders.length} work orders
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkOrders;
