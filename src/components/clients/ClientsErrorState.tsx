
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ClientsErrorStateProps {
  error: Error | unknown;
  refetch: () => void;
}

export function ClientsErrorState({ error, refetch }: ClientsErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
  
  return (
    <div className="rounded-md border bg-destructive/10 p-6 flex flex-col items-center justify-center text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-medium mb-2">Error Loading Clients</h3>
      <p className="text-muted-foreground mb-4 max-w-md">
        We encountered a problem while loading the client data. Please try again.
      </p>
      <p className="text-sm text-destructive mb-4 max-w-md">
        {errorMessage}
      </p>
      <Button onClick={refetch}>
        <RefreshCcw className="mr-2 h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}
