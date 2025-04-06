
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a mock Supabase client for testing
 * This implements the methods used in our tests with proper TypeScript structure
 */
export const createMockSupabaseClient = () => {
  const mockClient = {
    from: jest.fn(() => mockClient),
    select: jest.fn(() => mockClient),
    single: jest.fn(() => mockClient),
    eq: jest.fn(() => mockClient),
    insert: jest.fn(() => mockClient),
    update: jest.fn(() => mockClient),
    delete: jest.fn(() => mockClient),
    match: jest.fn(() => mockClient),
    maybeSingle: jest.fn(() => mockClient),
    then: jest.fn(callback => {
      callback(mockClient.data);
      return mockClient;
    }),
    data: null,
    error: null,
    count: jest.fn(() => mockClient),
    order: jest.fn(() => mockClient),
    limit: jest.fn(() => mockClient),
    range: jest.fn(() => mockClient),
    in: jest.fn(() => mockClient),
    not: jest.fn(() => mockClient),
    like: jest.fn(() => mockClient),
    ilike: jest.fn(() => mockClient),
    or: jest.fn(() => mockClient),
    and: jest.fn(() => mockClient),
    contains: jest.fn(() => mockClient),
    containedBy: jest.fn(() => mockClient),
    gt: jest.fn(() => mockClient),
    gte: jest.fn(() => mockClient),
    lt: jest.fn(() => mockClient),
    lte: jest.fn(() => mockClient),
    neq: jest.fn(() => mockClient),
    success: true,
  };

  return mockClient as unknown as SupabaseClient;
};
