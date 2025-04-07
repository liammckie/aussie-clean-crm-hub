
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock the site service
jest.mock('@/services/site/service', () => ({
  getSites: jest.fn(),
  getSiteById: jest.fn(),
  addSite: jest.fn(),
  editSite: jest.fn(),
  removeSite: jest.fn(),
  getClientSites: jest.fn()
}));

export const resetMocks = () => {
  jest.clearAllMocks();
};

export const createQueryClientWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { queryClient, wrapper };
};
