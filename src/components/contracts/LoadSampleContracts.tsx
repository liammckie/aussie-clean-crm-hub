
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createSampleContracts } from '@/utils/contractTestData';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { contractService } from '@/services/contract';

interface LoadSampleContractsProps {
  onContractsLoaded: () => void;
}

export function LoadSampleContracts({ onContractsLoaded }: LoadSampleContractsProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch existing clients to use for sample contracts
  const { data: existingClients } = useQuery({
    queryKey: ['clients-basic'],
    queryFn: async () => {
      try {
        // This is a simplified version - in a real app, you'd use a dedicated endpoint
        const response = await fetch('/api/clients/basic');
        if (!response.ok) {
          // For our demo, we'll use mock client IDs if we can't fetch real ones
          return [
            { id: 'c1f0f1a0-5f1a-4f1a-8f1a-1f1a0f1a0f1a' },
            { id: 'c2f0f2a0-5f2a-4f2a-8f2a-2f2a0f2a0f2a' },
            { id: 'c3f0f3a0-5f3a-4f3a-8f3a-3f3a0f3a0f3a' }
          ];
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching clients:', error);
        // Return mock client IDs for the demo
        return [
          { id: 'c1f0f1a0-5f1a-4f1a-8f1a-1f1a0f1a0f1a' },
          { id: 'c2f0f2a0-5f2a-4f2a-8f2a-2f2a0f2a0f2a' },
          { id: 'c3f0f3a0-5f3a-4f3a-8f3a-3f3a0f3a0f3a' }
        ];
      }
    },
    enabled: false, // Don't run on mount
  });
  
  const handleLoadSample = async () => {
    setIsLoading(true);
    try {
      // Check if we have any contracts already
      const existingContracts = await contractService.getAllContracts();
      
      if ('data' in existingContracts && existingContracts.data.length > 0) {
        toast.info('Sample contracts already exist in the database');
        setIsLoading(false);
        return;
      }
      
      // Use mock client IDs if we don't have real ones
      const clientIds = existingClients?.map(client => client.id) || [
        'c1f0f1a0-5f1a-4f1a-8f1a-1f1a0f1a0f1a',
        'c2f0f2a0-5f2a-4f2a-8f2a-2f2a0f2a0f2a',
        'c3f0f3a0-5f3a-4f3a-8f3a-3f3a0f3a0f3a'
      ];
      
      // Create sample contracts
      await createSampleContracts(clientIds, 20);
      
      // Notify parent component
      onContractsLoaded();
      
    } catch (error) {
      console.error('Error loading sample data:', error);
      toast.error('Failed to load sample data');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={handleLoadSample}
      disabled={isLoading}
      size="sm"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading samples...
        </>
      ) : (
        'Load Sample Contracts'
      )}
    </Button>
  );
}
