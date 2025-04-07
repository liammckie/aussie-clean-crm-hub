
import React from "react";
import { Filter, MapPin, RefreshCw, CalendarDays, BarChart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

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
  const handleRefetch = () => {
    toast.info("Refreshing client data...");
    refetchClients();
  };
  
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

      <div className="flex gap-2 flex-wrap">
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
              <Filter className="mr-2 h-4 w-4" />Status
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border">
            <DropdownMenuLabel>Client Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
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
            <DropdownMenuLabel>State/Territory</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleStatusFilter(null)}>
              All Locations
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("NSW")}>
              NSW
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("VIC")}>
              VIC
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("QLD")}>
              QLD
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("SA")}>
              SA
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("WA")}>
              WA
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("TAS")}>
              TAS
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("NT")}>
              NT
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("ACT")}>
              ACT
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <BarChart className="mr-2 h-4 w-4" />Revenue
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border">
            <DropdownMenuLabel>Annual Revenue</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleStatusFilter(null)}>
              All Revenue Levels
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("revenue_under_50k")}>
              Under $50,000
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("revenue_50k_200k")}>
              $50,000 - $200,000
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("revenue_over_200k")}>
              Over $200,000
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <CalendarDays className="mr-2 h-4 w-4" />Date
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border">
            <DropdownMenuLabel>Client Age</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleStatusFilter(null)}>
              All Dates
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("added_last_month")}>
              Added Last Month
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("added_last_quarter")}>
              Added Last Quarter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusFilter("added_last_year")}>
              Added Last Year
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Make refresh button more prominent */}
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleRefetch}
          className="bg-primary text-primary-foreground"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
