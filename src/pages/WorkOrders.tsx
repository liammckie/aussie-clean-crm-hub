
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
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  ClipboardList,
} from 'lucide-react';
import { WorkOrderActionsDropdown } from '@/components/work-orders/WorkOrderActionsDropdown';
import { WorkOrderHeaderActions } from '@/components/work-orders/WorkOrderHeaderActions';
import { WorkOrderFilters } from '@/components/work-orders/WorkOrderFilters';
import { formatCurrency } from '@/utils/formatters';
import { PageHeader } from '@/components/layout/PageHeader';

// Dummy data for work orders with added supplier cost and submitted by fields
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
    supplier_cost: 580,
    submitted_by: 'John Smith'
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
    supplier_cost: 250,
    submitted_by: 'Emma Johnson'
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
    supplier_cost: 420,
    submitted_by: 'Michael Brown'
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
    supplier_cost: 180,
    submitted_by: 'Sarah Davis'
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
    supplier_cost: 350,
    submitted_by: 'James Wilson'
  },
];

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
    status: '',
    priority: '',
    dateFrom: '',
    dateTo: ''
  });
  
  const filteredWorkOrders = dummyWorkOrders.filter(workOrder => {
    const searchMatch =
      workOrder.work_order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workOrder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workOrder.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workOrder.site.toLowerCase().includes(searchQuery.toLowerCase());
    
    const statusMatch = activeFilters.status === '' || workOrder.status === activeFilters.status;
    
    const priorityMatch = activeFilters.priority === '' || workOrder.priority === activeFilters.priority;
    
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

  const handleViewDetails = (workOrderId: string) => {
    console.log(`View details for work order ${workOrderId}`);
    // Navigate to work order detail page
    // history.push(`/work-orders/${workOrderId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Work Orders"
        description="View and manage all service requests and tasks."
        breadcrumbs={[{ label: "Work Orders" }]}
        actions={
          <Button>
            <ClipboardList className="h-4 w-4 mr-2" />
            Create Work Order
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar - toggle on smaller screens */}
        {showFilters && (
          <div className="lg:hidden">
            <WorkOrderFilters
              onApplyFilters={setActiveFilters}
              initialFilters={activeFilters}
              onCancel={() => setShowFilters(false)}
            />
          </div>
        )}
        
        {/* Filters sidebar - always visible on larger screens */}
        <div className="hidden lg:block">
          <WorkOrderFilters
            onApplyFilters={setActiveFilters}
            initialFilters={activeFilters}
            onCancel={() => {}}
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
            <WorkOrderHeaderActions 
              onToggleFilters={() => setShowFilters(!showFilters)} 
              showFilters={showFilters}
              onRefresh={() => console.log("Refreshing work orders")}
            />
          </div>

          {filteredWorkOrders.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <CardTitle className="mb-2">No work orders found</CardTitle>
                  <CardDescription className="mb-4">
                    {searchQuery || activeFilters.status !== '' || activeFilters.priority !== ''
                      ? "No work orders match your search criteria"
                      : "You haven't created any work orders yet"}
                  </CardDescription>
                  <Button>
                    <ClipboardList className="h-4 w-4 mr-2" />
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
                    <TableHead>Supplier Cost</TableHead>
                    <TableHead className="hidden md:table-cell">Submitted By</TableHead>
                    <TableHead className="hidden md:table-cell">Scheduled</TableHead>
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
                        <TableCell>{formatCurrency(workOrder.supplier_cost)}</TableCell>
                        <TableCell className="hidden md:table-cell">{workOrder.submitted_by}</TableCell>
                        <TableCell className="hidden md:table-cell">{formatDate(workOrder.scheduled_start)}</TableCell>
                        <TableCell>
                          <WorkOrderActionsDropdown 
                            workOrderId={workOrder.id}
                            status={workOrder.status}
                            onViewDetails={() => handleViewDetails(workOrder.id)}
                            onEdit={() => console.log(`Edit work order ${workOrder.id}`)}
                            onAssignTechnician={() => console.log(`Assign technician to ${workOrder.id}`)}
                            onGenerateReport={() => console.log(`Generate report for ${workOrder.id}`)}
                            onMarkComplete={() => console.log(`Mark ${workOrder.id} as complete`)}
                            onCancel={() => console.log(`Cancel order ${workOrder.id}`)}
                            onDelete={() => console.log(`Delete work order ${workOrder.id}`)}
                          />
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
