
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, X, Filter, Calendar } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export interface WorkOrderFiltersProps {
  initialFilters: any;
  onApplyFilters: (filters: any) => void;
  onCancel: () => void;
  clients?: Array<{id: string, business_name: string}>;
  suppliers?: Array<{id: string, business_name: string}>;
  sites?: Array<{id: string, site_name: string}>;
}

export function WorkOrderFiltersAdvanced({
  initialFilters,
  onApplyFilters,
  onCancel,
  clients = [],
  suppliers = [],
  sites = []
}: WorkOrderFiltersProps) {
  const [filters, setFilters] = useState<any>({
    status: initialFilters.status || '',
    priority: initialFilters.priority || '',
    client_id: initialFilters.client_id || '',
    supplier_id: initialFilters.supplier_id || '',
    site_id: initialFilters.site_id || '',
    state: initialFilters.state || '',
    dateFrom: initialFilters.dateFrom || null,
    dateTo: initialFilters.dateTo || null,
    searchTerm: initialFilters.searchTerm || '',
    showCompleted: initialFilters.showCompleted ?? true,
  });

  const states = [
    { value: 'NSW', label: 'New South Wales' },
    { value: 'VIC', label: 'Victoria' },
    { value: 'QLD', label: 'Queensland' },
    { value: 'WA', label: 'Western Australia' },
    { value: 'SA', label: 'South Australia' },
    { value: 'TAS', label: 'Tasmania' },
    { value: 'ACT', label: 'Australian Capital Territory' },
    { value: 'NT', label: 'Northern Territory' }
  ];

  const handleChange = (field: string, value: any) => {
    setFilters((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = () => {
    // Filter out empty values
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => {
        if (typeof v === 'boolean') return true;
        return v != null && v !== '';
      })
    );
    onApplyFilters(cleanedFilters);
  };

  const handleReset = () => {
    setFilters({
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
  };

  return (
    <Card className="shadow-lg border-border/40">
      <CardContent className="p-4">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search work orders..." 
              className="pl-8" 
              value={filters.searchTerm} 
              onChange={(e) => handleChange('searchTerm', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select
              value={filters.status || ''}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Status</SelectItem>
                {workOrderStatusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Priority</Label>
            <Select
              value={filters.priority || ''}
              onValueChange={(value) => handleChange('priority', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Priority</SelectItem>
                {workOrderPriorityOptions.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Client</Label>
            <Select
              value={filters.client_id || ''}
              onValueChange={(value) => handleChange('client_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Clients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.business_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Supplier</Label>
            <Select
              value={filters.supplier_id || ''}
              onValueChange={(value) => handleChange('supplier_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Suppliers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.business_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Site</Label>
            <Select
              value={filters.site_id || ''}
              onValueChange={(value) => handleChange('site_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Sites" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.site_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">State</Label>
            <Select
              value={filters.state || ''}
              onValueChange={(value) => handleChange('state', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">From Date</Label>
            <div className="flex items-center gap-2">
              <DatePicker
                date={filters.dateFrom ? new Date(filters.dateFrom) : undefined}
                setDate={(date) => handleChange('dateFrom', date ? date.toISOString() : null)}
                placeholder="Select start date"
              />
              {filters.dateFrom && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleChange('dateFrom', null)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">To Date</Label>
            <div className="flex items-center gap-2">
              <DatePicker
                date={filters.dateTo ? new Date(filters.dateTo) : undefined}
                setDate={(date) => handleChange('dateTo', date ? date.toISOString() : null)}
                placeholder="Select end date"
              />
              {filters.dateTo && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleChange('dateTo', null)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <Checkbox 
            id="show-completed" 
            checked={filters.showCompleted}
            onCheckedChange={(value) => handleChange('showCompleted', value)}
          />
          <Label htmlFor="show-completed">Show completed work orders</Label>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button variant="default" onClick={handleApply}>
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
      </CardFooter>
    </Card>
  );
}
