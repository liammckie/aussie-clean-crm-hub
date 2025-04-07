
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createSite, getSiteById } from '@/services/site/service';
import { siteApi } from '@/services/site/api';
import { SiteData } from '@/services/site/types';
import { ApiResponse, isApiSuccess } from '@/types/api-response';

// Mock the site API
jest.mock('@/services/site/api', () => ({
  siteApi: {
    createSite: jest.fn(),
    fetchSiteById: jest.fn(),
  }
}));

describe('Site Service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('createSite', () => {
    it('should create a site and return success response', async () => {
      // Sample site data
      const siteData = {
        site_name: 'Test Site',
        site_code: 'TEST001',
        client_id: '123456',
        address_line_1: '123 Test St',
        address_line_2: 'Suite 100',
        suburb: 'Testville',
        state: 'NSW',
        postcode: '2000',
        country: 'Australia',
        site_contact_name: 'John Test',
        site_contact_email: 'john@test.com',
        site_contact_phone: '0400000000',
        site_contact_mobile: '0400000000',
        status: 'active',
        site_type: 'retail',
      };

      // Mock the successful response
      const mockSite: SiteData = {
        id: '1',
        ...siteData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      (siteApi.createSite as jest.Mock).mockResolvedValue({
        data: mockSite,
        message: 'Site created successfully'
      });

      // Call the service
      const result = await createSite(siteData);

      // Verify siteApi.createSite was called with the site data
      expect(siteApi.createSite).toHaveBeenCalledWith(siteData);

      // Verify the service returns a successful response using type guard
      expect(isApiSuccess(result)).toBe(true);
      
      if (isApiSuccess(result)) {
        expect(result.data).toEqual(mockSite);
        expect(result.message).toEqual('Site created successfully');
      }
    });
  });

  describe('getSiteById', () => {
    it('should retrieve a site by ID and return success response', async () => {
      // Sample site data
      const mockSite: SiteData = {
        id: '1',
        site_name: 'Test Site',
        site_code: 'TEST001',
        client_id: '123456',
        address_line_1: '123 Test St',
        suburb: 'Testville',
        state: 'NSW',
        postcode: '2000',
        country: 'Australia',
        status: 'active',
        site_type: 'retail',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      (siteApi.fetchSiteById as jest.Mock).mockResolvedValue({
        data: mockSite,
        message: 'Site fetched successfully'
      });

      // Call the service
      const result = await getSiteById('1');

      // Verify siteApi.fetchSiteById was called with the site ID
      expect(siteApi.fetchSiteById).toHaveBeenCalledWith('1');

      // Verify the service returns a successful response using type guard
      expect(isApiSuccess(result)).toBe(true);
      
      if (isApiSuccess(result)) {
        expect(result.data).toEqual(mockSite);
        expect(result.message).toEqual('Site retrieved successfully');
      }
    });
  });
});
