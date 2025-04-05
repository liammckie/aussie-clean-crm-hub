
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

### Error 3: AddressType Compatibility Error

**Error:**
```
src/components/client/AddressForm.tsx(62,7): error TS2322: Type 'AddressType' is not assignable to type '"billing" | "physical" | "postal"'.
  Type '"site"' is not assignable to type '"billing" | "physical" | "postal"'.
```

**Solution:**
```typescript
// Update the Zod schema to include all possible address types
const addressSchema = z.object({
  // other fields...
  address_type: z.enum([
    'billing', 'postal', 'physical', 'shipping', 'head_office', 'branch',
    'residential', 'commercial', 'warehouse', 'site'
  ]),
});
```

### Error 4: Record Completeness Error

**Error:**
```
src/components/shared/AddressTable.tsx(73,11): error TS2740: Type '{ billing: string; postal: string; physical: string; }' is missing the following properties from type 'Record<AddressType, string>': site, shipping, head_office, branch, and 3 more.
```

**Solution:**
```typescript
// Update the typeMap in AddressTable.tsx to include all address types
const typeMap: Record<AddressType, string> = {
  'billing': 'Billing',
  'postal': 'Postal',
  'physical': 'Physical',
  'shipping': 'Shipping',
  'head_office': 'Head Office',
  'branch': 'Branch',
  'residential': 'Residential',
  'commercial': 'Commercial',
  'warehouse': 'Warehouse',
  'site': 'Site'
};
```

### Error 5: Contract API Error Handling

**Error:**
Sample contract loading fails silently with no clear error message

**Solution:**
```typescript
// Enhanced error handling in contract API calls
try {
  const response = await contractService.createContract(contractData);
  if ('category' in response) {
    console.error(`Contract creation failed: ${response.message}`);
    throw new Error(response.message);
  }
  return response.data;
} catch (error) {
  console.error('Contract creation error:', error);
  ErrorReporting.captureException(error, { 
    contractData: JSON.stringify(contractData),
    operation: 'createContract' 
  });
  throw error;
}
```

## Preventing Future Errors

1. **Centralize Type Definitions**
   - Define each type in exactly one location
   - Import from canonical sources

2. **Validate Type Changes**
   - When modifying a type, search the codebase for all usages
   - Update all dependent code when adding new enum values

3. **Use TypeScript Strict Mode**
   - Enable strict type checking in tsconfig.json
   - Don't use type assertions unnecessarily

4. **Test Type Changes**
   - Add TypeScript-specific tests for critical types
   - Verify type compatibility across modules

5. **Document Type Dependencies**
   - Create and maintain documentation for type relationships
   - Document the expected values for enums and their uses

6. **Use IDE Tools**
   - Leverage IDE features to find type references
   - Use the TypeScript Language Server to verify type compatibility

7. **Implement Comprehensive Error Logging**
   - Add detailed error context to all API calls
   - Log both client and server-side errors consistently
   - Use structured error objects with categorization

8. **Add Testing Framework**
   - Create unit tests for core business logic
   - Implement integration tests for critical workflows
   - Add contract test fixtures for reliable testing

## Additional Resources

- [Official TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Error Reference](https://www.typescriptlang.org/docs/handbook/error-reference/)
- [Zod Schema Validation](https://zod.dev/)
