
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ErrorReporting } from "@/utils/errorReporting";
import { toast } from "@/hooks/use-toast";
import * as Sentry from "@sentry/react";

export function ErrorTest() {
  const [count, setCount] = useState(0);
  
  const triggerError = () => {
    try {
      // Intentionally cause an error
      throw new Error(`Test error triggered by user (count: ${count})`);
    } catch (error) {
      // Add breadcrumb before reporting
      Sentry.addBreadcrumb({
        category: 'test',
        message: `User triggered test error (count: ${count})`,
        level: 'info'
      });
      
      // Report to Sentry
      ErrorReporting.captureException(error as Error, {
        location: "ErrorTest component",
        count,
        userTriggered: true,
        testMode: true,
      });
      
      // Show to UI for testing purposes
      toast({
        title: "Error Reported",
        description: `Error reported to Sentry: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };
  
  const sendMessage = () => {
    // Add breadcrumb
    Sentry.addBreadcrumb({
      category: 'test',
      message: `User sent test message (count: ${count})`,
      level: 'info'
    });
    
    // Send a test message to Sentry
    ErrorReporting.captureMessage(
      `Test message from user (count: ${count})`,
      { componentName: "ErrorTest", count, testMode: true },
      "info"
    );
    
    // Increment counter to track how many times button was clicked
    setCount(prev => prev + 1);
    
    // Show confirmation
    toast({
      title: "Message Sent",
      description: "Test message sent to Sentry",
      variant: "default",
    });
  };
  
  const startTransaction = () => {
    // Start a custom transaction for performance monitoring
    const transaction = Sentry.startTransaction({
      name: "test-transaction",
      op: "test",
    });
    
    // Simulate some work
    setTimeout(() => {
      // Add a span to the transaction
      const span = transaction.startChild({
        op: "task",
        description: "Test task execution",
      });
      
      // Simulate task completion
      setTimeout(() => {
        span.finish();
        transaction.finish();
        
        toast({
          title: "Transaction Complete",
          description: "Test transaction sent to Sentry",
          variant: "default",
        });
      }, 500);
    }, 100);
    
    // Increment counter and show notification
    setCount(prev => prev + 1);
  };
  
  return (
    <div className="p-4 border border-red-500/20 rounded-md bg-red-950/10 space-y-4">
      <h3 className="text-lg font-medium">Sentry Error Testing</h3>
      <p className="text-sm text-slate-300">
        Use these buttons to test Sentry integration. 
        Count: {count}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="destructive" 
          size="sm"
          onClick={triggerError}
        >
          Trigger Test Error
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={sendMessage}
        >
          Send Test Message
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={startTransaction}
        >
          Test Performance
        </Button>
      </div>
    </div>
  );
}
