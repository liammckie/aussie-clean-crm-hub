
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorTester } from "@/utils/testing/errorTester";

interface ErrorTestTabProps {
  setStatus: (status: string) => void;
}

export const ErrorTestTab: React.FC<ErrorTestTabProps> = ({ setStatus }) => {
  const [errorMessage, setErrorMessage] = React.useState("Test error message");
  
  const handleGenerateError = () => {
    try {
      setStatus("Generating test error...");
      ErrorTester.generateTestError(errorMessage);
      setStatus("Test error successfully generated and logged!");
    } catch (err) {
      setStatus("Error occurred while testing: " + String(err));
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="error-message">Error Message</Label>
        <Input 
          id="error-message" 
          value={errorMessage} 
          onChange={(e) => setErrorMessage(e.target.value)}
        />
      </div>
      
      <Button onClick={handleGenerateError} variant="secondary">
        Generate Test Error
      </Button>
    </div>
  );
};
