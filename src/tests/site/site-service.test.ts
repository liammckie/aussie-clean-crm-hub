
import { describe, expect, it, jest } from '@jest/globals';
import { createMockSupabaseClient } from '../mocks/supabaseMock';

// Define SiteStatus enum
enum SiteStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}

// Mock the service module
jest.mock('@/services/site', () => ({
  createSite: jest.fn(),
  getSite: jest.fn()
}));

// Import mocked functions
import { createSite, getSite } from '@/services/site';

// Mock the database schema module
jest.mock('@/types/database-schema', () => ({
  SiteStatus: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending'
  }
}));

// Mock the Supabase client
jest.mock('@/integrations/supabase/client', () => {
  const mockClient = createMockSupabaseClient();
  return {
    supabase: mockClient
  };
});

// Import the mocked supabase client
const { supabase } = jest.requireMock('@/integrations/supabase/client');

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
      status: SiteStatus.ACTIVE, // Use the enum
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      country: 'Australia'
    };

    // Set up the mock response
    supabase.data = { data: mockSiteData, error: null };
    
    // Mock implementation
    (createSite as jest.Mock).mockResolvedValue(mockSiteData);

    // Call the service function
    const result = await createSite(mockSiteData);

    // Check if the result is as expected
    expect(result).toEqual(mockSiteData);
    expect(createSite).toHaveBeenCalledWith(mockSiteData);
  });

  it('gets a site by ID', async () => {
    const mockSite = { id: '123', name: 'Test Site' };
    supabase.data = { data: mockSite, error: null };
    
    // Mock implementation
    (getSite as jest.Mock).mockResolvedValue(mockSite);

    const result = await getSite('123');

    expect(result).toEqual(mockSite);
    expect(getSite).toHaveBeenCalledWith('123');
  });
});
