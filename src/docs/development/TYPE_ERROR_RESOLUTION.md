
# TypeScript Error Resolution Guide

## Common Type Errors

This guide addresses specific TypeScript errors that have occurred in the Aussie Clean ERP system and provides solutions to resolve them.

## Error Categories

### 1. Module Export Errors

#### Error Pattern: `error TS2305: Module has no exported member 'X'`

Example:
```
error TS2305: Module '"@/services/client"' has no exported member 'AddressType'.
```

**Root Causes:**
- The member is not exported from the module
- The export syntax is incorrect
- The member is imported from the wrong module

**Solutions:**

1. Verify the export exists:
```typescript
// Check if AddressType is actually exported from @/services/client
```

2. Fix the export syntax:
```typescript
// When using isolatedModules, use 'export type'
export type { AddressType } from '@/types/form-types';
```

3. Import from the correct module:
```typescript
// Import from the canonical source
import type { AddressType } from '@/types/form-types';
```

### 2. Type Assignment Errors

#### Error Pattern: `error TS2322: Type 'X' is not assignable to type 'Y'`

Example:
```
error TS2322: Type 'AddressType' is not assignable to type '"billing" | "physical" | "postal"'.
  Type '"site"' is not assignable to type '"billing" | "physical" | "postal"'.
```

**Root Causes:**
- The type is defined differently in different places
- A Zod schema doesn't match the TypeScript type
- An enum value was added to one definition but not another

**Solutions:**

1. Align type definitions:
```typescript
// Ensure the TypeScript type and Zod schema match
export type AddressType = 'billing' | 'physical' | 'postal' | 'site' | /* other values */;

export const addressTypeSchema = z.enum([
  'billing', 'physical', 'postal', 'site', /* other values */
]);
```

2. Ensure all usage sites are updated:
```typescript
// Update component prop types and validation
interface Props {
  addressType: AddressType; // Already includes all possible values
}
```

3. Use type assertions when needed:
```typescript
// Only use when you're absolutely certain the type is correct
const addressType = value as AddressType;
```

### 3. Object Literal Errors

#### Error Pattern: `error TS2353: Object literal may only specify known properties`

Example:
```
error TS2353: Object literal may only specify known properties, and ''site'' does not exist in type 'Record<AddressType, string>'.
```

**Root Causes:**
- Record type is missing keys that are being added
- The keys in a mapping don't match the type definition
- New enum values were added but mappings weren't updated

**Solutions:**

1. Ensure Record types include all possible keys:
```typescript
// Update the record to include all possible address types
const addressLabels: Record<AddressType, string> = {
  'billing': 'Billing',
  'physical': 'Physical',
  'postal': 'Postal',
  'site': 'Site',
  'shipping': 'Shipping',
  'head_office': 'Head Office',
  'branch': 'Branch',
  'residential': 'Residential', 
  'commercial': 'Commercial',
  'warehouse': 'Warehouse'
};
```

2. Add missing properties:
```typescript
// For each property in the error message, add it to the Record
```

3. Use a helper to verify completeness:
```typescript
// Optional utility to catch missing keys at runtime
function ensureComplete<K extends string, V>(
  record: Record<K, V>,
  keys: readonly K[]
): Record<K, V> {
  for (const key of keys) {
    if (!(key in record)) {
      console.error(`Missing key: ${key}`);
    }
  }
  return record;
}

// Usage
const addressLabels = ensureComplete({
  'billing': 'Billing',
  // ... other entries
}, Object.values(AddressType));
```

### 4. Mock Function Return Type Errors

#### Error Pattern: `error TS2345: Argument of type 'X' is not assignable to parameter of type 'never'`

Example:
```
error TS2345: Argument of type 'SuccessResponse<{ id: string; business_name: string; }>' is not assignable to parameter of type 'never'.
```

**Root Causes:**
- The mock function's return type is not properly defined
- Type definitions for mock functions don't match actual implementation
- Union types are not properly handled in mock setup

**Solutions:**

1. Create helper functions for mock responses:
```typescript
// Create helper functions for consistent mock response types
export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return { data, error: null };
}

export function createErrorResponse(
  category: ErrorCategory, 
  message: string, 
  details?: any
): ErrorResponse {
  return { category, message, details };
}
```

2. Use type guards for handling union types:
```typescript
// Create a type guard for checking response types
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is SuccessResponse<T> {
  return 'data' in response && response.error === null;
}

// Usage in tests
if (isSuccessResponse(result)) {
  expect(result.data).toEqual(mockData);
} else {
  throw new Error('Expected success response');
}
```

