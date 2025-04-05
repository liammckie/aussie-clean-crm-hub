# Contract Testing Guide

## Overview

This document outlines testing strategies specifically for the contract management module. Proper testing ensures contract creation, modification, and financial calculations work correctly across the application.

## Test Categories

### Unit Tests

Test individual contract-related functions in isolation:

```typescript
// Example: Test contract total calculation
describe('Contract Calculations', () => {
  it('correctly calculates weekly value based on billing lines', () => {
    const billingLines = [
      { client_charge: 100, frequency: 1, unit: 'per week', is_active: true },
      { client_charge: 200, frequency: 2, unit: 'per week', is_active: true }
    ];
    expect(calculateContractTotals(billingLines).weekly).toBe(500);
  });
});
```

### Integration Tests

Test contract workflows across components:

```typescript
// Example: Test contract creation and retrieval flow
describe('Contract Creation Flow', () => {
  it('creates contract and retrieves it successfully', async () => {
    // 1. Create contract
    // 2. Verify it exists in database
    // 3. Test retrieval via API
  });
});
```

### Mock Data Testing

Tests using sample data:

```typescript
// Example: Test sample contract generation
describe('Sample Contract Generation', () => {
  it('creates valid sample contracts', () => {
    const mockClientId = 'test-client-123';
    const contract = generateSampleContract(mockClientId);
    expect(contract).toHaveProperty('client_id', mockClientId);
    expect(contract.total_weekly_value).toBeGreaterThan(0);
    // More assertions...
  });
});
```

## Testing Interfaces

### API Testing

Test contract service API functions:

```typescript
// Example test structure for contract API
describe('Contract API', () => {
  it('retrieves contracts with correct structure', async () => {
    const response = await contractService.getAllContracts();
    expect('data' in response).toBe(true);
    if ('data' in response) {
      expect(Array.isArray(response.data)).toBe(true);
    }
  });
});
```

### UI Component Testing

Test contract UI components:

```typescript
// Example: Testing contract table rendering
describe('ContractsTable', () => {
  it('renders contracts correctly', () => {
    const contracts = [/* sample contracts */];
    render(<ContractsTable contracts={contracts} />);
    expect(screen.getByText(contracts[0].contract_name)).toBeInTheDocument();
  });
});
```

## Sample Data Testing

### Setting Up Test Data

Create reliable test data fixtures:

```typescript
// Example: Contract test fixtures
export const contractFixtures = {
  valid: {
    client_id: 'test-client-id',
    contract_name: 'Test Contract',
    contract_code: 'TEST001',
    // Other required fields...
  },
  invalid: {
    // Missing required fields
    client_id: 'test-client-id'
  },
  // More test cases...
};
```

### Using createSampleContracts for Testing

Guidelines for using the sample contract generator in tests:

1. Mock database calls in tests
2. Verify sample data structure before database insertion
3. Test edge cases with various client configurations
4. Verify financial calculations match expected outcomes

## Testing for Common Issues

### Address These Issues in Tests

1. **Client Reference Integrity**
   - Test contract creation with non-existent clients
   - Verify proper error handling for invalid client IDs

2. **Date Range Validation**
   - Test contracts with invalid date ranges
   - Verify that end dates must be after start dates

3. **Financial Calculation Accuracy**
   - Test contract total calculations with various billing line configurations
   - Verify database triggers correctly update contract totals

4. **Bulk Operations**
   - Test creating multiple contracts concurrently
   - Verify manager assignment across multiple contracts

## Debugging Contract Issues

### Common Contract Loading Problems

1. **Database Connection Issues**
   - Check for authentication errors in Supabase logs
   - Verify RLS policies allow contract creation

2. **Data Structure Problems**
   - Validate contract data structure against database schema
   - Check for missing required fields

3. **Client Reference Issues**
   - Verify client IDs exist before creating contracts
   - Check for client ID formatting issues

4. **Silent API Failures**
   - Add comprehensive error logging
   - Verify error responses are properly handled

## Implementing Test-First Development

For new contract features:

1. Write failing tests first
2. Implement minimal code to pass tests
3. Refactor for clarity and maintainability
4. Add edge case tests
5. Document test patterns for the feature

## Contract Test Checklist

- [ ] Unit tests for contract calculations
- [ ] API tests for CRUD operations
- [ ] UI component rendering tests
- [ ] Sample data generation tests
- [ ] Error handling tests
- [ ] Performance tests for bulk operations
- [ ] Integration tests for contract workflows

## Recommended Tools

- **Jest**: For unit and integration testing
- **Testing Library**: For component testing
- **MSW (Mock Service Worker)**: For API mocking
- **Faker**: For generating realistic test data
- **Cypress**: For end-to-end testing

## Implementing Contract Test Fixtures

Add test fixtures in `src/utils/__tests__/contractFixtures.ts` to simplify testing:

```typescript
// Example fixture implementation
export const validContractFixture = {
  client_id: '00000000-0000-0000-0000-000000000000',
  contract_name: 'Test Contract',
  contract_code: 'TEST001',
  service_type: 'Cleaning',
  status: 'active',
  // Add all required fields...
};
```

Use fixtures in tests to ensure consistent test data.
