
import React from "react";
import { Filter, MapPin, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchFilterBarProps {
  searchTerm: string;
  activeStatusFilter: string | null;
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusFilter: (status: string | null) => void;
  refetchClients: () => void;
}

const SearchFilterBar = ({
  searchTerm,
  activeStatusFilter,
  handleSearch,
  handleStatusFilter,
  refetchClients
}: SearchFilterBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
      <div className="relative w-full sm:w-auto flex-1">
        <Input
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name, ABN, address..."
          className="pl-10"
        />
        <div className="absolute left-3 top-3 text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          variant={activeStatusFilter ? "secondary" : "outline"} 
          size="sm"
          onClick={() => handleStatusFilter(null)}
        >
          <Filter className="mr-2 h-4 w-4" /> All
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border">
            <DropdownMenuItem onClick={() => handleStatusFilter("Prospect")}>
              Prospect
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("Active")}>
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("On Hold")}>
              On Hold
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("Cancelled")}>
              Cancelled
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MapPin className="mr-2 h-4 w-4" />Location
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border">
            <DropdownMenuItem onClick={() => handleStatusFilter(null)}>
              All Locations
            </DropdownMenuItem>
            {/* Just placeholders - would be dynamic in a real implementation */}
            <DropdownMenuItem onClick={() => handleStatusFilter(null)}>
              NSW
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter(null)}>
              VIC
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter(null)}>
              QLD
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Make refresh button more prominent */}
        <Button 
          variant="default" 
          size="sm" 
          onClick={refetchClients}
          className="bg-primary text-primary-foreground"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
