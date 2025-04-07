
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ActivityType } from '@/types/activity-types';

interface ActivityFiltersProps {
  onFilterChange: (type: ActivityType | 'all') => void;
  activeFilter: ActivityType | 'all';
}

export function ActivityFilters({ onFilterChange, activeFilter }: ActivityFiltersProps) {
  const [date, setDate] = React.useState<Date>();
  
  // Define activity types for the filter
  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'client_created', label: 'Client Created' },
    { value: 'client_updated', label: 'Client Updated' },
    { value: 'contract_signed', label: 'Contract Signed' },
    { value: 'task_completed', label: 'Task Completed' },
    { value: 'invoice_paid', label: 'Invoice Paid' },
    { value: 'work_order_created', label: 'Work Order Created' },
    { value: 'site_added', label: 'Site Added' },
    { value: 'supplier_added', label: 'Supplier Added' },
    { value: 'user_login', label: 'User Login' },
    { value: 'system_event', label: 'System Event' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-2">
      <div className="relative w-full sm:w-96">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search activities..."
          className="pl-8"
        />
      </div>
      
      <Select 
        onValueChange={(value) => onFilterChange(value as ActivityType | 'all')} 
        value={activeFilter}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="All Activities" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Activity Types</SelectLabel>
            {activityTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full sm:w-[240px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Filter by date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      
      <Button variant="outline" className="gap-1">
        <Filter className="h-4 w-4" />
        More Filters
      </Button>
      
      <Button variant="secondary" onClick={() => onFilterChange('all')}>
        Reset Filters
      </Button>
    </div>
  );
}
