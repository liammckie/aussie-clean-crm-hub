
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, FileText, AlertTriangle, Trash2, UserPlus, CheckCircle } from 'lucide-react';

interface WorkOrderActionsDropdownProps {
  workOrderId: string;
  status: string;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onAssignTechnician?: () => void;
  onGenerateReport?: () => void;
  onMarkComplete?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export const WorkOrderActionsDropdown: React.FC<WorkOrderActionsDropdownProps> = ({
  workOrderId,
  status,
  onViewDetails,
  onEdit,
  onAssignTechnician,
  onGenerateReport,
  onMarkComplete,
  onCancel,
  onDelete
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          <span>View details</span>
        </DropdownMenuItem>
        
        {status !== 'completed' && status !== 'cancelled' && (
          <>
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit work order</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={onAssignTechnician}>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Assign technician</span>
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuItem onClick={onGenerateReport}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Generate report</span>
        </DropdownMenuItem>
        
        {status !== 'completed' && (
          <DropdownMenuItem onClick={onMarkComplete}>
            <CheckCircle className="mr-2 h-4 w-4" />
            <span>Mark as complete</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        {status !== 'cancelled' && (
          <DropdownMenuItem 
            onClick={onCancel}
            className="text-amber-600 focus:bg-amber-50 dark:focus:bg-amber-900/10"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span>Cancel order</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
