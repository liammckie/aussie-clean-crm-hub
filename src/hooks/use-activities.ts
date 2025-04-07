
import { useQuery } from '@tanstack/react-query';
import { Activity } from '@/types/activity-types';
import { mockActivities } from '@/data/mockActivities';

// This is a placeholder implementation using mock data
// In a real application, this would connect to your API
export const useActivities = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockActivities;
    }
  });
  
  return {
    activities: data || [],
    isLoading,
    error
  };
};

export const useActivity = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['activity', id],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockActivities.find(activity => activity.id === id);
    },
    enabled: !!id
  });
  
  return {
    activity: data,
    isLoading,
    error
  };
};
