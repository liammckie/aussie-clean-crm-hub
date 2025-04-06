
# Error Log

## Overview

This document tracks errors encountered during development and their resolutions. It serves as a knowledge base for common issues and their solutions.

## TypeScript Errors

### Type Inconsistency in Supplier Contract Relationship (Fixed: 2025-04-06)

**Error:**
```
error TS2352: Conversion of type '{ link_id: any; role: any; status: any; services: any; percentage: any; assigned_at: any; suppliers: { supplier_id: any; supplier_name: any; supplier_type: any; status: any; abn: any; }[]; }[]' to type 'SupplierWithContract[]' may be a mistake...
```

**Root Cause:**
- The `SupplierWithContract` interface expected a single supplier object in the `suppliers` property, but the Supabase query was returning an array of supplier objects.
- Type mismatch between the interface definition and the actual data structure returned from the database.

**Solution:**
1. Updated the query transformation to correctly map the nested data structure
2. Revised the supplier contract type definitions to match the actual database schema
3. Implemented proper error handling with try/catch blocks in the query function

**Files Modified:**
- `src/types/supplier-contract-types.ts`
- `src/components/contracts/ContractSuppliersTab.tsx`

### React Query v5 API Changes (Fixed: 2025-04-06)

**Error:**
```
error TS2339: Property 'isLoading' does not exist on type 'UseMutationResult<void, Error, { ... }, unknown>'.
```

**Root Cause:**
- React Query v5 renamed `isLoading` to `isPending` in mutation results

**Solution:**
- Updated references from `isLoading` to `isPending` in mutation usage

**Files Modified:**
- `src/components/contracts/ContractSuppliersTab.tsx`

### Badge Component Variant Missing (Fixed: 2025-04-06)

**Error:**
```
error TS2322: Type '"destructive" | "outline" | "success"' is not assignable to type '"secondary" | "default" | "destructive" | "outline"'.
  Type '"success"' is not assignable to type '"secondary" | "default" | "destructive" | "outline"'.
```

**Root Cause:**
- The Badge component's variant prop did not include a "success" option that was being used in the code

**Solution:**
- Added a new "success" variant to the Badge component that styles it with green background

**Files Modified:**
- `src/components/ui/badge.tsx`

## API and Data Handling Errors

### Inconsistent Error Handling Patterns

**Issue:**
- Error handling patterns were inconsistent across different components and services
- Missing structured error categorization and standardized user messaging

**Solution:**
- Created a centralized error handling utility (`error-types.ts`)
- Standardized error categories and response formats
- Implemented try/catch blocks with consistent error logging
- Updated components to handle errors with appropriate user feedback

**Files Modified:**
- Added `src/utils/logging/error-types.ts`
- Updated error handling in `src/components/contracts/ContractSuppliersTab.tsx`

## Future Error Prevention

### Code Review Checklist

To prevent similar errors in the future:

1. **Type Consistency**
   - Ensure interfaces match actual data structures
   - Verify nested object types, especially for database queries
   - Use explicit typing for database return values

2. **Library API Compatibility**
   - Check for breaking changes when using newer versions of libraries
   - Update references to renamed properties/methods

3. **Component Props Validation**
   - Verify custom component prop types before usage
   - Add new variants to components as needed before using them

4. **Error Handling Best Practices**
   - Use structured try/catch blocks in data fetching functions
   - Log errors with appropriate context information
   - Provide user-friendly error messages
   - Categorize errors consistently

### Automated Error Prevention

- **TypeScript Strict Mode**: Enabled for early type error detection
- **ESLint Rules**: Configured to catch common type and error handling issues
- **Unit Tests**: Added for critical data transformation and validation logic
