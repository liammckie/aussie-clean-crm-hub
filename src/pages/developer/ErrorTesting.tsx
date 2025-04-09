
import React, { useState } from 'react';
import { PageHeader } from "@/components/layout/PageHeader";
import { ErrorTestingPanel } from "@/components/error/ErrorTestingPanel";
import { Button } from "@/components/ui/button";
import { StandardErrorDisplay } from "@/components/error/StandardErrorDisplay";
import { ErrorCategory } from "@/utils/logging/error-types";
import { Card } from "@/components/ui/card";

const errorSamples: Array<{
  title: string;
  error: Error | string;
  category?: ErrorCategory;
}> = [
  {
    title: "Simple Error",
    error: new Error("This is a simple error message")
  },
  {
    title: "Network Error",
    error: new Error("Failed to fetch: Network request failed"),
    category: ErrorCategory.SERVER
  },
  {
    title: "Validation Error",
    error: "Invalid input: Email address is not correctly formatted",
    category: ErrorCategory.VALIDATION
  },
  {
    title: "Permission Error",
    error: new Error("You don't have permission to perform this action"),
    category: ErrorCategory.PERMISSION
  },
  {
    title: "Database Error",
    error: new Error("Database query failed: Constraint violation"),
    category: ErrorCategory.DATABASE
  }
];

const ErrorTesting = () => {
  const [showErrorDisplays, setShowErrorDisplays] = useState(false);
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader
        heading="Error Testing Tools"
        description="Test and validate the error reporting system."
      />
      
      <div className="grid gap-6 mt-6">
        <ErrorTestingPanel />
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Error Display Components</h2>
          <Button
            onClick={() => setShowErrorDisplays(!showErrorDisplays)}
            variant="outline"
          >
            {showErrorDisplays ? "Hide" : "Show"} Error Displays
          </Button>
          
          {showErrorDisplays && (
            <div className="grid gap-6 mt-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Standard Error Variants</h3>
                <div className="space-y-4">
                  <StandardErrorDisplay 
                    error={new Error("This is a default error display")}
                    title="Default Error"
                    onRetry={() => alert("Retry clicked")}
                  />
                  
                  <StandardErrorDisplay 
                    error={new Error("This is a destructive error display")}
                    title="Destructive Error"
                    onRetry={() => alert("Retry clicked")}
                    variant="destructive"
                  />
                  
                  <StandardErrorDisplay 
                    error={new Error("This is a minimal error display")}
                    variant="minimal"
                    onRetry={() => alert("Retry clicked")}
                  />
                  
                  <StandardErrorDisplay 
                    error={new Error("This is a card error display")}
                    title="Card Error"
                    onRetry={() => alert("Retry clicked")}
                    variant="card"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Error Categories</h3>
                <div className="space-y-4">
                  {errorSamples.map((sample, index) => (
                    <StandardErrorDisplay 
                      key={index}
                      error={sample.error}
                      title={sample.title}
                      errorCategory={sample.category}
                      onRetry={() => alert(`Retry clicked for ${sample.title}`)}
                      showDetails={true}
                      variant="card"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ErrorTesting;
