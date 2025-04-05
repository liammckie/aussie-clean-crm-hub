
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { createSampleContracts, getMockContractData } from '@/utils/contractTestData';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, AlertCircle, Info } from 'lucide-react';
import { contractService } from '@/services/contract';
import { ErrorReporting } from '@/utils/errorReporting';
import { AppLogger, LogCategory, Cache, withCache } from '@/utils/logging';

interface LoadSampleContractsProps {
  onContractsLoaded: () => void;
}

export function LoadSampleContracts({ onContractsLoaded }: LoadSampleContractsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0); // Track number of attempts
  
  // Fetch existing clients to use for sample contracts
  const { data: existingClients, error: clientsError, refetch: refetchClients } = useQuery({
    queryKey: ['clients-basic'],
    queryFn: async () => {
      AppLogger.info(LogCategory.CLIENT, 'Fetching clients for sample contracts');
      
      // Try to get clients from cache first
      return await withCache('basic-clients', async () => {
        try {
          // This is a simplified version - in a real app, you'd use a dedicated endpoint
          const response = await fetch('/api/clients/basic');
          
          if (!response.ok) {
            AppLogger.warn(LogCategory.CLIENT, 'Client API returned non-OK response, falling back to mock data');
            // For our demo, we'll use mock client IDs if we can't fetch real ones
            return [
              { id: 'c1f0f1a0-5f1a-4f1a-8f1a-1f1a0f1a0f1a', name: 'Mock Client 1' },
              { id: 'c2f0f2a0-5f2a-4f2a-8f2a-2f2a0f2a0f2a', name: 'Mock Client 2' },
              { id: 'c3f0f3a0-5f3a-4f3a-8f3a-3f3a0f3a0f3a', name: 'Mock Client 3' }
            ];
          }
          
          const clientData = await response.json();
          AppLogger.info(LogCategory.CLIENT, `Retrieved ${clientData.length} clients from API`);
          return clientData;
        } catch (error) {
          AppLogger.error(LogCategory.CLIENT, 'Error fetching clients:', error);
          ErrorReporting.captureException(error instanceof Error ? error : new Error('Client fetch failed'), {
            component: 'LoadSampleContracts',
            operation: 'fetchClients'
          });
          
          // Return mock client IDs for the demo
          AppLogger.info(LogCategory.CLIENT, 'Using mock client data due to error');
          return [
            { id: 'c1f0f1a0-5f1a-4f1a-8f1a-1f1a0f1a0f1a', name: 'Mock Client 1' },
            { id: 'c2f0f2a0-5f2a-4f2a-8f2a-2f2a0f2a0f2a', name: 'Mock Client 2' },
            { id: 'c3f0f3a0-5f3a-4f3a-8f3a-3f3a0f3a0f3a', name: 'Mock Client 3' }
          ];
        }
      }, { ttl: 5 * 60 * 1000, tag: 'clients' }); // Cache for 5 minutes
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  });
  
  // Check existing contracts on mount to determine button state
  const { data: existingContracts } = useQuery({
    queryKey: ['sample-contracts-check'],
    queryFn: async () => {
      try {
        AppLogger.info(LogCategory.CONTRACT, 'Checking for existing contracts');
        
        return await withCache('existing-contracts-check', async () => {
          const response = await contractService.getAllContracts();
          
          if ('category' in response) {
            if (response.category === 'permission') {
              console.log('Permission issue detected when checking contracts');
              return [];
            }
            throw new Error(response.message);
          }
          
          AppLogger.info(LogCategory.CONTRACT, `Found ${response.data.length} existing contracts`);
          return response.data;
        }, { ttl: 60 * 1000, tag: 'contracts' }); // Cache for 1 minute
      } catch (error) {
        AppLogger.error(LogCategory.CONTRACT, 'Error checking for existing contracts:', error);
        // Don't block the UI for this check
        return [];
      }
    },
  });
  
  const hasExistingContracts = existingContracts && existingContracts.length > 0;
  
  const handleLoadSample = async () => {
    setIsLoading(true);
    setError(null);
    setAttempts(prev => prev + 1);
    
    try {
      AppLogger.info(LogCategory.CONTRACT, 'Load sample contracts initiated');
      
      if (!existingClients || existingClients.length === 0) {
        AppLogger.warn(LogCategory.CONTRACT, 'No clients available, refetching...');
        await refetchClients();
        
        if (!existingClients || existingClients.length === 0) {
          throw new Error('No clients available to create sample contracts');
        }
      }
      
      // Use client IDs from fetched data
      const clientIds = existingClients.map(client => client.id);
      AppLogger.info(LogCategory.CONTRACT, `Proceeding with ${clientIds.length} client IDs`);
      
      // Create sample contracts - pass fewer contracts for faster testing
      const success = await createSampleContracts(clientIds, 5);
      
      if (success) {
        // Clear cache for contracts
        Cache.clearByTag('contracts');
        // Notify parent component
        onContractsLoaded();
        AppLogger.info(LogCategory.CONTRACT, 'Sample contracts created successfully');
      } else {
        throw new Error('Sample contract creation failed');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading sample data';
      AppLogger.error(LogCategory.CONTRACT, 'Error in handleLoadSample:', { error: errorMessage });
      setError(errorMessage);
      
      ErrorReporting.captureException(error instanceof Error ? error : new Error(errorMessage), {
        component: 'LoadSampleContracts',
        operation: 'handleLoadSample',
        clientIds: existingClients ? JSON.stringify(existingClients.map(c => c.id)) : 'none'
      });
      
      // Show toast with more helpful message if permission error
      if (errorMessage.includes('permission') || attempts > 0) {
        toast.error('Permission error loading contracts', {
          description: "Try using the 'View Sample Data' option instead"
        });
      } else {
        toast.error('Failed to load sample data', {
          description: errorMessage
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check for permissions issue during rendering
  const hasPermissionIssue = error?.includes('permission') || 
    (attempts > 0 && existingContracts?.length === 0);

  return (
    <div>
      {hasPermissionIssue ? (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleLoadSample}
            disabled={isLoading || hasExistingContracts}
            size="sm"
            className="text-amber-600 border-amber-400"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Info className="mr-2 h-4 w-4" />
                Try Again
              </>
            )}
          </Button>
          <Button 
            variant="default" 
            onClick={() => {
              // Use mock data instead
              const mockData = getMockContractData(8);
              localStorage.setItem('mock-contracts-data', JSON.stringify(mockData));
              toast.success('Loaded sample visualization data', {
                description: "Note: This is for UI testing only and won't persist"
              });
              onContractsLoaded();
            }}
            size="sm"
          >
            View Sample Data
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          onClick={handleLoadSample}
          disabled={isLoading || hasExistingContracts}
          size="sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading samples...
            </>
          ) : hasExistingContracts ? (
            'Samples Already Loaded'
          ) : (
            'Load Sample Contracts'
          )}
        </Button>
      )}
      
      {error && !hasPermissionIssue && (
        <div className="flex items-center text-sm text-destructive mt-2">
          <AlertCircle className="h-4 w-4 mr-1" />
          Error: {error}
        </div>
      )}
      
      {clientsError && !isLoading && (
        <div className="flex items-center text-sm text-amber-600 mt-2">
          <AlertCircle className="h-4 w-4 mr-1" />
          Warning: Using mock clients due to API error
        </div>
      )}
    </div>
  );
}
