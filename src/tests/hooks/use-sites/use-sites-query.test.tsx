
import { renderHook, waitFor } from '@testing-library/react';
import { useSites } from '@/hooks/use-sites';
import { getSites } from '@/services/site/service';
import { SiteData } from '@/services/site/types';
import { createQueryClientWrapper, resetMocks } from './test-utils';
import { createSuccessResponse } from '@/types/api-response';

describe('useSites Hook', () => {
  beforeEach(() => {
    resetMocks();
  });

  it('fetches all sites', async () => {
    const mockSites = [
      {
        id: '1',
        site_name: 'Site 1',
        client_id: '123',
        status: 'active',
        site_type: 'office',
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
        address_line_1: '123 Test St',
        suburb: 'Testville',
        state: 'NSW',
        postcode: '2000',
      },
      {
        id: '2',
        site_name: 'Site 2',
        client_id: '456',
        status: 'inactive',
        site_type: 'warehouse',
        created_at: '2023-01-02',
        updated_at: '2023-01-02',
        address_line_1: '456 Test St',
        suburb: 'Testville',
        state: 'NSW',
        postcode: '2000',
      },
    ] as SiteData[];

    const mockResponse = createSuccessResponse(mockSites, "Sites fetched successfully");
    
    (getSites as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { wrapper } = createQueryClientWrapper();
    const { result } = renderHook(() => useSites(), { wrapper });

    // Wait for the query to resolve
    await waitFor(() => expect(result.current.isLoadingSites).toBe(false));

    // Check if data is returned correctly
    expect(result.current.sites).toEqual(mockSites);
    expect(getSites).toHaveBeenCalledTimes(1);
  });
});
