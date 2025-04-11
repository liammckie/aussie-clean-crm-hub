
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DataMigrationService } from '@/utils/migrationUtils';
import { AppLogger, LogCategory } from '@/utils/logging';
import { toast } from 'sonner';
import { AlertCircle, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

export function AddressMigrationTool() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; count: number } | null>(null);
  
  const handleMigration = async () => {
    try {
      setIsRunning(true);
      setResult(null);
      toast.info("Starting address migration...");
      
      const migratedCount = await DataMigrationService.migrateAllClientAddresses();
      
      setResult({
        success: true,
        message: `Successfully migrated addresses for ${migratedCount} clients`,
        count: migratedCount
      });
      
      AppLogger.info(LogCategory.SYSTEM, `Address migration completed`, { migratedCount });
    } catch (error: any) {
      AppLogger.error(LogCategory.SYSTEM, `Address migration error: ${error.message}`, { error });
      
      setResult({
        success: false,
        message: `Error during address migration: ${error.message}`,
        count: 0
      });
      
      toast.error(`Address migration failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Address Migration Tool
        </CardTitle>
        <CardDescription>
          Migrate client addresses to the unified address system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">
          This tool will migrate all client addresses from the old format to the new unified address system.
          The migration is performed safely and will not delete any existing data.
        </p>
        
        {result && (
          <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
            {result.success ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{result.success ? "Migration Complete" : "Migration Error"}</AlertTitle>
            <AlertDescription>
              {result.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleMigration} 
          disabled={isRunning}
          variant={result?.success ? "outline" : "default"}
        >
          {isRunning ? "Migrating..." : "Start Address Migration"}
        </Button>
      </CardFooter>
    </Card>
  );
}
