import React, { useState } from 'react';
import { 
  ClipboardList, 
  Filter, 
  Calendar, 
  MoreVertical, 
  ChevronDown 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useWorkOrders } from '@/hooks/use-work-orders';
import TabulatorTable from '@/components/contracts/TabulatorTable';
import { ColumnDefinition, RowComponent } from '@/types/tabulator-types';
import { useNavigate } from 'react-router-dom';
import { WorkOrderFiltersAdvanced } from '@/components/work-orders/WorkOrderFiltersAdvanced';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

const WorkOrders = () => {
  const navigate = useNavigate();
  const { 
    workOrders,
    isLoadingWorkOrders,
    workOrdersError,
    refetchWorkOrders
  } = useWorkOrders();
  
  const [workOrdersData, setWorkOrdersData] = useState<any[]>([]);
  const [filterState, setFilterState] = useState({
    status: '',
    priority: '',
    client_id: '',
    supplier_id: '',
    site_id: '',
    state: '',
    dateFrom: null,
    dateTo: null,
    searchTerm: '',
    showCompleted: true,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Fetch clients for the dropdown
  const { data: clients } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      // Placeholder for actual API call
      return [
        { id: '1', business_name: 'Client 1' },
        { id: '2', business_name: 'Client 2' },
      ];
    },
  });

  // Fetch suppliers for the dropdown
  const { data: suppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      // Placeholder for actual API call
      return [
        { id: '1', business_name: 'Supplier 1' },
        { id: '2', business_name: 'Supplier 2' },
      ];
    },
  });

  // Fetch sites for the dropdown
  const { data: sites } = useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      // Placeholder for actual API call
      return [
        { id: '1', site_name: 'Site 1' },
        { id: '2', site_name: 'Site 2' },
      ];
    },
  });

  useEffect(() => {
    if (workOrders) {
      let filteredData = [...workOrders];

      // Apply filters
      if (filterState.status) {
        filteredData = filteredData.filter(wo => wo.status === filterState.status);
      }
      
      if (filterState.priority) {
        filteredData = filteredData.filter(wo => wo.priority === filterState.priority);
      }
      
      if (filterState.client_id) {
        filteredData = filteredData.filter(wo => wo.client_id === filterState.client_id);
      }
      
      if (filterState.supplier_id) {
        filteredData = filteredData.filter(wo => wo.supplier_id === filterState.supplier_id);
      }

      if (filterState.site_id) {
        filteredData = filteredData.filter(wo => wo.site_id === filterState.site_id);
      }

      if (filterState.state) {
        filteredData = filteredData.filter(wo => {
          // This would require site data with state information
          // Placeholder logic - in real app we'd join with site data
          return wo.state === filterState.state;
        });
      }
      
      if (filterState.dateFrom) {
        const fromDate = new Date(filterState.dateFrom);
        filteredData = filteredData.filter(wo => {
          const woDate = new Date(wo.scheduled_start);
          return woDate >= fromDate;
        });
      }
      
      if (filterState.dateTo) {
        const toDate = new Date(filterState.dateTo);
        filteredData = filteredData.filter(wo => {
          const woDate = new Date(wo.scheduled_start);
          return woDate <= toDate;
        });
      }

      if (!filterState.showCompleted) {
        filteredData = filteredData.filter(wo => wo.status !== 'completed');
      }

      if (filterState.searchTerm) {
        const searchLower = filterState.searchTerm.toLowerCase();
        filteredData = filteredData.filter(wo => 
          wo.title?.toLowerCase().includes(searchLower) || 
          wo.description?.toLowerCase().includes(searchLower) ||
          wo.work_order_number?.toLowerCase().includes(searchLower)
        );
      }
      
      setWorkOrdersData(filteredData);
    }
  }, [workOrders, filterState]);

  const columns: ColumnDefinition[] = React.useMemo(() => [
    { 
      title: "Work Order", 
      field: "title", 
      sorter: "string", 
      headerFilter: true,
      formatter: (cell) => {
        const data = cell.getRow().getData();
        return `<div>
          <div class="font-medium">${data.work_order_number || ''} - ${data.title || ''}</div>
          <div class="text-xs text-muted-foreground">${data.description || ''}</div>
        </div>`;
      }
    },
    { 
      title: "Status", 
      field: "status", 
      sorter: "string", 
      headerFilter: true,
      formatter: (cell) => {
        const status = cell.getValue();
        let badgeClass = '';
        
        switch(status) {
          case 'pending':
            badgeClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
            break;
          case 'in_progress':
            badgeClass = 'bg-blue-100 text-blue-800 border-blue-200';
            break;
          case 'completed':
            badgeClass = 'bg-green-100 text-green-800 border-green-200';
            break;
          case 'cancelled':
            badgeClass = 'bg-red-100 text-red-800 border-red-200';
            break;
          default:
            badgeClass = 'bg-gray-100 text-gray-800 border-gray-200';
        }
        
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}">${status.replace('_', ' ')}</span>`;
      }
    },
    { 
      title: "Priority", 
      field: "priority", 
      sorter: "string", 
      headerFilter: true,
      formatter: (cell) => {
        const priority = cell.getValue();
        let badgeClass = '';
        
        switch(priority) {
          case 'low':
            badgeClass = 'bg-green-100 text-green-800 border-green-200';
            break;
          case 'medium':
            badgeClass = 'bg-blue-100 text-blue-800 border-blue-200';
            break;
          case 'high':
            badgeClass = 'bg-orange-100 text-orange-800 border-orange-200';
            break;
          case 'urgent':
            badgeClass = 'bg-red-100 text-red-800 border-red-200';
            break;
          default:
            badgeClass = 'bg-gray-100 text-gray-800 border-gray-200';
        }
        
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}">${priority}</span>`;
      }
    },
    { 
      title: "Scheduled", 
      field: "scheduled_start", 
      sorter: "date", 
      headerFilter: true,
      formatter: (cell) => {
        const value = cell.getValue();
        if (!value) return '';
        try {
          const date = new Date(value);
          return format(date, 'dd MMM yyyy');
        } catch (e) {
          return value;
        }
      }
    },
    { 
      title: "Client", 
      field: "client_id", 
      sorter: "string", 
      headerFilter: true,
      formatter: (cell) => {
        // In a real app, we'd use client name from a joined query
        return `Client ${cell.getValue()}`;
      }
    },
    { 
      title: "Site", 
      field: "site_id", 
      sorter: "string", 
      headerFilter: true,
      formatter: (cell) => {
        // In a real app, we'd use site name from a joined query
        return `Site ${cell.getValue()}`;
      }
    },
  ], []);

  const handleRowClick = (_e: Event, row: RowComponent) => {
    navigate(`/work-orders/${row.getData().id}`);
  };

  const handleFilterChange = (filters: any) => {
    setFilterState(filters);
    setShowFilters(false);
  };

  if (isLoadingWorkOrders) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-slate-200"></div>
            <div className="h-4 w-48 bg-slate-200 rounded"></div>
            <div className="h-2 w-36 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (workOrdersError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Error Loading Work Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{workOrdersError.message}</p>
            <Button 
              variant="outline" 
              className="mt-4 border-red-300 text-red-700 hover:bg-red-100" 
              onClick={() => refetchWorkOrders()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="my-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Work Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Work Orders</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
          >
            {viewMode === 'list' ? (
              <>
                <Calendar className="mr-2 h-4 w-4" /> Calendar
              </>
            ) : (
              <>
                <List className="mr-2 h-4 w-4" /> List
              </>
            )}
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              // Export data functionality would go here
              alert('Export functionality to be implemented');
            }}
          >
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button asChild>
            <Link to="/work-orders/new">
              <Plus className="mr-2 h-4 w-4" /> New Work Order
            </Link>
          </Button>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2 border-b">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle>Work Order Management</CardTitle>
              <CardDescription>
                Manage and track all work orders across sites and clients
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search work orders..."
                  className="pl-8 w-full md:w-[250px]"
                  value={filterState.searchTerm}
                  onChange={(e) => setFilterState(prev => ({ ...prev, searchTerm: e.target.value }))}
                />
                {filterState.searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-6 w-6"
                    onClick={() => setFilterState(prev => ({ ...prev, searchTerm: '' }))}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <Button 
                variant={Object.values(filterState).some(v => v !== '' && v !== null && v !== true) ? "default" : "outline"} 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters 
                {Object.values(filterState).filter(v => v !== '' && v !== null && v !== true).length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {Object.values(filterState).filter(v => v !== '' && v !== null && v !== true).length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        {showFilters && (
          <div className="p-4 border-b">
            <WorkOrderFiltersAdvanced
              initialFilters={filterState}
              onApplyFilters={handleFilterChange}
              onCancel={() => setShowFilters(false)}
              clients={clients || []}
              suppliers={suppliers || []}
              sites={sites || []}
            />
          </div>
        )}

        <CardContent className="p-0">
          <Tabs defaultValue="active" className="w-full">
            <div className="px-6 pt-4">
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="all">All Work Orders</TabsTrigger>
              </TabsList>
            </div>
            
            <Separator className="my-2" />
            
            <div className="px-4">
              <TabsContent value="active" className="mt-0 pt-4">
                {viewMode === 'list' ? (
                  <TabulatorTable 
                    columns={columns}
                    data={workOrdersData.filter(wo => wo.status === 'in_progress')}
                    onRowClick={handleRowClick}
                  />
                ) : (
                  <div className="h-96 flex items-center justify-center bg-muted/20">
                    <p className="text-muted-foreground">Calendar view coming soon</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="mt-0 pt-4">
                {viewMode === 'list' ? (
                  <TabulatorTable 
                    columns={columns}
                    data={workOrdersData.filter(wo => wo.status === 'completed')}
                    onRowClick={handleRowClick}
                  />
                ) : (
                  <div className="h-96 flex items-center justify-center bg-muted/20">
                    <p className="text-muted-foreground">Calendar view coming soon</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0 pt-4">
                {viewMode === 'list' ? (
                  <TabulatorTable 
                    columns={columns}
                    data={workOrdersData.filter(wo => wo.status === 'pending')}
                    onRowClick={handleRowClick}
                  />
                ) : (
                  <div className="h-96 flex items-center justify-center bg-muted/20">
                    <p className="text-muted-foreground">Calendar view coming soon</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="all" className="mt-0 pt-4">
                {viewMode === 'list' ? (
                  workOrdersData && workOrdersData.length > 0 ? (
                    <TabulatorTable 
                      columns={columns}
                      data={workOrdersData}
                      onRowClick={handleRowClick}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
                        <ClipboardList className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">No work orders found</h3>
                      <p className="text-muted-foreground mt-2 mb-4 text-center max-w-md">
                        There are no work orders matching your current filters. Try adjusting your filters or create your first work order.
                      </p>
                      <Button asChild>
                        <Link to="/work-orders/new">
                          <Plus className="mr-2 h-4 w-4" /> Create Work Order
                        </Link>
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="h-96 flex items-center justify-center bg-muted/20">
                    <p className="text-muted-foreground">Calendar view coming soon</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkOrders;
