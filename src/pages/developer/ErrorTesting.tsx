
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { ErrorTestingPanel } from '@/components/error/ErrorTestingPanel';
import { Card, CardContent } from '@/components/ui/card';
import { AppLogger, LogCategory } from '@/utils/logging';
import { ErrorReporting } from '@/utils/errorReporting';

/**
 * A page for testing various error reporting functionalities
 */
export default function ErrorTesting() {
  // Log page visit
  React.useEffect(() => {
    AppLogger.info(LogCategory.UI, "Error Testing page visited");
    
    // Initialize error reporting if not already initialized
    if (!ErrorReporting.isInitialized) {
      ErrorReporting.init();
      AppLogger.info(LogCategory.SYSTEM, "Error reporting initialized from Error Testing page");
    }
  }, []);

  return (
    <MainLayout>
      <div className="container py-6">
        <PageHeader 
          title="Error Testing Tools" 
          description="Test and debug various error reporting functionalities"
        />
        
        <div className="mt-8">
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Error Reporting Status</h2>
              <p className="text-muted-foreground">
                Status: {ErrorReporting.isInitialized ? 
                  <span className="text-green-500 font-medium">Initialized</span> : 
                  <span className="text-amber-500 font-medium">Not Initialized</span>}
              </p>
            </CardContent>
          </Card>
          
          <ErrorTestingPanel />
        </div>
      </div>
    </MainLayout>
  );
}
