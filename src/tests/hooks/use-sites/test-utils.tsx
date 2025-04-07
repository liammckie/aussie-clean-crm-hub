
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { siteService } from '@/services/site';

// Mock the site service methods
jest.mock('@/services/site', () => ({
  siteService: {
    getAllSites: jest.fn(),
    getClientSites: jest.fn(),
    getSiteById: jest.fn(),
    createSite: jest.fn(),
    updateSite: jest.fn(),
    deleteSite: jest.fn()
  }
}));

// Mock Sonner to avoid test errors
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

/**
 * Creates a wrapper with QueryClientProvider for testing hooks
 */
export function createQueryClientWrapper() {
  // Create new QueryClient for each test
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  // Create wrapper component with QueryClientProvider
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
  
  return { wrapper, queryClient };
}

/**
 * Reset mocks before each test
 */
export function resetMocks() {
  jest.clearAllMocks();
}
