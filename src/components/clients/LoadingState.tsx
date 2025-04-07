
import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="flex justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <span className="ml-2 text-lg text-muted-foreground">Loading data...</span>
    </div>
  );
};

export default LoadingState;
