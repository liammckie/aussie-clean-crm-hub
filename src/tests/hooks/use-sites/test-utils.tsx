
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

// Mock services
export const getSites = jest.fn();
export const getSiteById = jest.fn();
export const getClientSites = jest.fn();
export const createSite = jest.fn();
export const updateSite = jest.fn();
export const deleteSite = jest.fn();

jest.mock('@/services/site/service', () => ({
  getSites,
  getSiteById,
  getClientSites,
  createSite,
  updateSite,
  deleteSite
}));

// Create a wrapper for testing components that use React Query
export function createQueryClientWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { wrapper, queryClient };
}

// Reset all mocks between tests
export function resetMocks() {
  getSites.mockReset();
  getSiteById.mockReset();
  getClientSites.mockReset();
  createSite.mockReset();
  updateSite.mockReset();
  deleteSite.mockReset();
}
