
import { describe, expect, it, jest } from '@jest/globals';
import { createMockSupabaseClient } from '../mocks/supabaseMock';
import { SiteStatus, SiteType } from '@/types/database-schema';

// Mock the supabase client
jest.mock('@/integrations/supabase/client', () => {
  const mockClient = createMockSupabaseClient();
  return {
    supabase: mockClient,
    isAuthenticated: jest.fn().mockResolvedValue(true)
  };
});

// Import the mocked supabase client
const { supabase } = jest.requireMock('@/integrations/supabase/client');

// Import the siteService after mocking
import { siteService } from '@/services/site';
import { SiteData } from '@/services/site/types';

describe('Site Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new site', async () => {
    // Create mock site data that matches the expected SiteData type
    const mockSiteData: Partial<SiteData> = {
      client_id: '123',
      site_name: 'Test Site',
      site_code: 'TEST001',
      address_line_1: '123 Test Street',
      suburb: 'Testville',
      state: 'Testing',
      postcode: '1234',
      status: SiteStatus.ACTIVE, 
      country: 'Australia'
    };

    const mockResponse = {
      id: '1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...mockSiteData
    };

    // Set up the mock to return the mock response
    jest.spyOn(supabase, 'from').mockReturnValue({
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: mockResponse, error: null })
        })
      })
    } as any);
    
    // Call the service function
    const result = await siteService.createSite(mockSiteData as any);

    // Check if the result is as expected
    expect(result).toEqual(mockResponse);
    expect(supabase.from).toHaveBeenCalledWith('sites');
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

    jest.spyOn(supabase, 'from').mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: mockSite, error: null })
        })
      })
    } as any);
    
    const result = await siteService.getSite('123');

    expect(result).toEqual(mockSite);
    expect(supabase.from).toHaveBeenCalledWith('sites');
  });
});
