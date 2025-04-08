
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserPlus, Search, Filter, RefreshCcw } from "lucide-react";

interface ClientsEmptyStateProps {
  searchTerm?: string;
  onClearFilters?: () => void;
}

export function ClientsEmptyState({ searchTerm, onClearFilters }: ClientsEmptyStateProps) {
  const navigate = useNavigate();
  const hasSearchTerm = searchTerm && searchTerm.trim().length > 0;
  
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      {hasSearchTerm ? (
        <>
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Clients Found</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            No clients match your search for "{searchTerm}". Try another search term or clear your filters.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {onClearFilters && (
              <Button variant="outline" onClick={onClearFilters}>
                <Filter className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
            <Button onClick={() => navigate("/clients/new")}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Client
            </Button>
          </div>
        </>
      ) : (
        <>
          <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Clients Yet</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            You haven't added any clients yet. Get started by adding your first client.
          </p>
          <Button onClick={() => navigate("/clients/new")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add First Client
          </Button>
        </>
      )}
    </div>
  );
}
