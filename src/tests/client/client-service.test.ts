
import { clientApi } from '@/services/client/api';
import { supabase } from '@/integrations/supabase/client';
import { ClientFormData } from '@/services/client/types';

// Mock the Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn()
  },
  isAuthenticated: jest.fn().mockResolvedValue(true)
}));

describe('Client API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockClient: ClientFormData = {
    business_name: 'Test Business',
    trading_name: 'Test Trading Name',
    abn: '12345678901',
    status: 'Active',
    address_line_1: '123 Test St',
    suburb: 'Testville',
    state: 'NSW',
    postcode: '2000',
    phone: '0412345678',
    address: '123 Test St, Testville'
  };

  const mockClientResponse = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    ...mockClient,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  test('fetchAllClients - success case', async () => {
    // Mock successful response
    (supabase.single as jest.Mock).mockResolvedValueOnce({ 
      data: [mockClientResponse], 
      error: null 
    });

    const result = await clientApi.fetchAllClients();

    expect(supabase.from).toHaveBeenCalledWith('clients');
    expect(supabase.select).toHaveBeenCalledWith('*');
    expect(result).toEqual({ data: [mockClientResponse], error: null });
  });

  test('fetchAllClients - error case', async () => {
    // Mock error response
    (supabase.single as jest.Mock).mockResolvedValueOnce({ 
      data: null, 
      error: { message: 'Database error' } 
    });

    const result = await clientApi.fetchAllClients();

    expect(result.error).toBeTruthy();
    expect(result.error?.message).toContain('Failed to fetch clients');
  });

  test('createClient - success case', async () => {
    // Mock successful response
    (supabase.single as jest.Mock).mockResolvedValueOnce({ 
      data: mockClientResponse, 
      error: null 
    });

    const result = await clientApi.createClient(mockClient);

    expect(supabase.from).toHaveBeenCalledWith('clients');
    expect(supabase.insert).toHaveBeenCalledWith(mockClient);
    expect(result).toEqual({ data: mockClientResponse, error: null });
  });

  test('createClient - validation error', async () => {
    // Mock validation error
    (supabase.single as jest.Mock).mockResolvedValueOnce({ 
      data: null, 
      error: { 
        message: 'Invalid phone format',
        code: '23514' 
      } 
    });

    const invalidClient = {
      ...mockClient,
      phone: 'not-a-phone-number'
    };

    const result = await clientApi.createClient(invalidClient);

    expect(result.error).toBeTruthy();
    expect(result.error?.message).toContain('Failed to create client');
  });

  test('updateClient - success case', async () => {
    // Mock successful response
    (supabase.single as jest.Mock).mockResolvedValueOnce({ 
      data: mockClientResponse, 
      error: null 
    });

    const clientId = '123e4567-e89b-12d3-a456-426614174000';
    const updateData = { business_name: 'Updated Business Name' };
    
    const result = await clientApi.updateClient(clientId, updateData);

    expect(supabase.from).toHaveBeenCalledWith('clients');
    expect(supabase.update).toHaveBeenCalledWith(updateData);
    expect(supabase.eq).toHaveBeenCalledWith('id', clientId);
    expect(result).toEqual({ data: mockClientResponse, error: null });
  });

  test('deleteClient - success case', async () => {
    // Mock successful response
    (supabase.single as jest.Mock).mockResolvedValueOnce({ 
      data: null, 
      error: null 
    });

    const clientId = '123e4567-e89b-12d3-a456-426614174000';
    
    const result = await clientApi.deleteClient(clientId);

    expect(supabase.from).toHaveBeenCalledWith('clients');
    expect(supabase.delete).toHaveBeenCalled();
    expect(supabase.eq).toHaveBeenCalledWith('id', clientId);
    expect(result.success).toBeTruthy();
  });
});
