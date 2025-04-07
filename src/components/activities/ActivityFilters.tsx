
import React, { useState } from 'react';
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
import { CalendarIcon, Search, Filter, Undo2 } from 'lucide-react';
import { format } from 'date-fns';
import { ActivityType } from '@/types/activity-types';
import { Badge } from '@/components/ui/badge';

interface ActivityFiltersProps {
  onFilterChange: (type: ActivityType | 'all') => void;
  activeFilter: ActivityType | 'all';
}

export function ActivityFilters({ onFilterChange, activeFilter }: ActivityFiltersProps) {
  const [date, setDate] = React.useState<Date>();
  const [searchText, setSearchText] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
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
  
  const handleTypeChange = (value: string) => {
    onFilterChange(value as ActivityType | 'all');
    
    // Update active filters display
    if (value !== 'all') {
      const typeLabel = activityTypes.find(type => type.value === value)?.label || value;
      if (!activeFilters.includes(typeLabel)) {
        setActiveFilters([...activeFilters, typeLabel]);
      }
    }
  };
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    
    // Update active filters display
    if (selectedDate) {
      const dateStr = format(selectedDate, "MMM d, yyyy");
      if (!activeFilters.includes(dateStr)) {
        setActiveFilters([...activeFilters, dateStr]);
      }
    }
  };
  
  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
    
    // If removing an activity type filter, reset to 'all'
    const matchingType = activityTypes.find(type => type.label === filter);
    if (matchingType && matchingType.value !== 'all') {
      onFilterChange('all');
    }
    
    // If removing a date filter, clear the date
    if (date && format(date, "MMM d, yyyy") === filter) {
      setDate(undefined);
    }
  };
  
  const resetAllFilters = () => {
    setActiveFilters([]);
    setDate(undefined);
    setSearchText('');
    onFilterChange('all');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 mb-2">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            className="pl-8"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        
        <Select 
          onValueChange={handleTypeChange} 
          value={activeFilter}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
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
            <Button variant="outline" className="w-full sm:w-[210px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "MMM d, yyyy") : "Filter by date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Button variant="outline" className="gap-1">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={resetAllFilters} 
          disabled={activeFilters.length === 0 && !date && !searchText}
          className="gap-1"
        >
          <Undo2 className="h-4 w-4" />
          Reset
        </Button>
      </div>
      
      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="outline" className="bg-primary/10 text-primary flex gap-1 items-center">
              {filter}
              <button 
                className="ml-1 text-primary-foreground/70 hover:text-primary-foreground" 
                onClick={() => removeFilter(filter)}
              >
                ×
              </button>
            </Badge>
          ))}
          {activeFilters.length > 0 && (
            <Button 
              variant="ghost" 
              onClick={resetAllFilters} 
              size="sm"
              className="h-6 text-xs"
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
