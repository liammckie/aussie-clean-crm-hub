
import { renderHook, waitFor } from '@testing-library/react';
import { useClientSites } from '@/hooks/use-sites';
import { getClientSites } from '@/services/site/service';
import { SiteData } from '@/services/site/types';
import { createQueryClientWrapper, resetMocks } from './test-utils';
import { createSuccessResponse } from '@/types/api-response';

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
        status: 'active',
        site_type: 'office',
        created_at: '2023-01-01',
        updated_at: '2023-01-01',
        address_line_1: '123 Test St',
        suburb: 'Testville',
        state: 'NSW',
        postcode: '2000',
      },
    ] as SiteData[];

    const mockResponse = createSuccessResponse(mockSites, "Sites fetched successfully");
    
    (getClientSites as jest.Mock).mockResolvedValueOnce(mockResponse);

    const { wrapper } = createQueryClientWrapper();
    const { result } = renderHook(() => useClientSites(clientId), { wrapper });

    // Wait for the query to resolve
    await waitFor(() => expect(result.current.isLoadingSites).toBe(false));

    // Check if data is returned correctly
    expect(result.current.sites).toEqual(mockSites);
    expect(getClientSites).toHaveBeenCalledWith(clientId);
    expect(getClientSites).toHaveBeenCalledTimes(1);
  });
});
