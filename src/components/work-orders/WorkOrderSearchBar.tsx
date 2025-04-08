
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import { WorkOrderHeaderActions } from './WorkOrderHeaderActions';

interface WorkOrderSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onToggleFilters: () => void;
  showFilters: boolean;
  onRefresh: () => void;
}

export function WorkOrderSearchBar({ 
  searchQuery, 
  onSearchChange, 
  onToggleFilters, 
  showFilters,
  onRefresh
}: WorkOrderSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search work orders..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <WorkOrderHeaderActions 
          onToggleFilters={() => onToggleFilters()} 
          showFilters={showFilters}
          onRefresh={onRefresh}
        />
      </div>
    </div>
  );
}
