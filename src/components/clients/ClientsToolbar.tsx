
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search,
  LayoutGrid, 
  Table2, 
  Filter, 
  RefreshCcw, 
  X 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClientsToolbarProps {
  searchTerm: string;
  activeStatusFilter: string | null;
  viewMode: 'table' | 'grid';
  onSearchChange: (term: string) => void;
  onStatusFilterChange: (status: string | null) => void;
  onViewModeChange: (mode: 'table' | 'grid') => void;
  onRefresh: () => void;
  onClearFilters: () => void;
}

export function ClientsToolbar({
  searchTerm,
  activeStatusFilter,
  viewMode,
  onSearchChange,
  onStatusFilterChange,
  onViewModeChange,
  onRefresh,
  onClearFilters
}: ClientsToolbarProps) {
  const hasActiveFilters = searchTerm || activeStatusFilter;
  
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Prospect", label: "Prospect" },
    { value: "On Hold", label: "On Hold" },
    { value: "Cancelled", label: "Cancelled" }
  ];

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search clients by name, ABN, or industry..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-full"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-48">
          <Select
            value={activeStatusFilter || "all"}
            onValueChange={(value) => onStatusFilterChange(value === "all" ? null : value)}
          >
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* View Mode Toggle (desktop only) */}
        <div className="hidden md:flex">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => {
              if (value) onViewModeChange(value as 'table' | 'grid');
            }}
          >
            <ToggleGroupItem value="table" aria-label="Table view">
              <Table2 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Refresh button */}
        <Button variant="outline" size="icon" onClick={onRefresh}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
        
        {/* Clear Filters (only shown when filters are active) */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onClearFilters} className="whitespace-nowrap">
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
      
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchTerm && (
            <Badge variant="outline" className="flex items-center gap-1">
              Search: {searchTerm}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => onSearchChange('')} />
            </Badge>
          )}
          {activeStatusFilter && (
            <Badge variant="outline" className="flex items-center gap-1">
              Status: {activeStatusFilter}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => onStatusFilterChange(null)} />
            </Badge>
          )}
        </div>
      )}
    </Card>
  );
}
