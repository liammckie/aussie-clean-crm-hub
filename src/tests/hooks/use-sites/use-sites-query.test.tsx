
import { renderHook, waitFor } from '@testing-library/react';
import { useSites } from '@/hooks/use-sites';
import { siteService } from '@/services/site';
import { SiteData } from '@/services/site/types';
import { SiteStatus, SiteType } from '@/types/database-schema';
import { createQueryClientWrapper, resetMocks } from './test-utils';

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

    (siteService.getAllSites as jest.Mock).mockResolvedValueOnce(mockSites);

    const { wrapper } = createQueryClientWrapper();
    const { result } = renderHook(() => useSites(), { wrapper });

    // Wait for the query to resolve
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Check if data is returned correctly
    expect(result.current.data).toEqual(mockSites);
    expect(siteService.getAllSites).toHaveBeenCalledTimes(1);
  });
});
