
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Filter, 
  Download, 
  FileText, 
  Printer, 
  FileSpreadsheet, 
  RefreshCw, 
  CalendarPlus,
  ClipboardList
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface WorkOrderHeaderActionsProps {
  onRefresh?: () => void;
  onToggleFilters: () => void;
  showFilters: boolean;
}

export const WorkOrderHeaderActions: React.FC<WorkOrderHeaderActionsProps> = ({
  onRefresh,
  onToggleFilters,
  showFilters
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button 
        variant="outline"
        size="icon"
        onClick={onToggleFilters}
        className={`lg:hidden ${showFilters ? 'bg-muted' : ''}`}
        title="Toggle filters"
      >
        <Filter className="h-4 w-4" />
        <span className="sr-only">Toggle filters</span>
      </Button>

      {onRefresh && (
        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          title="Refresh"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Refresh</span>
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="hidden sm:flex whitespace-nowrap">
            <CalendarPlus className="h-4 w-4 mr-2" />
            Schedule
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Schedule new work order</DropdownMenuItem>
          <DropdownMenuItem>View schedule calendar</DropdownMenuItem>
          <DropdownMenuItem>Batch scheduling</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Printer className="mr-2 h-4 w-4" />
            Print Work Orders
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ClipboardList className="mr-2 h-4 w-4" />
            Work Order Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
