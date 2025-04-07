
// Mock Supabase client for testing
export const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  upsert: jest.fn().mockReturnThis(),
  match: jest.fn().mockReturnThis(),
  returns: jest.fn().mockReturnThis(),
  data: null,
  error: null,
};

// Export the mock so tests can use it
export const mockSupabase = {
  supabase: mockSupabaseClient
};
