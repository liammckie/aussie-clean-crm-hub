import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface WorkOrderRecord {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  scheduled_start: string;
  client_id: string;
  site_id: string;
  contract_id: string;
  service_type: string;
}

interface WorkOrderFilterState {
  status: string | null;
  priority: string | null;
}

const WorkOrders = () => {
  const navigate = useNavigate();
  const { 
    workOrders,
    isLoadingWorkOrders,
    workOrdersError,
    refetchWorkOrders
  } = useWorkOrders();
  
  const [workOrdersData, setWorkOrdersData] = useState<WorkOrderRecord[]>([]);
  const [filterState, setFilterState] = useState<WorkOrderFilterState>({
    status: null,
    priority: null,
  });

  useEffect(() => {
    if (workOrders) {
      setWorkOrdersData(workOrders);
    }
  }, [workOrders]);

  const columns: ColumnDefinition[] = React.useMemo(() => [
    { title: "Title", field: "title", sorter: "string", headerFilter: true },
    { title: "Status", field: "status", sorter: "string", headerFilter: true },
    { title: "Priority", field: "priority", sorter: "string", headerFilter: true },
    { title: "Scheduled Start", field: "scheduled_start", sorter: "date", headerFilter: true },
    { title: "Client ID", field: "client_id", sorter: "string", headerFilter: true },
    { title: "Site ID", field: "site_id", sorter: "string", headerFilter: true },
    { title: "Contract ID", field: "contract_id", sorter: "string", headerFilter: true },
    { title: "Service Type", field: "service_type", sorter: "string", headerFilter: true },
  ], []);

  const handleRowClick = (_e: Event, row: RowComponent) => {
    navigate(`/work-orders/${row.getData().id}`);
  };

  const handleFilterChange = (filter: WorkOrderFilterState) => {
    setFilterState(filter);
  };

  if (isLoadingWorkOrders) {
    return <div>Loading work orders...</div>;
  }

  if (workOrdersError) {
    return <div>Error: {workOrdersError.message}</div>;
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
        <Button asChild>
          <Link to="/work-orders/new">
            <Plus className="mr-2 h-4 w-4" /> New Work Order
          </Link>
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Work Order Management</CardTitle>
          <CardDescription>
            Manage work orders, tasks, and related information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {workOrders && workOrders.length > 0 ? (
            <TabulatorTable 
              columns={columns}
              data={workOrders}
              onRowClick={handleRowClick}
            />
          ) : (
            <div>No work orders found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkOrders;
