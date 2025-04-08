
import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { WorkOrderActionsDropdown } from '@/components/work-orders/WorkOrderActionsDropdown';
import { WorkOrderHeaderActions } from '@/components/work-orders/WorkOrderHeaderActions';
import { WorkOrderFilters } from '@/components/work-orders/WorkOrderFilters';
import { WorkOrderCard } from '@/components/work-orders/WorkOrderCard';
import { formatCurrency } from '@/utils/formatters';
import { PageHeader } from '@/components/layout/PageHeader';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

// Extended dummy data with additional fields
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
    supplier_cost: 2500.00,
    revenue: 4400.00,
    gross_profit_percent: 37,
    submitted_by: 'John Smith',
    supplier_name: 'Sydney Plumbing Co'
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
    supplier_cost: 900.00,
    revenue: 1500.00,
    gross_profit_percent: 40,
    submitted_by: 'Emma Johnson',
    supplier_name: 'Melbourne Cleaning Services'
  },
  {
    id: '3',
    work_order_number: 'WO-2023-003',
    title: 'HVAC Maintenance',
    client: 'Tech Innovators',
    site: 'Brisbane HQ',
    status: 'completed',
    priority: 'low',
    created_at: '2023-05-08T09:15:00',
    scheduled_start: '2023-05-09T13:00:00',
    supplier_cost: 350.00,
    revenue: 500.00,
    gross_profit_percent: 30,
    submitted_by: 'Michael Brown',
    supplier_name: 'Brisbane HVAC Solutions'
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
    supplier_cost: 1200.00,
    revenue: 2000.00,
    gross_profit_percent: 40,
    submitted_by: 'Sarah Davis',
    supplier_name: 'Perth Window Specialists'
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
    supplier_cost: 500.00,
    revenue: 700.00,
    gross_profit_percent: 29,
    submitted_by: 'James Wilson',
    supplier_name: 'Adelaide Security Systems'
  },
  // Adding more dummy data to demonstrate infinite scrolling
  {
    id: '6',
    work_order_number: 'WO-2023-006',
    title: 'Electrical Maintenance',
    client: 'Health Services',
    site: 'Darwin Clinic',
    status: 'completed',
    priority: 'medium',
    created_at: '2023-05-14T08:30:00',
    scheduled_start: '2023-05-16T09:30:00',
    supplier_cost: 800.00,
    revenue: 1250.00,
    gross_profit_percent: 36,
    submitted_by: 'Robert Chen',
    supplier_name: 'Darwin Electrical'
  },
  {
    id: '7',
    work_order_number: 'WO-2023-007',
    title: 'Carpet Replacement',
    client: 'Education Department',
    site: 'Hobart School',
    status: 'pending',
    priority: 'low',
    created_at: '2023-05-15T10:15:00',
    scheduled_start: '2023-05-25T08:00:00',
    supplier_cost: 3200.00,
    revenue: 4500.00,
    gross_profit_percent: 29,
    submitted_by: 'Lisa Murray',
    supplier_name: 'Hobart Flooring Co'
  },
  {
    id: '8',
    work_order_number: 'WO-2023-008',
    title: 'Garden Maintenance',
    client: 'Government Office',
    site: 'Canberra HQ',
    status: 'completed',
    priority: 'low',
    created_at: '2023-05-16T14:20:00',
    scheduled_start: '2023-05-18T07:30:00',
    supplier_cost: 450.00,
    revenue: 750.00,
    gross_profit_percent: 40,
    submitted_by: 'Thomas Wright',
    supplier_name: 'Capital Gardens'
  },
  {
    id: '9',
    work_order_number: 'WO-2023-009',
    title: 'Pest Control',
    client: 'Hotel Chain',
    site: 'Gold Coast Resort',
    status: 'in_progress',
    priority: 'high',
    created_at: '2023-05-17T09:45:00',
    scheduled_start: '2023-05-19T06:00:00',
    supplier_cost: 600.00,
    revenue: 950.00,
    gross_profit_percent: 37,
    submitted_by: 'Angela Kim',
    supplier_name: 'Gold Coast Pest Solutions'
  },
  {
    id: '10',
    work_order_number: 'WO-2023-010',
    title: 'Fire Safety Inspection',
    client: 'Shopping Center',
    site: 'Newcastle Mall',
    status: 'pending',
    priority: 'high',
    created_at: '2023-05-18T11:30:00',
    scheduled_start: '2023-05-20T09:00:00',
    supplier_cost: 1800.00,
    revenue: 2400.00,
    gross_profit_percent: 25,
    submitted_by: 'David Thompson',
    supplier_name: 'Newcastle Fire Safety'
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

// Get gross profit indicator component
const getGrossProfitIndicator = (percent: number) => {
  const isPositive = percent >= 30;
  
  if (isPositive) {
    return (
      <div className="flex items-center justify-end">
        <ArrowUp className="h-4 w-4 mr-1 text-green-600" />
        <span className="text-green-600 font-medium">{percent}%</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-end">
        <ArrowDown className="h-4 w-4 mr-1 text-red-600" />
        <span className="text-red-600 font-medium">{percent}%</span>
      </div>
    );
  }
};

// Work Orders main component
const WorkOrders = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    status: '',
    priority: '',
    dateFrom: '',
    dateTo: ''
  });
  
  // For infinite scrolling
  const [visibleOrders, setVisibleOrders] = useState<Array<any>>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = isMobile ? 3 : 5;
  
  // Filter work orders based on search and filters
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
  
  // Load more items for infinite scrolling
  const loadMoreItems = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = page * ITEMS_PER_PAGE;
      const newItems = filteredWorkOrders.slice(startIndex, endIndex);
      
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setVisibleOrders(prev => [...prev, ...newItems]);
        setPage(prev => prev + 1);
      }
      
      setLoading(false);
    }, 500);
  }, [page, loading, hasMore, filteredWorkOrders, ITEMS_PER_PAGE]);
  
  // Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loadMoreItems();
        }
      },
      { threshold: 1.0 }
    );
    
    const currentRef = loaderRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMoreItems]);
  
  // Reset when filters change
  useEffect(() => {
    setPage(1);
    setVisibleOrders([]);
    setHasMore(true);
    
    // Load initial items
    const initialItems = filteredWorkOrders.slice(0, ITEMS_PER_PAGE);
    setVisibleOrders(initialItems);
    setPage(prev => prev + 1);
  }, [searchQuery, activeFilters, filteredWorkOrders.length, ITEMS_PER_PAGE]);

  const handleViewDetails = (workOrderId: string) => {
    console.log(`View details for work order ${workOrderId}`);
    navigate(`/work-orders/${workOrderId}`);
  };

  const handleCreateWorkOrder = () => {
    navigate('/work-orders/new');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Work Orders"
        description="View and manage all service requests and tasks."
        breadcrumbs={[{ label: "Work Orders" }]}
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
            <div className="flex items-center space-x-2">
              <WorkOrderHeaderActions 
                onToggleFilters={() => setShowFilters(!showFilters)} 
                showFilters={showFilters}
                onRefresh={() => {
                  setPage(1);
                  setVisibleOrders([]);
                  setHasMore(true);
                  
                  // Reload initial items
                  const initialItems = filteredWorkOrders.slice(0, ITEMS_PER_PAGE);
                  setVisibleOrders(initialItems);
                  setPage(prev => prev + 1);
                }}
              />
            </div>
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
                  <Button onClick={handleCreateWorkOrder}>
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Create Work Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Mobile view - Cards */}
              {isMobile && (
                <div className="lg:hidden">
                  {visibleOrders.map((workOrder) => (
                    <WorkOrderCard 
                      key={workOrder.id}
                      workOrder={workOrder}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}

              {/* Desktop view - Table */}
              {!isMobile && (
                <div className="hidden lg:block border rounded-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[180px]">Submitted By</TableHead>
                          <TableHead className="w-[200px]">Work Order</TableHead>
                          <TableHead className="w-[200px]">Client / Site</TableHead>
                          <TableHead className="w-[100px]">Status</TableHead>
                          <TableHead className="w-[100px]">Priority</TableHead>
                          <TableHead className="w-[120px] text-right">Cost</TableHead>
                          <TableHead className="w-[120px] text-right">Revenue</TableHead>
                          <TableHead className="w-[100px] text-right">GP %</TableHead>
                          <TableHead className="w-[180px]">Supplier</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visibleOrders.map((workOrder) => {
                          const statusProps = getStatusBadgeProps(workOrder.status);
                          const priorityProps = getPriorityBadgeProps(workOrder.priority);
                          
                          return (
                            <TableRow key={workOrder.id}>
                              <TableCell className="font-medium align-top">
                                {workOrder.submitted_by}
                              </TableCell>
                              <TableCell className="align-top">
                                <div className="font-medium">{workOrder.work_order_number}</div>
                                <div className="text-sm text-muted-foreground">{workOrder.title}</div>
                              </TableCell>
                              <TableCell className="align-top">
                                <div>{workOrder.client}</div>
                                <div className="text-sm text-muted-foreground">{workOrder.site}</div>
                              </TableCell>
                              <TableCell className="align-top">
                                <Badge variant="outline" className={statusProps.className}>
                                  {statusProps.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="align-top">
                                <Badge variant="outline" className={priorityProps.className}>
                                  {priorityProps.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right align-top">
                                {formatCurrency(workOrder.supplier_cost)}
                              </TableCell>
                              <TableCell className="text-right align-top">
                                {formatCurrency(workOrder.revenue)}
                              </TableCell>
                              <TableCell className="text-right align-top">
                                {getGrossProfitIndicator(workOrder.gross_profit_percent)}
                              </TableCell>
                              <TableCell className="align-top">
                                {workOrder.supplier_name}
                              </TableCell>
                              <TableCell className="align-top">
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
                </div>
              )}
              
              {/* Loader for infinite scrolling */}
              {hasMore && (
                <div ref={loaderRef} className="p-4 flex justify-center">
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Scroll for more</span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkOrders;
