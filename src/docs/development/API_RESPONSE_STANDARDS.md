
# API Response Standards Guide

## Overview

This document outlines our standardized approach to handling API responses throughout the application. By following these standards, we ensure consistent type safety and predictable error handling across all services.

## API Response Types

### Success Response

All successful API responses must follow this structure:

```typescript
interface ApiSuccessResponse<T> {
  data: T;
  message: string;
  count?: number; // Optional, for pagination
}
```

Example:
```typescript
const successResponse: ApiSuccessResponse<Client> = {
  data: clientData,
  message: 'Client created successfully'
};
```

### Error Response

All error responses must follow this structure:

```typescript
interface ApiErrorResponse {
  category: ErrorCategory; 
  message: string;
  details?: Record<string, any>;
  code?: string;
  status?: number;
}
```

Error categories are defined in `src/utils/logging/error-types.ts`:

```typescript
enum ErrorCategory {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  PERMISSION = 'permission',
  NOT_FOUND = 'not_found',
  DATABASE = 'database',
  SERVER = 'server',
  NETWORK = 'network',
  CLIENT = 'client',
  UNKNOWN = 'unknown'
}
```

Example:
```typescript
const errorResponse: ApiErrorResponse = {
  category: ErrorCategory.VALIDATION,
  message: 'Business name is required',
  details: { field: 'business_name' }
};
```

### Combined API Response Type

All service functions must return the union type:

```typescript
type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

## Type Guards

Always use type guards to narrow down API response types:

```typescript
// Check if response is an error
if (isApiError(response)) {
  // Handle error case
  console.error(response.category, response.message);
  return response;
}

// It's safe to access data since we've narrowed the type
const data = response.data;
```

## Helper Functions

Use the provided helper functions to create consistent responses:

```typescript
// Create a success response
return createSuccessResponse(data, 'Client created successfully');

// Create an error response
return formatError(ErrorCategory.VALIDATION, 'Validation failed', validationErrors);
```

## Type Assertions in Tests

When testing API responses, always use explicit types:

```typescript
const mockResponse: ApiResponse<Client> = createSuccessResponse(
  { id: '123', name: 'Test Client' },
  'Client created successfully'
);

// Use type guards in assertions
if (isSuccessResponse(result)) {
  expect(result.data.id).toEqual('123');
} else {
  fail('Expected success response but got error');
}
```

## Preventative Measures

- Run type checking in CI/CD pipelines
- Regenerate Supabase types regularly
- Use strict TypeScript compiler options
- Add detailed error logging

## Common Pitfalls

1. Never use `error: null` in success responses
   - INCORRECT: `{ data: clientData, error: null }`
   - CORRECT: `{ data: clientData, message: 'Client created successfully' }`

2. Never use raw booleans or strings as service responses
   - INCORRECT: `return true;` or `return "error";`
   - CORRECT: `return createSuccessResponse({ success: true }, 'Operation successful');`

3. Always specify explicit return types on service functions
   - INCORRECT: `async function createClient(data) {...}`
   - CORRECT: `async function createClient(data): Promise<ApiResponse<ClientData>> {...}`

4. Always use type guards before accessing properties
   - INCORRECT: `if (response.data) {...}`
   - CORRECT: `if (isApiSuccess(response)) {...}`
