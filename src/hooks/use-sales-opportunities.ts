
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Opportunity } from '@/types/sales-types';
import { AppLogger, LogCategory } from '@/utils/logging';

// Mock data for opportunities
const initialOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Office Building Cleaning Contract',
    client_name: 'ABC Corporation',
    description: 'Regular cleaning services for corporate headquarters',
    value: 25000,
    probability: 75,
    stage: 'QUALIFIED',
    priority: 'HIGH',
    expected_close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_to: 'Jane Smith',
    contact_name: 'John Doe',
    contact_email: 'john.doe@example.com',
    contact_phone: '+61 400 123 456',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Shopping Mall Cleaning Service',
    client_name: 'Retail Properties Ltd',
    value: 45000,
    probability: 50,
    stage: 'PROPOSAL',
    priority: 'MEDIUM',
    expected_close_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    assigned_to: 'Mark Johnson',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function useSalesOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetchOpportunities = useCallback(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setOpportunities(initialOpportunities);
      setIsLoading(false);
    }, 500);
  }, []);

  const createOpportunity = useCallback(async (opportunity: Opportunity) => {
    setIsLoading(true);
    try {
      AppLogger.info(LogCategory.SALES, 'Creating new opportunity', { opportunity });
      
      // In a real app, this would be an API call
      const newOpportunity = {
        ...opportunity,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setOpportunities(current => [...current, newOpportunity]);
      toast.success('Opportunity created');
      return newOpportunity;
    } catch (error) {
      const err = error as Error;
      AppLogger.error(LogCategory.SALES, `Error creating opportunity: ${err.message}`, { error });
      toast.error(`Failed to create opportunity: ${err.message}`);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOpportunity = useCallback(async (opportunity: Opportunity) => {
    setIsLoading(true);
    try {
      AppLogger.info(LogCategory.SALES, 'Updating opportunity', { opportunityId: opportunity.id });
      
      // In a real app, this would be an API call
      const updatedOpportunity = {
        ...opportunity,
        updated_at: new Date().toISOString()
      };
      
      setOpportunities(current => 
        current.map(item => item.id === opportunity.id ? updatedOpportunity : item)
      );
      
      toast.success('Opportunity updated');
      return updatedOpportunity;
    } catch (error) {
      const err = error as Error;
      AppLogger.error(LogCategory.SALES, `Error updating opportunity: ${err.message}`, { error });
      toast.error(`Failed to update opportunity: ${err.message}`);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteOpportunity = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      AppLogger.info(LogCategory.SALES, 'Deleting opportunity', { opportunityId: id });
      
      // In a real app, this would be an API call
      setOpportunities(current => current.filter(item => item.id !== id));
      
      toast.success('Opportunity deleted');
      return true;
    } catch (error) {
      const err = error as Error;
      AppLogger.error(LogCategory.SALES, `Error deleting opportunity: ${err.message}`, { error });
      toast.error(`Failed to delete opportunity: ${err.message}`);
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    opportunities,
    isLoading,
    error,
    refetchOpportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity
  };
}
