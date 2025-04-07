
import { getSiteById, getSites, getClientSites } from '@/services/site/service';
import { SiteData } from '@/services/site/types';
import { mockSupabaseClient } from '../mocks/supabase';
import { createSuccessResponse } from '@/types/api-response';

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: mockSupabaseClient
}));

describe('Site Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSites', () => {
    it('should fetch all sites successfully', async () => {
      // Mock site data
      const mockSites: SiteData[] = [
        {
          id: '1',
          site_name: 'Test Site 1',
          site_code: 'TS1',
          client_id: '123',
          address_line_1: '123 Test St',
          suburb: 'Testville',
          state: 'NSW',
          postcode: '2000',
          status: 'active',
          created_at: '2023-01-01',
          updated_at: '2023-01-01',
        },
        {
          id: '2',
          site_name: 'Test Site 2',
          site_code: 'TS2',
          client_id: '456',
          address_line_1: '456 Test St',
          suburb: 'Testville',
          state: 'VIC',
          postcode: '3000',
          status: 'inactive',
          created_at: '2023-01-02',
          updated_at: '2023-01-02',
        }
      ] as SiteData[];

      // Mock Supabase response
      mockSupabaseClient.from.mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            data: mockSites,
            error: null
          })
        })
      }));

      // Call the function
      const result = await getSites();
      
      // Verify the result
      expect(result).toEqual(createSuccessResponse(mockSites, expect.any(String)));
      
      // Verify Supabase was called correctly
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('sites');
      expect(mockSupabaseClient.from().select).toHaveBeenCalled();
    });

    it('should handle errors when fetching sites fails', async () => {
      // Mock Supabase error response
      const mockError = { message: 'Database error', details: 'Connection failed' };
      mockSupabaseClient.from.mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            data: null,
            error: mockError
          })
        })
      }));

      // Call the function
      const result = await getSites();
      
      // Verify the error is handled correctly
      expect(result).toEqual({
        category: 'database',
        message: expect.stringContaining('Error fetching sites'),
        details: mockError
      });
    });
  });

  // Additional tests for getSiteById, getClientSites, etc.
});
