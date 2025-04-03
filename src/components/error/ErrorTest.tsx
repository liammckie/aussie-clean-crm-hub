
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ErrorReporting } from "@/utils/errorReporting";

export function ErrorTest() {
  const [count, setCount] = useState(0);
  
  const triggerError = () => {
    try {
      // Intentionally cause an error
      throw new Error(`Test error triggered by user (count: ${count})`);
    } catch (error) {
      // Report to Sentry
      ErrorReporting.captureException(error as Error, {
        location: "ErrorTest component",
        count,
        userTriggered: true,
      });
      
      // Show to UI for testing purposes
      alert(`Error reported to Sentry: ${(error as Error).message}`);
    }
  };
  
  const sendMessage = () => {
    // Send a test message to Sentry
    ErrorReporting.captureMessage(
      `Test message from user (count: ${count})`,
      { componentName: "ErrorTest", count },
      "info"
    );
    
    // Increment counter to track how many times button was clicked
    setCount(prev => prev + 1);
    
    // Show confirmation
    alert("Test message sent to Sentry");
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
      </div>
    </div>
  );
}
