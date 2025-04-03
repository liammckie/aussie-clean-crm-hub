
# Type Inconsistencies

## Overview
This document tracks known type inconsistencies, TypeScript issues, and type-related challenges in the Aussie Clean ERP system. It serves as a reference for developers to understand existing type quirks and their proper handling.

## Common Type Patterns

### Null vs. Undefined
- **Standard**: Use `undefined` for optional properties and parameters
- **Exception**: API responses may return `null` for absent values
- **Handling Pattern**: Use optional chaining (`?.`) and nullish coalescing (`??`)

### Date Handling
- **Database Storage**: Dates stored as ISO strings in database
- **API Transmission**: Dates transmitted as ISO strings
- **Client Usage**: Parsed to Date objects for manipulation
- **Known Issue**: Inconsistent date format in legacy integrations

### ID Types
- **Internal IDs**: UUIDs as strings
- **External IDs**: Various formats from external systems (numeric, alphanumeric)
- **Type Definition**: `type ID = string;` with more specific subtypes

## Entity-Specific Type Issues

### Client Entity

#### ABN/ACN Format
- **Type Definition**: `type ABN = string;` and `type ACN = string;`
- **Validation**: Regex patterns for format validation
- **Inconsistency**: Some legacy records may not conform to current validation
- **Handling**: Validation function `isValidABN(abn: string): boolean`

#### Contact Information
- **Type Challenge**: Flexible contact structure vs. type safety
- **Current Solution**: Discriminated union for contact types
```typescript
type ContactType = 'primary' | 'billing' | 'operations' | 'emergency';

interface Contact {
  type: ContactType;
  name: string;
  position?: string;
  email: string;
  phone?: string;
  mobile?: string;
}
```
- **Known Issue**: Inconsistent presence of optional fields

### Contract Entity

#### Contract Values
- **Type Challenge**: Supporting both fixed and variable pricing models
- **Current Solution**: 
```typescript
type PricingModel = 'fixed' | 'variable' | 'mixed';

interface ContractValue {
  model: PricingModel;
  fixedValue?: number;
  variableTerms?: string;
  estimatedTotal?: number;
}
```
- **Inconsistency**: Historical contracts may not have `model` specified

#### Date Ranges
- **Type Definition**:
```typescript
interface DateRange {
  startDate: string; // ISO format
  endDate: string; // ISO format
}
```
- **Edge Case**: Open-ended contracts using far-future end dates
- **Recommended Handling**: Use `isOpenEnded()` helper function

## API Response Handling

### Supabase Responses
- **Type Challenge**: Handling potential nulls in joined queries
- **Pattern**:
```typescript
interface ClientWithSites {
  id: string;
  name: string;
  sites: {
    id: string;
    name: string;
  }[] | null;
}
```
- **Recommended Approach**: Default to empty array when null
```typescript
const sites = clientWithSites.sites ?? [];
```

### Xero API Integration
- **Type Inconsistency**: Xero API returns some numeric values as strings
- **Handling Pattern**: Explicit conversion using Number() or parseInt()
- **Example**: `const amount = Number(xeroInvoice.amount);`

## Form Data Types

### Form Submission vs. API Types
- **Challenge**: Form data structure differs from API entity structure
- **Pattern**: Conversion function between forms
```typescript
function clientFormToApiClient(formData: ClientFormData): APIClient {
  // Transformation logic
}
```

### File Upload Types
- **Type Definition**:
```typescript
interface DocumentUpload {
  file: File;
  type: string;
  relatedEntity: {
    type: 'client' | 'site' | 'contract';
    id: string;
  };
  metadata: Record<string, unknown>;
}
```
- **Known Issue**: Inconsistent metadata structure

## State Management Types

### Form State
- **Type Pattern**: Using generic state type with status
```typescript
type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormState<T> {
  status: FormStatus;
  data: T;
  errors?: Record<keyof T, string>;
  message?: string;
}
```

### Query Results
- **Type Pattern**: Consistent React Query result typing
```typescript
interface QueryResult<T> {
  data?: T;
  isLoading: boolean;
  isError: boolean;
  error?: Error;
}
```

## Known Type Workarounds

### Third-Party Library Issues

#### Recharts Type Conflicts
- **Issue**: Recharts prop types conflict with strict TypeScript settings
- **Workaround**: Type assertions for certain chart properties
- **Example**: `<LineChart data={data as any} />`
- **Tracking**: Issue #123 - Plan to replace with type-safe solution

#### Form Library Type Gaps
- **Issue**: Incomplete types for nested form fields
- **Workaround**: Custom type guards and assertions
- **Example**: Custom `isValidNestedField()` function

## Type Enforcement Guidelines

### TypeScript Compiler Settings
- **strictNullChecks**: Enabled
- **noImplicitAny**: Enabled
- **strictFunctionTypes**: Enabled

### ESLint Rules
- **@typescript-eslint/no-explicit-any**: Warning
- **@typescript-eslint/explicit-function-return-type**: Enforced for exported functions
- **@typescript-eslint/no-unnecessary-type-assertion**: Error

## Type Improvement Roadmap

### Planned Enhancements
1. Replace remaining `any` types with proper interfaces
2. Add branded types for ID fields to prevent mixing
3. Implement io-ts or Zod for runtime type validation
4. Generate TypeScript types from API schema

### Deprecation Schedule
- Q2 2025: Remove legacy date format support
- Q3 2025: Enforce strict client contact structure
- Q4 2025: Remove support for unspecified contract pricing models
