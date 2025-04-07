
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services';
import { contractService } from '@/services/contract';
import { DatabaseZap } from 'lucide-react';
import { isApiError } from '@/types/api-response';

export interface LoadSampleContractsProps {
  onContractsLoaded: () => void;
}

export function LoadSampleContracts({ onContractsLoaded }: LoadSampleContractsProps) {
  // Fetch clients first to ensure we have valid client IDs
  const { data: clientsResponse } = useQuery({
    queryKey: ['load-sample-clients'],
    queryFn: async () => {
      return await clientService.getAllClients();
    },
    enabled: true,
    staleTime: 60000,
  });

  const handleLoadSample = async () => {
    try {
      // Check if we have clients
      if (!clientsResponse || isApiError(clientsResponse) || !clientsResponse.data || clientsResponse.data.length === 0) {
        toast.error('Cannot load sample contracts: No clients available. Please create a client first.');
        return;
      }

      const clients = clientsResponse.data;
      
      // Create a few sample contracts with valid client IDs
      const sampleContracts = [
        {
          contract_name: 'Office Cleaning Services',
          contract_code: `CNT-${Math.floor(1000 + Math.random() * 9000)}`,
          client_id: clients[0].id, // Use first client's ID
          service_type: 'commercial_cleaning',
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          is_ongoing: false,
          description: 'Regular commercial cleaning services for office premises',
          billing_frequency: 'monthly',
          total_weekly_value: 1250,
          total_monthly_value: 5000,
          total_annual_value: 60000
        },
        {
          contract_name: 'Waste Management',
          contract_code: `CNT-${Math.floor(1000 + Math.random() * 9000)}`,
          client_id: clients.length > 1 ? clients[1].id : clients[0].id, // Use second client if available, otherwise first
          service_type: 'waste_management',
          status: 'active',
          start_date: new Date().toISOString().split('T')[0],
          is_ongoing: true,
          description: 'Monthly waste collection and disposal services',
          billing_frequency: 'monthly',
          total_weekly_value: 780,
          total_monthly_value: 3120,
          total_annual_value: 37440
        }
      ];

      let successCount = 0;

      // Create contracts one by one
      for (const contract of sampleContracts) {
        const result = await contractService.createContract(contract);
        if (!isApiError(result)) {
          successCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully created ${successCount} sample contracts`);
        onContractsLoaded();
      } else {
        toast.error('Failed to create sample contracts.');
      }
    } catch (error) {
      console.error('Error creating sample contracts:', error);
      toast.error(`Error creating sample contracts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleLoadSample}
      className="flex items-center gap-2"
    >
      <DatabaseZap className="h-4 w-4" />
      Load Sample Data
    </Button>
  );
}
