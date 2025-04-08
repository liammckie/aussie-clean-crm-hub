
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { WorkOrderCard } from './WorkOrderCard';
import { WorkOrderActionsDropdown } from './WorkOrderActionsDropdown';
import { formatCurrency } from '@/utils/formatters';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface WorkOrderListProps {
  workOrders: Array<any>;
  onViewDetails: (id: string) => void;
  loaderRef: React.RefObject<HTMLDivElement>;
  loading: boolean;
  hasMore: boolean;
}

export function WorkOrderList({
  workOrders,
  onViewDetails,
  loaderRef,
  loading,
  hasMore
}: WorkOrderListProps) {
  const isMobile = useIsMobile();

  // Get status badge color
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

  // Get priority badge color
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

  return (
    <>
      {/* Mobile view - Cards */}
      {isMobile && (
        <div className="lg:hidden">
          {workOrders.map((workOrder) => (
            <WorkOrderCard 
              key={workOrder.id}
              workOrder={workOrder}
              onViewDetails={onViewDetails}
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
                {workOrders.map((workOrder) => {
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
                          onViewDetails={() => onViewDetails(workOrder.id)}
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
  );
}
