
import { renderHook, waitFor } from '@testing-library/react';
import { useClientSites } from '@/hooks/use-sites';
import { siteService } from '@/services/site';
import { SiteData } from '@/services/site/types';
import { SiteStatus, SiteType } from '@/types/database-schema';
import { createQueryClientWrapper, resetMocks } from './test-utils';

describe('useClientSites Hook', () => {
  beforeEach(() => {
    resetMocks();
  });

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

    const { wrapper } = createQueryClientWrapper();
    const { result } = renderHook(() => useClientSites(clientId), { wrapper });

    // Wait for the query to resolve
    await waitFor(() => expect(result.current.isLoadingSites).toBe(false));

    // Check if data is returned correctly
    expect(result.current.sites).toEqual(mockSites);
    expect(siteService.getClientSites).toHaveBeenCalledWith(clientId);
    expect(siteService.getClientSites).toHaveBeenCalledTimes(1);
  });
});
