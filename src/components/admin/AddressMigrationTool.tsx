
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DataMigrationService } from '@/utils/migrationUtils';
import { AppLogger, LogCategory } from '@/utils/logging';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function AddressMigrationTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [clientsProcessed, setClientsProcessed] = useState(0);
  const [sitesProcessed, setSitesProcessed] = useState(0);
  const [totalEntities, setTotalEntities] = useState(0);
  
  const runMigration = async () => {
    try {
      setIsLoading(true);
      setMigrationStatus('running');
      setStatusMessage('Starting address migration...');
      setProgress(0);
      
      // Migrate client addresses
      setStatusMessage('Migrating client addresses...');
      const clientsMigrated = await DataMigrationService.migrateAllClientAddresses();
      setClientsProcessed(clientsMigrated);
      setProgress(33);
      
      // Migrate site addresses
      setStatusMessage('Migrating site addresses...');
      const sitesMigrated = await DataMigrationService.migrateAllSiteAddresses();
      setSitesProcessed(sitesMigrated);
      setProgress(66);
      
      // Future: Migrate supplier addresses
      setStatusMessage('Completing migration...');
      setProgress(100);
      
      // Set success state
      setMigrationStatus('success');
      setStatusMessage(`Migration completed: ${clientsMigrated} clients and ${sitesMigrated} sites processed`);
      setTotalEntities(clientsMigrated + sitesMigrated);
      
      AppLogger.info(LogCategory.SYSTEM, 'Address migration completed successfully', {
        clientsMigrated,
        sitesMigrated,
        totalEntities: clientsMigrated + sitesMigrated
      });
    } catch (error: any) {
      setMigrationStatus('error');
      setStatusMessage(`Error during migration: ${error.message}`);
      AppLogger.error(LogCategory.SYSTEM, `Error during address migration: ${error.message}`, { error });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Migration Tool</CardTitle>
        <CardDescription>
          Migrate existing address data to the unified address system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {migrationStatus === 'running' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">{statusMessage}</div>
            <Progress value={progress} className="h-2 w-full" />
          </div>
        )}
        
        {migrationStatus === 'success' && (
          <Alert variant="default" className="border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>Migration Completed</AlertTitle>
            <AlertDescription>
              Successfully migrated address data for {totalEntities} entities.
              <ul className="mt-2 list-disc pl-5">
                <li>Clients processed: {clientsProcessed}</li>
                <li>Sites processed: {sitesProcessed}</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        {migrationStatus === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Migration Failed</AlertTitle>
            <AlertDescription>{statusMessage}</AlertDescription>
          </Alert>
        )}
        
        {migrationStatus === 'idle' && (
          <p className="text-sm text-muted-foreground">
            This tool will migrate existing address data from various entity tables to the unified address system.
            This includes client addresses, site addresses, and potentially other entity types.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={runMigration} 
          disabled={isLoading || migrationStatus === 'running'} 
          className="w-full"
        >
          {isLoading ? 'Migrating...' : 'Start Migration'}
        </Button>
      </CardFooter>
    </Card>
  );
}
