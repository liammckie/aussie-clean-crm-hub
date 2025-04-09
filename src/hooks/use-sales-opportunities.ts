
import { useState, useEffect } from 'react';
import { Opportunity, SalesStage } from '@/types/sales-types';
import { toast } from 'sonner';
import { AppLogger, LogCategory } from '@/utils/logging';

// Sample data for development until connected to backend
const SAMPLE_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    title: 'Office Cleaning Contract - Downtown',
    client_name: 'Acme Corp',
    value: 24000,
    probability: 70,
    expected_close_date: '2025-05-30T00:00:00Z',
    stage: 'QUALIFIED',
    description: 'Weekly cleaning services for 3-floor office building',
    assigned_to: 'Sarah Johnson',
    contact_name: 'John Smith',
    contact_email: 'john@acmecorp.com',
    contact_phone: '(02) 9876 5432',
    created_at: '2025-02-15T00:00:00Z',
    updated_at: '2025-04-01T00:00:00Z',
    priority: 'HIGH'
  },
  {
    id: '2',
    title: 'Medical Center - Weekly Service',
    client_name: 'HealthFirst Clinic',
    value: 36000,
    probability: 50,
    expected_close_date: '2025-06-15T00:00:00Z',
    stage: 'PROPOSAL',
    description: 'Specialized cleaning for medical facility with 10 rooms',
    assigned_to: 'Sarah Johnson',
    contact_name: 'Dr. Lisa Wong',
    contact_email: 'lisa@healthfirst.com',
    created_at: '2025-03-10T00:00:00Z',
    updated_at: '2025-03-25T00:00:00Z',
    priority: 'HIGH'
  },
  {
    id: '3',
    title: 'Retail Store Chain - Monthly Deep Clean',
    client_name: 'RetailPlus',
    value: 48000,
    probability: 30,
    expected_close_date: '2025-07-10T00:00:00Z',
    stage: 'LEAD',
    description: 'Monthly deep cleaning for 5 retail locations',
    assigned_to: 'Mike Wilson',
    created_at: '2025-04-01T00:00:00Z',
    updated_at: '2025-04-01T00:00:00Z',
    priority: 'MEDIUM'
  },
  {
    id: '4',
    title: 'Corporate HQ - Daily Services',
    client_name: 'TechGiant Inc',
    value: 120000,
    probability: 80,
    expected_close_date: '2025-05-20T00:00:00Z',
    stage: 'NEGOTIATION',
    description: 'Daily cleaning services for tech company headquarters',
    assigned_to: 'Mike Wilson',
    contact_name: 'Alex Chen',
    contact_email: 'alex@techgiant.com',
    contact_phone: '(03) 8765 4321',
    created_at: '2025-01-20T00:00:00Z',
    updated_at: '2025-04-05T00:00:00Z',
    priority: 'HIGH'
  },
  {
    id: '5',
    title: 'School District - Summer Cleaning',
    client_name: 'Westside School District',
    value: 85000,
    probability: 90,
    expected_close_date: '2025-05-10T00:00:00Z',
    stage: 'CLOSED_WON',
    description: 'Comprehensive summer cleaning for 8 schools',
    assigned_to: 'Sarah Johnson',
    created_at: '2025-03-05T00:00:00Z',
    updated_at: '2025-04-10T00:00:00Z',
    priority: 'MEDIUM'
  }
];

export function useSalesOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOpportunities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real implementation, we would fetch from Supabase here
      // For now, use sample data with a small delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      AppLogger.info(LogCategory.SALES, "Fetched sales opportunities", { count: SAMPLE_OPPORTUNITIES.length });
      setOpportunities(SAMPLE_OPPORTUNITIES);
    } catch (err) {
      const error = err as Error;
      setError(error);
      AppLogger.error(LogCategory.SALES, "Failed to fetch opportunities", { error });
      toast.error("Failed to load sales opportunities");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const refetchOpportunities = () => {
    fetchOpportunities();
  };

  return {
    opportunities,
    isLoading,
    error,
    refetchOpportunities
  };
}
