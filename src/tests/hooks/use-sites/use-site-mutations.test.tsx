
import { renderHook, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import { useCreateSite, useUpdateSite, useDeleteSite } from '@/hooks/use-sites';
import { siteService } from '@/services/site';
import { SiteStatus, SiteType } from '@/types/database-schema';
import { createQueryClientWrapper, resetMocks } from './test-utils';

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

      const { wrapper } = createQueryClientWrapper();
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

      const { wrapper } = createQueryClientWrapper();
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

      const { wrapper } = createQueryClientWrapper();
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