3. Ensure mock implementations match the expected types:
```typescript
// Properly type the mock function implementation
(serviceFunction as jest.Mock<Promise<ApiResponse<typeof mockData>>>)
  .mockResolvedValue(createSuccessResponse(mockData));
```

## Recent Errors and Solutions

### Error 1: AddressType Import Error

**Error:**
```
src/components/client/AddressForm.tsx(23,10): error TS2305: Module '"@/services/client"' has no exported member 'AddressType'.
```

**Solution:**
```typescript
// Instead of importing from services/client
import { AddressType } from '@/services/client';

// Import from the canonical source
import type { AddressType } from '@/types/form-types';
```

### Error 2: AddressType Re-export Error

**Error:**
```
src/services/client/types.ts(15,10): error TS1205: Re-exporting a type when 'isolatedModules' is enabled requires using 'export type'.
```

**Solution:**
```typescript
// Instead of
export { AddressType };

// Use export type
export type { AddressType };
```

### Error 3: Mock Function Return Type Errors

**Error:**
```
src/tests/client/client-service.test.ts(65,66): error TS2345: Argument of type 'SuccessResponse<{ id: string; business_name: string; }[]>' is not assignable to parameter of type 'never'.
```

**Solution:**
```typescript
// Create a test utilities file with proper type definitions
// src/tests/utils/test-helpers.ts
export interface SuccessResponse<T = any> {
  data: T;
  error: null;
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return { data, error: null };
}

// Use in tests with proper typing:
const mockResponse = createSuccessResponse(mockData);
(clientService.getClientById as jest.Mock<Promise<ApiResponse<typeof mockData>>>)
  .mockResolvedValue(mockResponse);
```

### Error 4: ErrorCategory Enum Consistency

**Error:**
```
src/tests/utils/test-helpers.ts(55,12): error TS2322: Type 'string' is not assignable to type 'ErrorCategory'.
```

**Solution:**
```typescript
// Import the ErrorCategory enum rather than using string literals
import { ErrorCategory } from '@/utils/supabaseErrors';

export function createErrorResponse(
  category: ErrorCategory,  // Use the enum type
  message: string,
  details?: any
): ErrorResponse {
  return { category, message, details };
}
```

### Error 5: Service Refactoring to Avoid Large Files

**Error:**
Large service files with multiple responsibilities making maintenance difficult.

**Solution:**
```typescript
// Split services by domain functionality
// 1. Main service as facade
export const clientService = {
  ...clientCrudService,
  ...clientContactService,
  ...clientAddressService
};

// 2. Create domain-specific services
export const clientCrudService = {
  getAllClients: async () => { /* implementation */ },
  getClientById: async (id) => { /* implementation */ },
  // ...
};

export const clientContactService = {
  getClientContacts: async (clientId) => { /* implementation */ },
  createClientContact: async (clientId, contactData) => { /* implementation */ },
  // ...
};
```

## Preventing Future Errors

1. **Centralize Type Definitions**
   - Define each type in exactly one location
   - Import from canonical sources

2. **Create Test Utilities for Common Patterns**
   - Create helper functions for mocks and assertions
   - Ensure consistent typing across all tests

3. **Use Type Guards for Union Types**
   - Implement proper type checking for discriminated unions
   - Create reusable type guards for response types

4. **Document Type Dependencies**
   - Create and maintain documentation for type relationships
   - Document the expected values for enums and their uses

5. **Use IDE Tools**
   - Leverage IDE features to find type references
   - Use the TypeScript Language Server to verify type compatibility

6. **Implement Comprehensive Error Logging**
   - Add detailed error context to all API calls
   - Log both client and server-side errors consistently
   - Use structured error objects with categorization

7. **Add Testing Framework**
   - Create unit tests for core business logic
   - Implement integration tests for critical workflows
   - Add contract test fixtures for reliable testing

8. **Implement Service Segregation**
   - Split large service files by domain functionality
   - Create focused service modules with clear responsibilities
   - Use facade pattern to maintain backwards compatibility

## Additional Resources

- [Official TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Error Reference](https://www.typescriptlang.org/docs/handbook/error-reference/)
- [Jest Testing Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Documentation](https://testing-library.com/docs/)
- [Zod Schema Validation](https://zod.dev/)
