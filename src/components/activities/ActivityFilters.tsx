
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react';

export function ActivityFilters() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={5}>
        <DropdownMenuLabel>Filter Activities</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">By Status</DropdownMenuLabel>
          <DropdownMenuItem>
            All Statuses
          </DropdownMenuItem>
          <DropdownMenuItem>
            Success
          </DropdownMenuItem>
          <DropdownMenuItem>
            Warning
          </DropdownMenuItem>
          <DropdownMenuItem>
            Error
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">By Type</DropdownMenuLabel>
          <DropdownMenuItem>
            All Types
          </DropdownMenuItem>
          <DropdownMenuItem>
            Client
          </DropdownMenuItem>
          <DropdownMenuItem>
            Contract
          </DropdownMenuItem>
          <DropdownMenuItem>
            Work Order
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Reset Filters
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
