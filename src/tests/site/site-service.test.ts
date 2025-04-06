
import { describe, expect, it, jest } from '@jest/globals';
import { createMockSupabaseClient } from '../mocks/supabaseMock';
import { SiteStatus, SiteType } from '@/types/database-schema';
import { SiteInsertData } from '@/services/site/types';

// Mock the supabase client
jest.mock('@/integrations/supabase/client', () => {
  const mockClient = createMockSupabaseClient();
  return {
    supabase: mockClient,
    isAuthenticated: jest.fn().mockReturnValue(Promise.resolve(true))
  };
});

// Create a mock for the site service
jest.mock('@/services/site', () => ({
  siteService: {
    createSite: jest.fn(),
    getSite: jest.fn(),
    getSiteById: jest.fn(),
    getAllSites: jest.fn(),
    getClientSites: jest.fn(),
    updateSite: jest.fn(),
    deleteSite: jest.fn()
  }
}));

// Import the mocked service
import { siteService } from '@/services/site';

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
      // Add the rest of the optional fields with default values
      address_line_2: null,
      site_contact_name: null,
      site_contact_email: null,
      site_contact_phone: null,
      notes: null,
      region: null,
      induction_required: false,
      site_type: null,
      square_meters: null,
      description: null
    };

    const mockResponse = {
      id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...mockSiteData
    };

    // Set up the mock to return the mock response
    (siteService.createSite as jest.Mock).mockReturnValue(Promise.resolve(mockResponse));
    
    // Call the service function
    const result = await siteService.createSite(mockSiteData);

    // Check if the result is as expected
    expect(result).toEqual(mockResponse);
    expect(siteService.createSite).toHaveBeenCalledWith(mockSiteData);
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

    (siteService.getSite as jest.Mock).mockReturnValue(Promise.resolve(mockSite));
    
    const result = await siteService.getSite('123');

    expect(result).toEqual(mockSite);
    expect(siteService.getSite).toHaveBeenCalledWith('123');
  });
});
