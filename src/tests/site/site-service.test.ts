
import { describe, expect, it, jest } from '@jest/globals';
import { createMockSupabaseClient } from '../mocks/supabaseMock';
import { SiteStatus, SiteType } from '@/types/database-schema';
import { SiteInsertData } from '@/services/site/types';
import { addSite, getSites, getSiteById, editSite, removeSite } from '@/services/site/service';

// Mock the supabase client
jest.mock('@/integrations/supabase/client', () => {
  const mockClient = createMockSupabaseClient();
  return {
    supabase: mockClient,
    isAuthenticated: jest.fn().mockReturnValue(Promise.resolve(true))
  };
});

// Import the API module that uses the mocked client
import * as siteApi from '@/services/site/api';

describe('Site Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new site', async () => {
    // Create mock site data that matches the expected SiteInsertData type
    const mockSiteData: SiteInsertData = {
      client_id: '123',
      site_name: 'Test Site',
      site_code: 'TEST001',
      address_line_1: '123 Test Street',
      suburb: 'Testville',
      state: 'Testing',
      postcode: '1234',
      status: SiteStatus.ACTIVE,
      // Add the rest of the optional fields
      address_line_2: undefined,
      site_contact_name: undefined,
      site_contact_email: undefined,
      site_contact_phone: undefined,
      notes: undefined,
      region: undefined,
      induction_required: false,
      site_type: undefined,
      square_meters: undefined,
      description: undefined
    };

    const mockResponse = {
      data: {
        id: '1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...mockSiteData
      },
      message: "Site created successfully"
    };

    // Mock the api createSite function
    jest.spyOn(siteApi, 'createSite').mockResolvedValue(mockResponse);
    
    // Call the service function
    const result = await addSite(mockSiteData);

    // Check if the result is as expected
    expect(result).toHaveProperty('data');
    expect(result.data).toEqual(mockResponse.data);
    expect(siteApi.createSite).toHaveBeenCalledWith(mockSiteData);
  });

  it('gets a site by ID', async () => {
    const mockSite = { 
      id: '123', 
      site_name: 'Test Site',
      client_id: '456',
      address_line_1: '123 Test St',
      suburb: 'Test Suburb',
      state: 'Test State',
      postcode: '1234',
      status: SiteStatus.ACTIVE,
      site_type: SiteType.OFFICE,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const mockResponse = {
      data: mockSite,
      message: "Site fetched successfully"
    };

    jest.spyOn(siteApi, 'fetchSiteById').mockResolvedValue(mockResponse);
    
    const result = await getSiteById('123');

    expect(result).toHaveProperty('data');
    expect(result.data).toEqual(mockSite);
    expect(siteApi.fetchSiteById).toHaveBeenCalledWith('123');
  });
});
