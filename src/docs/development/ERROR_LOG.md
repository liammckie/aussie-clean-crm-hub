
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
- The `SupplierWithContract` interface incorrectly defined the `suppliers` property as a single object when the Supabase query was returning an array of supplier objects.
- Type mismatch between the interface definition and the actual data structure returned from the database.

**Solution:**
1. Updated the `SupplierWithContract` interface to correctly define the `suppliers` property as an array
2. Modified the ContractSuppliersTab component to access supplier data using array indexing (suppliers[0])
3. Documented the expected data shape in comments to prevent future mismatches
4. Added proper interface for the database-level `SupplierContract` table structure
5. Added utility functions for mapping between database and frontend data structures

**Files Modified:**
- `src/types/supplier-contract-types.ts`
- `src/components/contracts/ContractSuppliersTab.tsx`
- `src/utils/db-type-helpers.ts`

### Client and Site Schema Updates (Fixed: 2025-04-08)

**Error:**
Database schema and TypeScript interfaces were not aligned for clients and sites tables.

**Root Cause:**
- Missing fields in TypeScript interfaces for newly added database columns
- Lack of validation for phone and email fields in client data

**Solution:**
1. Added `phone` and `address` fields to Client interfaces
2. Added `description` field to Site interfaces
3. Updated database schema with appropriate columns
4. Added validation functions and schemas for phone and email fields
5. Updated form components to include the new fields
6. Added validation triggers in the database to ensure data integrity

**Files Modified:**
- `src/types/database-schema.ts`
- `src/services/client/types.ts`
- `src/components/site/SiteFormTypes.ts`
- `src/utils/db-type-helpers.ts`
- `src/components/client/ClientFormFields.tsx`
- `src/components/site/form/SiteAdditionalFields.tsx`
- `src/docs/development/SCHEMA_CHANGELOG.md`

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

### Database Schema and TypeScript Interface Mismatches (Fixed: 2025-04-06)

**Error:**
Various TypeScript errors due to mismatches between database schema and TypeScript interfaces

**Root Cause:**
- Inconsistencies between database column names/types and TypeScript interfaces
- Missing type definitions for some database tables
- Lack of proper utility functions for mapping between database and frontend data structures

**Solution:**
1. Added comprehensive `SupplierContract` interface that directly maps to the database table structure
2. Enhanced `db-type-helpers.ts` with utilities for mapping between snake_case and camelCase naming conventions
3. Updated Zod schemas to properly validate database data
4. Added documentation to clarify the data flow between database and frontend

**Files Modified:**
- `src/types/supplier-contract-types.ts`
- `src/utils/db-type-helpers.ts`

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
   - Document expected data shapes with comments

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
- **Database Schema Validation**: Regular checks between TypeScript interfaces and actual database schema

## Schema vs TypeScript Interface Mismatches (Fixed: 2025-04-06)

**Error:**
```
error TS2352: Conversion of type '{ suppliers: { supplier_id: any; supplier_name: any; supplier_type: any; status: any; abn: any; }[]; link_id: any; role: any; status: any; services: any; percentage: any; assigned_at: any; }[]' to type 'SupplierWithContract[]' may be a mistake...
```

**Root Cause:**
- The shape of the data returned by Supabase's foreign table joins didn't match our TypeScript interface expectations
- The `suppliers` property in the data returned from Supabase contained an array of supplier objects, not a single object as our TypeScript interface incorrectly defined

**Solution:**
1. Analyzed the actual data structure returned by Supabase
2. Updated the `SupplierWithContract` interface to correctly match the expected structure with suppliers as an array
3. Added a proper database-level `SupplierContract` interface that directly maps to the table structure
4. Added utility functions for mapping between database snake_case and frontend camelCase naming conventions
5. Added detailed comments to clarify the expected data shapes and relationships

**Prevention Measures:**
- Add schema validation checks (using Zod) to validate database responses match expected shapes
- Create unit tests that verify the structure of mock responses matches interface definitions
- Document join query patterns and their return types for easier reference
- Generate TypeScript types from database schema to ensure consistency
- Regular reviews to ensure TypeScript interfaces stay in sync with database schema changes
