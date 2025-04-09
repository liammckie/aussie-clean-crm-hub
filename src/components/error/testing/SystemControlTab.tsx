
import React from 'react';
import { Button } from "@/components/ui/button";
import { AppLogger, LogCategory } from "@/utils/logging";
import { ErrorReporting } from "@/utils/errorReporting";

interface SystemControlTabProps {
  setStatus: (status: string) => void;
}

export const SystemControlTab: React.FC<SystemControlTabProps> = ({ setStatus }) => {
  const checkInitialization = () => {
    AppLogger.info(LogCategory.SYSTEM, "Checking error reporting initialization");
    setStatus(ErrorReporting.isInitialized ? 
      "Error reporting is initialized" : 
      "Error reporting is NOT initialized");
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Check the initialization status of the error reporting system.
        </p>
        <Button onClick={checkInitialization} variant="outline">
          Check Initialization Status
        </Button>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Toggle error reporting on/off.
        </p>
        <div className="flex space-x-2">
          <Button 
            onClick={() => {
              ErrorReporting.setEnabled(true);
              setStatus("Error reporting enabled");
            }} 
            variant="outline"
            className="flex-1"
          >
            Enable
          </Button>
          <Button 
            onClick={() => {
              ErrorReporting.setEnabled(false);
              setStatus("Error reporting disabled");
            }} 
            variant="outline"
            className="flex-1"
          >
            Disable
          </Button>
        </div>
      </div>
    </div>
  );
};
