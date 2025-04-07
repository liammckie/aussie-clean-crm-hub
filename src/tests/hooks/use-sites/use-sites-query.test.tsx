
import { renderHook, waitFor } from '@testing-library/react';
import { useSites } from '@/hooks/use-sites';
import { getSites } from '@/services/site/service';
import { SiteData } from '@/services/site/types';
import { SiteStatus, SiteType } from '@/types/database-schema';
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
