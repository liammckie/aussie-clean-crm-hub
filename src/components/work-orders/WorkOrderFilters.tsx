
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  workOrderStatusOptions,
  workOrderPriorityOptions
} from '@/types/work-order-types';
import { DatePicker } from '@/components/ui/date-picker';
import { X, Filter } from 'lucide-react';

interface WorkOrderFiltersProps {
  initialFilters: any;
  onApplyFilters: (filters: any) => void;
  onCancel: () => void;
}

export function WorkOrderFilters({
  initialFilters,
  onApplyFilters,
  onCancel
}: WorkOrderFiltersProps) {
  const [filters, setFilters] = useState<any>({
    status: initialFilters.status || '',
    priority: initialFilters.priority || '',
    dateFrom: initialFilters.dateFrom || null,
    dateTo: initialFilters.dateTo || null
  });

  const handleChange = (field: string, value: any) => {
    setFilters((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    // Filter out empty values
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v != null && v !== '')
    );
    onApplyFilters(cleanedFilters);
  };

  const handleReset = () => {
    setFilters({
      status: '',
      priority: '',
      dateFrom: null,
      dateTo: null
    });
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={filters.status || ''}
            onValueChange={(value) => handleChange('status', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Status</SelectItem>
              {workOrderStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <Select
            value={filters.priority || ''}
            onValueChange={(value) => handleChange('priority', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Priority</SelectItem>
              {workOrderPriorityOptions.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">From Date</label>
          <DatePicker
            date={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
            setDate={(date) => handleChange('dateFrom', date ? date.toISOString() : null)}
            placeholder="Select start date"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">To Date</label>
          <DatePicker
            date={filters.dateTo ? new Date(filters.dateTo) : undefined}
            setDate={(date) => handleChange('dateTo', date ? date.toISOString() : null)}
            placeholder="Select end date"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="outline" onClick={handleReset} className="gap-1">
          <X className="h-4 w-4" />
          Reset
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="default" onClick={handleApply} className="gap-1">
            <Filter className="h-4 w-4" />
            Apply
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
