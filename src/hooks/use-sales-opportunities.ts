
import { useState } from 'react';
import { Opportunity } from '@/types/sales-types';

/**
 * Hook for managing sales opportunities
 */
export function useSalesOpportunities() {
  // Placeholder implementation using local state
  // In a real implementation, this would connect to Supabase or another data store
  const [opportunities, setOpportunities] = useState<Opportunity[]>([
    {
      id: '1',
      title: 'Annual Office Cleaning Contract',
      client_name: 'Acme Corporation',
      value: 75000,
      probability: 60,
      stage: 'PROPOSAL',
      priority: 'HIGH',
      expected_close_date: '2025-05-15T00:00:00Z',
      assigned_to: 'John Smith',
      description: 'Annual office cleaning contract for Acme\'s 3 locations in Sydney',
      contact_name: 'Jane Doe',
      contact_email: 'jane@acmecorp.com',
      contact_phone: '+61 400 123 456',
      created_at: '2025-04-01T00:00:00Z',
      updated_at: '2025-04-05T00:00:00Z'
    },
    {
      id: '2',
      title: 'School Cleaning Tender',
      client_name: 'Department of Education',
      value: 125000,
      probability: 40,
      stage: 'QUALIFIED',
      priority: 'MEDIUM',
      expected_close_date: '2025-06-20T00:00:00Z',
      assigned_to: 'Sarah Johnson',
      description: 'Tender for cleaning services for 5 public schools in the western suburbs',
      contact_name: 'Michael Brown',
      contact_email: 'michael.brown@education.gov.au',
      created_at: '2025-04-02T00:00:00Z',
      updated_at: '2025-04-03T00:00:00Z'
    },
    {
      id: '3',
      title: 'Medical Center Cleaning',
      client_name: 'HealthFirst Medical',
      value: 48000,
      probability: 75,
      stage: 'NEGOTIATION',
      priority: 'MEDIUM',
      expected_close_date: '2025-04-30T00:00:00Z',
      assigned_to: 'John Smith',
      description: 'Specialized cleaning services for medical center with 15 consultation rooms',
      created_at: '2025-03-15T00:00:00Z',
      updated_at: '2025-04-02T00:00:00Z'
    },
    {
      id: '4',
      title: 'Corporate HQ Deep Clean',
      client_name: 'Pacific Finance Group',
      value: 28000,
      probability: 90,
      stage: 'CLOSED_WON',
      priority: 'LOW',
      expected_close_date: '2025-04-10T00:00:00Z',
      assigned_to: 'Sarah Johnson',
      created_at: '2025-03-01T00:00:00Z',
      updated_at: '2025-03-25T00:00:00Z'
    },
    {
      id: '5',
      title: 'Industrial Warehouse Cleaning',
      client_name: 'Global Logistics',
      value: 62000,
      probability: 30,
      stage: 'LEAD',
      priority: 'LOW',
      expected_close_date: '2025-07-01T00:00:00Z',
      assigned_to: 'John Smith',
      created_at: '2025-04-05T00:00:00Z',
      updated_at: '2025-04-05T00:00:00Z'
    },
    {
      id: '6',
      title: 'Hotel Chain Contract',
      client_name: 'Luxury Stays Ltd',
      value: 180000,
      probability: 20,
      stage: 'LEAD',
      priority: 'HIGH',
      expected_close_date: '2025-08-15T00:00:00Z',
      assigned_to: 'Sarah Johnson',
      created_at: '2025-04-07T00:00:00Z',
      updated_at: '2025-04-07T00:00:00Z'
    },
    {
      id: '7',
      title: 'Retail Stores Monthly Cleaning',
      client_name: 'Fashion Outlets Inc',
      value: 36000,
      probability: 10,
      stage: 'CLOSED_LOST',
      priority: 'LOW',
      expected_close_date: '2025-03-30T00:00:00Z',
      assigned_to: 'John Smith',
      created_at: '2025-02-15T00:00:00Z',
      updated_at: '2025-03-30T00:00:00Z'
    }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  
  const createOpportunity = async (opportunity: Partial<Opportunity>): Promise<Opportunity> => {
    setIsLoading(true);
    
    // Create new opportunity with generated ID and timestamps
    const newOpportunity: Opportunity = {
      ...opportunity as Opportunity,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setOpportunities(prev => [...prev, newOpportunity]);
    setIsLoading(false);
    
    return newOpportunity;
  };
  
  const updateOpportunity = async (opportunity: Opportunity): Promise<Opportunity> => {
    setIsLoading(true);
    
    // Update the opportunity with new timestamp
    const updatedOpportunity = {
      ...opportunity,
      updated_at: new Date().toISOString()
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setOpportunities(prev => 
      prev.map(opp => opp.id === opportunity.id ? updatedOpportunity : opp)
    );
    
    setIsLoading(false);
    
    return updatedOpportunity;
  };
  
  const deleteOpportunity = async (id: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setOpportunities(prev => prev.filter(opp => opp.id !== id));
    
    setIsLoading(false);
  };
  
  const refetchOpportunities = async (): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real implementation, this would fetch fresh data
    setIsLoading(false);
  };
  
  return {
    opportunities,
    isLoading,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    refetchOpportunities
  };
}
