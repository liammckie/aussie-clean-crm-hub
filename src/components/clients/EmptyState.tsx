
import React from "react";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  clearFilters: () => void;
}

const EmptyState = ({ clearFilters }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No clients found</h3>
      <p className="text-muted-foreground mb-4">
        We couldn't find any clients matching your search criteria.
      </p>
      <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
    </div>
  );
};

export default EmptyState;
