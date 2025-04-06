
import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSites, useClientSites, useCreateSite, useUpdateSite, useDeleteSite } from '@/hooks/use-sites';
import { siteService } from '@/services/site';
import { SiteStatus, SiteType } from '@/types/database-schema';
import { SiteData, SiteInsertData } from '@/services/site/types';

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

describe('Site Hooks', () => {
  let queryClient: QueryClient;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Create new QueryClient for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    
    // Create wrapper component with QueryClientProvider
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  });

  describe('useSites', () => {
    it('fetches all sites', async () => {
      const mockSites = [
        {
          id: '1',
          site_name: 'Site 1',
          client_id: '123',
          status: SiteStatus.ACTIVE,
          site_type: SiteType.OFFICE,
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
        },
        {
          id: '2',
          site_name: 'Site 2',
          client_id: '456',
          status: SiteStatus.INACTIVE,
          site_type: SiteType.WAREHOUSE,
          created_at: '2023-01-02',
          updated_at: '2023-01-02',
        },
      ] as SiteData[];

      (siteService.getAllSites as jest.Mock).mockResolvedValueOnce(mockSites);

      const { result, waitForNextUpdate } = renderHook(() => useSites(), { wrapper });

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      // Wait for the query to resolve
      await waitForNextUpdate();

      // Check if data is returned correctly
      expect(result.current.data).toEqual(mockSites);
      expect(siteService.getAllSites).toHaveBeenCalledTimes(1);
    });
  });

  describe('useClientSites', () => {
    it('fetches sites for a specific client', async () => {
      const clientId = '123';
      const mockSites = [
        {
          id: '1',
          site_name: 'Client Site 1',
          client_id: clientId,
          status: SiteStatus.ACTIVE,
          site_type: SiteType.OFFICE,
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
        },
      ] as SiteData[];

      (siteService.getClientSites as jest.Mock).mockResolvedValueOnce(mockSites);

      const { result, waitForNextUpdate } = renderHook(() => useClientSites(clientId), { wrapper });

      // Wait for the query to resolve
      await waitForNextUpdate();

      // Check if data is returned correctly
      expect(result.current.sites).toEqual(mockSites);
      expect(siteService.getClientSites).toHaveBeenCalledWith(clientId);
      expect(siteService.getClientSites).toHaveBeenCalledTimes(1);
    });
  });

  describe('useCreateSite', () => {
    it('creates a new site', async () => {
      const newSite: SiteInsertData = {
        client_id: '123',
        site_name: 'New Test Site',
        site_code: 'NEW001',
        address_line_1: '123 New Street',
        suburb: 'Newville',
        state: 'NSW',
        postcode: '2000',
        status: SiteStatus.ACTIVE,
        site_type: SiteType.OFFICE
      };

      const mockCreatedSite = {
        id: 'new-site-id',
        ...newSite,
        created_at: '2023-01-15',
        updated_at: '2023-01-15'
      };

      (siteService.createSite as jest.Mock).mockResolvedValueOnce(mockCreatedSite);

      const { result } = renderHook(() => useCreateSite(), { wrapper });

      // Execute the mutation
      act(() => {
        result.current.mutate(newSite);
      });

      // Wait for the mutation to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check if mutation was successful
      expect(siteService.createSite).toHaveBeenCalledWith(newSite);
      expect(result.current.data).toEqual(mockCreatedSite);
    });
  });

  describe('useUpdateSite', () => {
    it('updates an existing site', async () => {
      const siteId = 'site-id-123';
      const updates = {
        site_name: 'Updated Site Name',
        status: SiteStatus.INACTIVE
      };

      const mockUpdatedSite = {
        id: siteId,
        site_name: 'Updated Site Name',
        status: SiteStatus.INACTIVE,
        updated_at: '2023-01-20'
      };

      (siteService.updateSite as jest.Mock).mockResolvedValueOnce(mockUpdatedSite);

      const { result } = renderHook(() => useUpdateSite(), { wrapper });

      // Execute the mutation
      act(() => {
        result.current.mutate({ siteId, siteData: updates });
      });

      // Wait for the mutation to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check if mutation was successful
      expect(siteService.updateSite).toHaveBeenCalledWith(siteId, updates);
      expect(result.current.data).toEqual(mockUpdatedSite);
    });
  });

  describe('useDeleteSite', () => {
    it('deletes a site', async () => {
      const siteId = 'site-id-to-delete';
      
      (siteService.deleteSite as jest.Mock).mockResolvedValueOnce(true);

      const { result } = renderHook(() => useDeleteSite(), { wrapper });

      // Execute the mutation
      act(() => {
        result.current.mutate(siteId);
      });

      // Wait for the mutation to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check if mutation was successful
      expect(siteService.deleteSite).toHaveBeenCalledWith(siteId);
      expect(result.current.data).toBe(true);
    });
  });
});
