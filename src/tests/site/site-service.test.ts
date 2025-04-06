
import { siteService } from '@/services/site/service';
import * as siteApi from '@/services/site/api';
import { SiteData } from '@/services/site/types';

// Mock the site API
jest.mock('@/services/site/api');

describe('Site Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSite: SiteData = {
    client_id: '123e4567-e89b-12d3-a456-426614174000',
    site_name: 'Test Site',
    site_code: 'TEST-001',
    address_line_1: '123 Test St',
    suburb: 'Testville',
    state: 'NSW',
    postcode: '2000',
    status: 'active',
    description: 'Test site description'
  };

  const mockSiteResponse = {
    data: {
      id: '123e4567-e89b-12d3-a456-426614174001',
      ...mockSite,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };

  test('getAllSites - success case', async () => {
    // Mock successful response
    (siteApi.getAllSites as jest.Mock).mockResolvedValueOnce({ 
      data: [mockSiteResponse.data]
    });

    const result = await siteService.getAllSites();

    expect(siteApi.getAllSites).toHaveBeenCalled();
    expect(result).toEqual({ data: [mockSiteResponse.data] });
  });

  test('getClientSites - success case', async () => {
    // Mock successful response
    (siteApi.getClientSites as jest.Mock).mockResolvedValueOnce({ 
      data: [mockSiteResponse.data]
    });

    const clientId = '123e4567-e89b-12d3-a456-426614174000';
    const result = await siteService.getClientSites(clientId);

    expect(siteApi.getClientSites).toHaveBeenCalledWith(clientId);
    expect(result).toEqual({ data: [mockSiteResponse.data] });
  });

  test('getSiteById - success case', async () => {
    // Mock successful response
    (siteApi.getSiteById as jest.Mock).mockResolvedValueOnce(mockSiteResponse);

    const siteId = '123e4567-e89b-12d3-a456-426614174001';
    const result = await siteService.getSiteById(siteId);

    expect(siteApi.getSiteById).toHaveBeenCalledWith(siteId);
    expect(result).toEqual(mockSiteResponse);
  });

  test('createSite - success case', async () => {
    // Mock successful response
    (siteApi.createSite as jest.Mock).mockResolvedValueOnce(mockSiteResponse);
    
    const { id, created_at, updated_at, ...siteData } = mockSiteResponse.data;
    const result = await siteService.createSite(siteData);

    expect(siteApi.createSite).toHaveBeenCalledWith(siteData);
    expect(result).toEqual(mockSiteResponse);
  });

  test('updateSite - success case', async () => {
    // Mock successful response
    (siteApi.updateSite as jest.Mock).mockResolvedValueOnce(mockSiteResponse);

    const siteId = '123e4567-e89b-12d3-a456-426614174001';
    const updateData = { site_name: 'Updated Site Name' };
    
    const result = await siteService.updateSite(siteId, updateData);

    expect(siteApi.updateSite).toHaveBeenCalledWith(siteId, updateData);
    expect(result).toEqual(mockSiteResponse);
  });

  test('deleteSite - success case', async () => {
    // Mock successful response
    (siteApi.deleteSite as jest.Mock).mockResolvedValueOnce({ data: true });

    const siteId = '123e4567-e89b-12d3-a456-426614174001';
    
    const result = await siteService.deleteSite(siteId);

    expect(siteApi.deleteSite).toHaveBeenCalledWith(siteId);
    expect(result).toEqual({ data: true });
  });

  test('getSiteById - error case', async () => {
    // Mock error response
    const errorResponse = {
      category: 'not_found',
      message: 'Site not found'
    };
    
    (siteApi.getSiteById as jest.Mock).mockResolvedValueOnce(errorResponse);

    const siteId = 'non-existent-id';
    const result = await siteService.getSiteById(siteId);

    expect(siteApi.getSiteById).toHaveBeenCalledWith(siteId);
    expect(result).toEqual(errorResponse);
  });
});
