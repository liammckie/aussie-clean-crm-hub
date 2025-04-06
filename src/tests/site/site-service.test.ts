
import { describe, expect, it, jest } from '@jest/globals';
import { createSite, getSite } from '@/services/site';
import { SiteStatus } from '@/types/database-schema'; // Use the correct import for SiteStatus

// Mock the Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    then: jest.fn()
  }
}));

describe('Site Service', () => {
  it('creates a new site', async () => {
    // Create mock site data that matches the expected SiteData type
    const mockSiteData = {
      id: '1',
      client_id: '123',
      site_name: 'Test Site',
      site_code: 'TEST001',
      address_line_1: '123 Test Street',
      suburb: 'Testville',
      state: 'Testing',
      postcode: '1234',
      status: 'active' as SiteStatus, // Cast to SiteStatus enum
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      country: 'Australia'
    };

    // Set up the mock response
    const mockResponse = { data: mockSiteData, error: null };
    require('@/integrations/supabase/client').supabase.then.mockImplementation((callback) => callback(mockResponse));

    // Call the service function
    const result = await createSite(mockSiteData);

    // Check if the result is as expected
    expect(result).toEqual(mockSiteData);
    expect(require('@/integrations/supabase/client').supabase.from).toHaveBeenCalledWith('sites');
    expect(require('@/integrations/supabase/client').supabase.insert).toHaveBeenCalled();
  });

  it('gets a site by ID', async () => {
    const mockSite = { id: '123', name: 'Test Site' };
    const mockResponse = { data: mockSite, error: null };
    require('@/integrations/supabase/client').supabase.then.mockImplementation((callback) => callback(mockResponse));

    const result = await getSite('123');

    expect(result).toEqual(mockSite);
    expect(require('@/integrations/supabase/client').supabase.from).toHaveBeenCalledWith('sites');
    expect(require('@/integrations/supabase/client').supabase.select).toHaveBeenCalled();
  });
});
