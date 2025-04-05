
import React from "react";
import { Button } from "@/components/ui/button";
import { ErrorResponse } from "@/utils/supabaseErrors";

interface ErrorStateProps {
  error: ErrorResponse | Error;
  refetch: () => void;
}

const ErrorState = ({ error, refetch }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 9v4"></path>
          <path d="M12 17h.01"></path>
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-2">Error loading clients</h3>
      <p className="text-muted-foreground mb-4">
        {error.message || "There was an error fetching client data"}
      </p>
      <Button variant="outline" onClick={refetch}>
        Try Again
      </Button>
    </div>
  );
};

export default ErrorState;
