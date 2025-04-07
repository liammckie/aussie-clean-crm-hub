
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { createSite, updateSite, deleteSite } from '@/services/site/service';

// Create mock functions for the site services
jest.mock('@/services/site/service', () => ({
  getSites: jest.fn(),
  getSiteById: jest.fn(),
  getClientSites: jest.fn(),
  createSite: jest.fn(),
  updateSite: jest.fn(),
  deleteSite: jest.fn(),
  // Add aliases for backward compatibility
  addSite: jest.fn(),
  editSite: jest.fn(),
  removeSite: jest.fn(),
}));

export function createQueryClientWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    },
  });
  
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  
  return { wrapper, queryClient };
}

export function resetMocks() {
  jest.resetAllMocks();
}
