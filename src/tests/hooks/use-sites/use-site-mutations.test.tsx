
import { renderHook, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import { useCreateSite, useUpdateSite, useDeleteSite } from '@/hooks/use-sites';
import { createSite, updateSite, deleteSite } from '@/services/site/service';
import { createQueryClientWrapper, resetMocks } from './test-utils';
import { createSuccessResponse } from '@/types/api-response';

// Mock implementation will be provided by test-utils.tsx

describe('Site Mutation Hooks', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('useCreateSite', () => {
    it('creates a new site', async () => {
      const newSite = {
        client_id: '123',
        site_name: 'New Test Site',
        site_code: 'NEW001',
        address_line_1: '123 New Street',
        suburb: 'Newville',
        state: 'NSW',
        postcode: '2000',
        status: 'active',
        site_type: 'office'
      };

      const mockCreatedSite = {
        id: 'new-site-id',
        ...newSite,
        created_at: '2023-01-15',
        updated_at: '2023-01-15'
      };

      const mockResponse = createSuccessResponse(mockCreatedSite, "Site created successfully");
      
      (createSite as jest.Mock).mockResolvedValueOnce(mockResponse);

      const { wrapper } = createQueryClientWrapper();
      const { result } = renderHook(() => useCreateSite(), { wrapper });

      // Execute the mutation
      act(() => {
        result.current.mutate(newSite);
      });

      // Wait for the mutation to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check if mutation was successful
      expect(createSite).toHaveBeenCalledWith(newSite);
      expect(result.current.data).toEqual(mockResponse);
    });
  });

  describe('useUpdateSite', () => {
    it('updates an existing site', async () => {
      const siteId = 'site-id-123';
      const updates = {
        site_name: 'Updated Site Name',
        status: 'inactive'
      };

      const mockUpdatedSite = {
        id: siteId,
        site_name: 'Updated Site Name',
        status: 'inactive',
        updated_at: '2023-01-20'
      };

      const mockResponse = createSuccessResponse(mockUpdatedSite, "Site updated successfully");
      
      (updateSite as jest.Mock).mockResolvedValueOnce(mockResponse);

      const { wrapper } = createQueryClientWrapper();
      const { result } = renderHook(() => useUpdateSite(), { wrapper });

      // Execute the mutation
      act(() => {
        result.current.mutate({ id: siteId, site: updates });
      });

      // Wait for the mutation to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check if mutation was successful
      expect(updateSite).toHaveBeenCalledWith(siteId, updates);
      expect(result.current.data).toEqual(mockResponse);
    });
  });

  describe('useDeleteSite', () => {
    it('deletes a site', async () => {
      const siteId = 'site-id-to-delete';
      
      const mockResponse = createSuccessResponse(true, "Site deleted successfully");
      
      (deleteSite as jest.Mock).mockResolvedValueOnce(mockResponse);

      const { wrapper } = createQueryClientWrapper();
      const { result } = renderHook(() => useDeleteSite(), { wrapper });

      // Execute the mutation
      act(() => {
        result.current.mutate(siteId);
      });

      // Wait for the mutation to complete
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Check if mutation was successful
      expect(deleteSite).toHaveBeenCalledWith(siteId);
      expect(result.current.data).toEqual(mockResponse);
    });
  });
});
