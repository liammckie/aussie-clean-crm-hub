
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { WorkOrderActionsDropdown } from './WorkOrderActionsDropdown';

interface WorkOrderCardProps {
  workOrder: any;
  onViewDetails: (id: string) => void;
}

export const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ workOrder, onViewDetails }) => {
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
        <div className="flex items-center">
          <ArrowUp className="h-4 w-4 mr-1 text-green-600" />
          <span className="text-green-600 font-medium">{percent}%</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <ArrowDown className="h-4 w-4 mr-1 text-red-600" />
          <span className="text-red-600 font-medium">{percent}%</span>
        </div>
      );
    }
  };
  
  const statusProps = getStatusBadgeProps(workOrder.status);
  const priorityProps = getPriorityBadgeProps(workOrder.priority);
  
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">{workOrder.work_order_number}</div>
            <div className="text-sm text-muted-foreground mb-2">{workOrder.title}</div>
          </div>
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
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge variant="outline" className={statusProps.className}>
            {statusProps.label}
          </Badge>
          <Badge variant="outline" className={priorityProps.className}>
            {priorityProps.label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="text-sm">
            <div className="text-muted-foreground">Client / Site</div>
            <div className="font-medium">{workOrder.client}</div>
            <div className="text-xs text-muted-foreground">{workOrder.site}</div>
          </div>
          
          <div className="text-sm">
            <div className="text-muted-foreground">Submitted By</div>
            <div>{workOrder.submitted_by}</div>
          </div>

          <div className="text-sm">
            <div className="text-muted-foreground">Supplier</div>
            <div>{workOrder.supplier_name}</div>
          </div>

          <div className="text-sm">
            <div className="text-muted-foreground">GP %</div>
            {getGrossProfitIndicator(workOrder.gross_profit_percent)}
          </div>
          
          <div className="text-sm">
            <div className="text-muted-foreground">Cost</div>
            <div>{formatCurrency(workOrder.supplier_cost)}</div>
          </div>
          
          <div className="text-sm">
            <div className="text-muted-foreground">Revenue</div>
            <div>{formatCurrency(workOrder.revenue)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
