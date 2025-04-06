
import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSites } from '@/hooks/use-sites';
import { siteService } from '@/services/site/service';

// Mock dependencies
jest.mock('@/services/site/service');
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useSites Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockClientId = '123e4567-e89b-12d3-a456-426614174000';
  const mockSites = [
    {
      id: 'site-1',
      site_name: 'Test Site 1',
      client_id: mockClientId,
      site_code: 'TEST-001',
      address_line_1: '123 Test St',
      suburb: 'Testville',
      state: 'NSW',
      postcode: '2000',
      status: 'active'
    },
    {
      id: 'site-2',
      site_name: 'Test Site 2',
      client_id: mockClientId,
      site_code: 'TEST-002',
      address_line_1: '456 Test St',
      suburb: 'Testville',
      state: 'NSW',
      postcode: '2000',
      status: 'active'
    }
  ];

  test('should fetch client sites successfully', async () => {
    // Mock successful API response
    (siteService.getClientSites as jest.Mock).mockResolvedValueOnce({
      data: mockSites
    });

    const { result, waitForNextUpdate } = renderHook(() => useSites(mockClientId), {
      wrapper: createWrapper()
    });

    // Initial state should be loading
    expect(result.current.isLoadingSites).toBe(true);
    
    // Wait for the query to complete
    await waitForNextUpdate();
    
    // Validate results
    expect(result.current.isLoadingSites).toBe(false);
    expect(result.current.sites).toEqual(mockSites);
    expect(siteService.getClientSites).toHaveBeenCalledWith(mockClientId);
  });

  test('should handle site creation successfully', async () => {
    // Mock successful API responses
    (siteService.getClientSites as jest.Mock).mockResolvedValue({
      data: mockSites
    });
    
    const newSite = {
      client_id: mockClientId,
      site_name: 'New Test Site',
      site_code: 'TEST-003',
      address_line_1: '789 Test St',
      suburb: 'Testville',
      state: 'NSW',
      postcode: '2000',
      status: 'active'
    };
    
    const createdSite = {
      id: 'site-3',
      ...newSite
    };
    
    (siteService.createSite as jest.Mock).mockResolvedValueOnce({
      data: createdSite
    });

    const { result, waitForNextUpdate } = renderHook(() => useSites(mockClientId), {
      wrapper: createWrapper()
    });
    
    // Wait for the initial query to complete
    await waitForNextUpdate();
    
    // Call the createSite function
    await act(async () => {
      result.current.createSite(newSite);
    });
    
    // Validate toast was called with success message
    expect(toast.success).toHaveBeenCalledWith('Site created successfully!');
    expect(siteService.createSite).toHaveBeenCalledWith(newSite);
  });

  test('should handle site update successfully', async () => {
    // Mock successful API responses
    (siteService.getClientSites as jest.Mock).mockResolvedValue({
      data: mockSites
    });
    
    const siteId = 'site-1';
    const updateData = {
      site_name: 'Updated Site Name'
    };
    
    const updatedSite = {
      id: siteId,
      site_name: 'Updated Site Name',
      client_id: mockClientId
    };
    
    (siteService.updateSite as jest.Mock).mockResolvedValueOnce({
      data: updatedSite
    });

    const { result, waitForNextUpdate } = renderHook(() => useSites(mockClientId), {
      wrapper: createWrapper()
    });
    
    // Wait for the initial query to complete
    await waitForNextUpdate();
    
    // Call the updateSite function
    await act(async () => {
      result.current.updateSite({ id: siteId, data: updateData });
    });
    
    // Validate toast was called with success message
    expect(toast.success).toHaveBeenCalledWith('Site updated successfully!');
    expect(siteService.updateSite).toHaveBeenCalledWith(siteId, updateData);
  });

  test('should handle site deletion successfully', async () => {
    // Mock successful API responses
    (siteService.getClientSites as jest.Mock).mockResolvedValue({
      data: mockSites
    });
    
    const siteId = 'site-1';
    
    (siteService.deleteSite as jest.Mock).mockResolvedValueOnce({
      data: true
    });

    const { result, waitForNextUpdate } = renderHook(() => useSites(mockClientId), {
      wrapper: createWrapper()
    });
    
    // Wait for the initial query to complete
    await waitForNextUpdate();
    
    // Call the deleteSite function
    await act(async () => {
      result.current.deleteSite(siteId);
    });
    
    // Validate toast was called with success message
    expect(toast.success).toHaveBeenCalledWith('Site deleted successfully!');
    expect(siteService.deleteSite).toHaveBeenCalledWith(siteId);
  });

  test('should handle errors when fetching sites', async () => {
    // Mock error API response
    const errorMessage = 'Failed to fetch client sites';
    (siteService.getClientSites as jest.Mock).mockResolvedValueOnce({
      category: 'server',
      message: errorMessage
    });

    const { result, waitForNextUpdate } = renderHook(() => useSites(mockClientId), {
      wrapper: createWrapper()
    });
    
    // Wait for the query to complete
    await waitForNextUpdate();
    
    // Validate error state
    expect(result.current.sitesError).toBeTruthy();
    expect(toast.error).toHaveBeenCalled();
  });
});
