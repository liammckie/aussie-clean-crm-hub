
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getSites, getSiteById, addSite, editSite, removeSite, getClientSites } from '@/services/site/service';

// Mock the site service
jest.mock('@/services/site/service', () => ({
  getSites: jest.fn(),
  getSiteById: jest.fn(),
  addSite: jest.fn(),
  editSite: jest.fn(),
  removeSite: jest.fn(),
  getClientSites: jest.fn()
}));

// Mock Sonner to avoid test errors
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
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

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return { queryClient, wrapper };
};

