
# TypeScript Type System Guide

## Overview

This guide addresses common type system issues in the Aussie Clean ERP and provides guidance for maintaining type consistency across the application. Following these guidelines will help prevent the type errors that have occurred in the project.

## Common Type Issues

### Issue 1: Re-exporting Types with isolatedModules

When re-exporting types from other modules with TypeScript's `isolatedModules` enabled, you must use `export type` syntax:

```typescript
// ❌ Incorrect - will cause errors with isolatedModules
export { AddressType } from '@/types/form-types';

// ✅ Correct - works with isolatedModules
export type { AddressType } from '@/types/form-types';
```

### Issue 2: Type Compatibility Across Modules

Ensure that types used across multiple modules remain compatible:

```typescript
// ❌ Inconsistent type definitions
// In module A:
type AddressType = 'billing' | 'shipping';

// In module B:
type AddressType = 'billing' | 'physical'; // Incompatible!

// ✅ Consistent type definitions
// Define in one location and import:
import type { AddressType } from '@/types/form-types';
```

### Issue 3: Record Type Completeness

When using Record types, ensure all possible keys are accounted for:

```typescript
// ❌ Incomplete record type
const addressTypes: Record<AddressType, string> = {
  'billing': 'Billing Address',
  'physical': 'Physical Address'
  // Missing other address types!
};

// ✅ Complete record type
const addressTypes: Record<AddressType, string> = {
  'billing': 'Billing Address',
  'physical': 'Physical Address',
  'postal': 'Postal Address',
  'shipping': 'Shipping Address',
  'head_office': 'Head Office',
  'branch': 'Branch Address',
  'residential': 'Residential Address',
  'commercial': 'Commercial Address',
  'warehouse': 'Warehouse Address',
  'site': 'Site Address'
};
```

## Canonical Type Sources

To prevent inconsistencies, always import types from their canonical source:

### Form-Related Types

```typescript
import type { 
  AddressType, 
  ContactType, 
  UnifiedAddressFormData,
  UnifiedContactFormData
} from '@/types/form-types';
```

### Entity Types

```typescript
import type { EntityType } from '@/services/unified/types';
```

### Domain-Specific Types

```typescript
import type { ClientStatus } from '@/services/client/types';
import type { SiteStatus } from '@/services/site/types';
```

## Type Validation Maps

When you need to use a type in multiple places (like form validation, UI display, etc.), create a single source of truth:

```typescript
// In a central location (form-types.ts)
export type AddressType = 'billing' | 'postal' | 'physical' | 'shipping' | 
  'head_office' | 'branch' | 'residential' | 'commercial' | 'warehouse' | 'site';

// Create a validation schema that matches
export const addressTypeSchema = z.enum([
  'billing', 'postal', 'physical', 'shipping', 'head_office', 'branch', 
  'residential', 'commercial', 'warehouse', 'site'
]);

// Create display maps that cover all cases
export const addressTypeLabels: Record<AddressType, string> = {
  'billing': 'Billing Address',
  'postal': 'Postal Address',
  'physical': 'Physical Address',
  'shipping': 'Shipping Address',
  'head_office': 'Head Office',
  'branch': 'Branch Office',
  'residential': 'Residential',
  'commercial': 'Commercial',
  'warehouse': 'Warehouse',
  'site': 'Site'
};
```

## Type Extension vs. Redefinition

When you need to modify an existing type:

```typescript
// ❌ Avoid redefinition
export type ClientStatus = 'Active' | 'Inactive'; // Loses compatibility

// ✅ Use type extension
import type { BaseClientStatus } from '@/types/base-types';
export type ClientStatus = BaseClientStatus | 'Pending Review';
```

## Type Safety Checklist

When implementing or modifying components:

1. **Verify Type Sources**: Import types from canonical sources
2. **Check Enum Compatibility**: Ensure enums match across validation schemas and TypeScript types
3. **Verify Record Completeness**: Check that all enum values are covered in Record types
4. **Use Export Type**: Use `export type` when re-exporting types with `isolatedModules`
5. **Check Form Validation**: Ensure Zod schemas match TypeScript types

## Recent Type Issues and Resolutions

### Issue: AddressType Export and Coverage

**Problem:**
- `AddressType` was not properly exported from client types
- `AddressType` usage in forms didn't match the full type definition
- Record types for AddressType were incomplete

**Resolution:**
1. Use `export type { AddressType }` in re-exports
2. Update form validation schemas to include all address types
3. Update Record types to cover all possible values

### Issue: ContactType Inconsistencies

**Problem:**
- `ContactType` values in components didn't match type definitions
- Some ContactType values were missing from UI components

**Resolution:**
1. Ensure all form fields use the full ContactType definitions
2. Update UI components to accommodate all possible values
3. Maintain a single source of truth for ContactType definitions

## Recommended Type System Improvements

1. **Create Type Registries**: Centralize related types in registry files
2. **Generate Type Documentation**: Create automated documentation for types
3. **Type Testing**: Implement TypeScript tests to verify type compatibility
4. **UI Type Coverage**: Ensure UI components handle all possible type values
5. **Form-DB Type Mapping**: Create explicit mappings between form types and database types

By following these guidelines, we can maintain type consistency and prevent the recurrence of type-related errors throughout the application.
